interface IParserState {
  comment: boolean;
  field: string | null;
  value: string;
  fields: any;
  line: "";
  prev_c: string | null;
}

enum coordinates {
  ABSOLUTE,
  RELATIVE,
}

interface IState {
  line: number;
  coordinates: coordinates;
  extruder_coordinates: coordinates | null;
  x: number;
  y: number;
  z: number;
  e: number;
  feed_rate: number;
  units: string | null;
  layer: number;
}

interface IMinMax {
  min: number | null;
  max: number | null;
}

export interface IStatistics {
  x: IMinMax;
  y: IMinMax;
  feed_rate: IMinMax;
}

interface IMinimalState {
  x: number;
  y: number;
  e: number;
  feed_rate: number;
}

export interface IInstructions {
  f32: Float32Array;
  i8: Uint8Array;
}

export default class GCodeParser {
  private lineIndex: number[] = [];
  private currentByte = 0;

  private buffer: ArrayBuffer;
  private instructions: IInstructions;

  private parserState: IParserState = {
    comment: false,
    field: null,
    value: "",
    fields: {},
    line: "",
    prev_c: null,
  };

  private state: IState = {
    line: 1,
    coordinates: coordinates.ABSOLUTE,
    extruder_coordinates: null,
    x: 0,
    y: 0,
    z: 0,
    e: 0,
    feed_rate: 0,
    units: null,
    layer: 0,
  };

  private oldState: IMinimalState = {
    x: 0,
    y: 0,
    e: 0,
    feed_rate: 0,
  };

  private layerPositions: number[] = [];

  private statistics = {
    x: { min: null, max: null },
    y: { min: null, max: null },
    feed_rate: { min: null, max: null },
  };

  constructor(initialBufferSize?: number) {
    this.buffer = new ArrayBuffer(initialBufferSize || 1024 * 1024);
    this.instructions = {
      f32: new Float32Array(this.buffer),
      i8: new Uint8Array(this.buffer),
    };
  }

  getParsingResult() {
    return {
      buffer: this.buffer,
      instructions: this.instructions,
      layerPositions: this.layerPositions,
      statistics: this.statistics,
      lineIndex: this.lineIndex,
    };
  }

  parseChunk(chunk: ArrayBuffer) {
    this.parse(() => this.parseFields(new Uint8Array(chunk)));
    //for (let i = 0; i < newLines.length; ++i)
    //  completeParserState.lines.push(newLines[i]);
  }

  parse(dataFunc: any) {
    //let lines: string[] = [];

    for (let { line, fields } of dataFunc()) {
      this.lineIndex.push(this.currentByte);
      //console.log(line, fields);
      this.oldState.x = this.state.x;
      this.oldState.y = this.state.y;
      this.oldState.e = this.state.e;
      this.oldState.feed_rate = this.state.feed_rate;

      if (fields["G"] != undefined) {
        let G = fields["G"];
        if (G === 1 || G === 0) this.G1(this.state, fields);
        else if (G === 90) this.state.coordinates = coordinates.ABSOLUTE;
        else if (G === 91) this.state.coordinates = coordinates.RELATIVE;
      } else if (fields["M"] != undefined) {
        let M = fields["M"];
        if (M === 82) this.state.extruder_coordinates = coordinates.ABSOLUTE;
        else if (M === 83)
          this.state.extruder_coordinates = coordinates.RELATIVE;
      }

      if (this.state.line >= this.buffer.byteLength / 16) {
        console.log(
          `Resizing this.buffer at line ${this.state.line} to ${(
            (this.buffer.byteLength * 2) /
            1024 /
            1024
          ).toFixed(0)} megabytes`
        );
        let newBuffer = new ArrayBuffer(this.buffer.byteLength * 2);
        let newI8Array = new Uint8Array(newBuffer);
        newI8Array.set(this.instructions.i8, 0);

        this.buffer = newBuffer;
        this.instructions = {
          f32: new Float32Array(this.buffer),
          i8: new Uint8Array(this.buffer),
        };
      }

      this.handleStateChange(
        this.state.line,
        this.instructions,
        this.oldState,
        this.state,
        this.statistics
      );

      if (this.detectLayerChange(line)) {
        this.state.layer += 1;
        this.layerPositions.push(this.state.line);
      }
      this.state.line += 1;
      //lines.push(line);
    }
  }

  private *parseFields(data: Uint8Array) {
    const p = this.parserState;
    for (let i = 0; i < data.length; ++i) {
      this.currentByte += 1;
      let c = String.fromCharCode(data[i]);

      if (c === ";") p.comment = true;
      if (!p.comment) {
        // Field
        if (p.field === null && c >= "A" && c <= "Z") {
          p.field = c;
        }
        // Value
        else if (
          p.field !== null &&
          ((c >= "0" && c <= "9") || c === "." || c === "-")
        ) {
          p.value += c;
        }
        // Whitespace
        else if (
          (c === " " || c === "\t") &&
          p.field !== null &&
          p.value.length > 0
        ) {
          p.fields[p.field] = Number.parseFloat(p.value);
          p.field = null;
          p.value = "";
        }
      }

      // End of line
      if ((c == "\r" || c == "\n") && p.prev_c !== "\r") {
        if (p.field !== null && p.value.length > 0)
          p.fields[p.field] = Number.parseFloat(p.value);
        yield { line: p.line, fields: p.fields };
        p.line = "";
        p.fields = {};
        p.value = "";
        p.field = null;
        p.comment = false;
      } else {
        p.line += c;
      }
      p.prev_c = c;
    }
  }

  private updateStatistics(
    statistics: IStatistics,
    key: keyof IStatistics,
    value: number
  ) {
    let max = statistics[key].max;
    let min = statistics[key].min;
    if (max === null || value > max) statistics[key].max = value;
    if (min === null || value < min) statistics[key].min = value;
  }

  private handleStateChange(
    line: number,
    instructions: IInstructions,
    prev: IMinimalState,
    next: IMinimalState,
    statistics: IStatistics
  ) {
    if (prev.x != next.x || prev.y != next.y) {
      if (next.e > prev.e) {
        instructions.i8[line * 16] = 2;

        // we update the statistics here because they should
        // only count moves with actual extrusion
        this.updateStatistics(statistics, "x", next.x);
        this.updateStatistics(statistics, "y", next.y);
        this.updateStatistics(statistics, "feed_rate", prev.feed_rate);
      } else {
        instructions.i8[line * 16] = 1;
      }
      instructions.f32[line * 4 + 1] = next.x;
      instructions.f32[line * 4 + 2] = next.y;
    } else if (prev.feed_rate != next.feed_rate) {
      instructions.i8[line * 16] = 3;
      instructions.f32[line * 4 + 1] = next.feed_rate;
    }
  }

  private G1(state: IState, fields: any) {
    let x = fields["X"];
    let y = fields["Y"];
    let z = fields["Z"];
    let e = fields["E"];
    let f = fields["F"];

    if (state.coordinates === coordinates.ABSOLUTE) {
      if (x != undefined) state.x = x;
      if (y != undefined) state.y = y;
      if (z != undefined) state.z = z;
    } else if (state.coordinates === coordinates.RELATIVE) {
      if (x != undefined) state.x += x;
      if (y != undefined) state.y += y;
      if (z != undefined) state.z += z;
    }

    if (e != undefined && state.extruder_coordinates === coordinates.ABSOLUTE)
      state.e = e;
    else if (
      e != undefined &&
      state.extruder_coordinates === coordinates.RELATIVE
    )
      state.e += e;

    if (f != undefined) state.feed_rate = f;
  }

  private detectLayerChange(line: string) {
    // Only Slic3r support now
    return line.startsWith(";AFTER_LAYER_CHANGE");
  }
}
