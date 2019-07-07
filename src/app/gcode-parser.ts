/* 
Copyright 2019 Fabian Hiller

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 
*/

interface IMinMax {
  min: number;
  max: number;
}
export interface IStatistics {
  x: IMinMax;
  y: IMinMax;
  z: IMinMax;
  feed_rate: IMinMax;
  extruded_feed_rate: IMinMax;
}

const STATE_NONE = 0;
const STATE_FIELD = 1;
const STATE_COMMENT = 2;

const E = 4;
const F = 5;
const G = 6;
const M = 12;
const T = 19;
const X = 23;
const Y = 24;
const Z = 25;

const CHAR_0 = "0".charCodeAt(0);
const CHAR_9 = "9".charCodeAt(0);
const CHAR_DOT = ".".charCodeAt(0);
const CHAR_MINUS = "-".charCodeAt(0);
const CHAR_SPACE = " ".charCodeAt(0);
const CHAR_TAB = "\t".charCodeAt(0);
const CHAR_A = "A".charCodeAt(0);
const CHAR_Z = "Z".charCodeAt(0);
const CHAR_LF = "\n".charCodeAt(0);
const CHAR_CR = "\r".charCodeAt(0);
const CHAR_SEMICOLON = ";".charCodeAt(0);

export const COMMANDS = {
  MOVE_WITH_EXTRUSION: 1, // parameters: X,Y
  MOVE_WITHOUT_EXTRUSION: 2, // parameters: X,Y
  SET_FEED_RATE: 3, // parameters: F
  RETRACTION: 4,
  LAYER_CHANGE: 5, // parameters: Z
  TOOL_CHANGE: 6
};

const INSTRUCTION_ARRAY_BLOCK_SIZE = 1024 * 32;

const LOOKUP_BEFORE_DOT = [1, 10, 100, 1000, 10000, 100000, 1000000];
const LOOKUP_AFTER_DOT = [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001];

export default class GCodeParser {
  state = STATE_NONE;
  field: number = 0;
  value_start: number | undefined;
  dot_position: number | undefined;
  prev_character: number | undefined;
  field_values = new Float32Array(27);

  axis_coordinates_absolute = true;
  extruder_coordinates_absolute = false;
  feed_rate = 0;
  current_tool = 0;

  // for layer change detection
  prev_z: number = 0;
  last_z_with_extrusion: number | undefined;
  last_feed_rate_with_extrusion: number | undefined;
  current_layer_index = 0;
  layer_positions: number[] = [];
  layer_heights: number[] = [];

  prev_x = 0;
  prev_y = 0;
  prev_e = 0;

  instructions = new Instructions(INSTRUCTION_ARRAY_BLOCK_SIZE);

  byte_index = 0;
  //line_index: number[] = [];

  last_block: Uint8Array | undefined;

  constructor() {
    this.field_values.fill(NaN);
  }

  statistics = {
    x: {
      min: Infinity,
      max: -Infinity
    },
    y: {
      min: Infinity,
      max: -Infinity
    },
    z: {
      min: 0,
      max: -Infinity
    },
    feed_rate: {
      min: Infinity,
      max: -Infinity
    },
    extruded_feed_rate: {
      min: Infinity,
      max: -Infinity
    }
  };

  parse(gcodeArrayBuffer: ArrayBuffer) {
    const data = new Uint8Array(gcodeArrayBuffer);
    var c;

    for (let i = 0; i < data.length; ++i) {
      c = data[i];
      if ((c >= CHAR_0 && c <= CHAR_9) || c === CHAR_DOT || c === CHAR_MINUS) {
        //if (STATE_FIELD) {
        //value += c;
        //}
        if (c === CHAR_DOT) this.dot_position = i;
      } else if (c === CHAR_SPACE || c === CHAR_TAB) {
        if (this.state === STATE_FIELD && this.value_start) {
          if (this.last_block !== undefined) {
            // Special handling for numbers that cross the boundary of data blocks
            const temp_data = new Uint8Array(
              Array.from(this.last_block).concat(Array.from(data.slice(0, i)))
            );
            let temp_dot_position = temp_data.length;
            for (let j = 0; j < temp_data.length; ++j) {
              if (temp_data[j] === CHAR_DOT) temp_dot_position = j;
            }
            this.field_values[this.field - 65] = this.pFloat(
              temp_data,
              0,
              temp_data.length,
              temp_dot_position
            );
            this.last_block = undefined;
          } else {
            // regular float handling
            this.field_values[this.field - 65] = this.pFloat(
              data,
              this.value_start,
              i,
              this.dot_position ? this.dot_position : i
            );
          }
          this.value_start = undefined;
          this.dot_position = undefined;
          this.state = STATE_NONE;
        }
      } else if (c >= CHAR_A && c <= CHAR_Z) {
        if (this.state === STATE_NONE) {
          this.field = data[i];
          this.state = STATE_FIELD;
          this.value_start = i + 1;
          //console.log("F", this.field);
        }
      } else if (
        (c === CHAR_CR || c === CHAR_LF) &&
        (this.prev_character !== CHAR_CR && this.prev_character !== CHAR_LF)
      ) {
        if (STATE_FIELD && this.value_start) {
          this.field_values[this.field - 65] = this.pFloat(
            data,
            this.value_start,
            i,
            this.dot_position ? this.dot_position : i
          );
        }
        this.state = STATE_NONE;
        this.value_start = undefined;
        this.dot_position = undefined;

        /*console.log(
        "G",
        this.field_values[G],
        this.field_values[X],
        this.field_values[Y],
        this.field_values[E],
        this.extruder_coordinates_absolute,
        this.prev_e,
        instruction_index
      );*/
        // check if this is a G command
        if (!isNaN(this.field_values[G])) {
          switch (this.field_values[G]) {
            case 0: // G0
            case 1: // G1
              // The move or extrude command is moving in the XY plane and not the Z plane
              // We're not handling XYZ movements at this moment
              if (
                !isNaN(this.field_values[X]) ||
                !isNaN(this.field_values[Y])
              ) {
                // If E field is set and
                // - relative extrusion value is positive or
                // - absolute extrusion value is larger than previous extrusion value
                // the command is a move with extrusion

                var command;
                var x_coord;
                var y_coord;

                if (
                  !isNaN(this.field_values[E]) &&
                  ((this.extruder_coordinates_absolute &&
                    this.field_values[E] > this.prev_e) ||
                    (!this.extruder_coordinates_absolute &&
                      this.field_values[E] > 0))
                ) {
                  if (this.prev_z !== this.last_z_with_extrusion) {
                    this.instructions.addInstruction(
                      COMMANDS.LAYER_CHANGE,
                      this.prev_z
                    );
                    //this.line_index.push(this.byte_index);
                    this.layer_positions.push(
                      this.instructions.totalInstructions
                    );
                    this.layer_heights.push(this.prev_z);
                    this.current_layer_index += 1;

                    if (this.prev_z > this.statistics.z.max)
                      this.statistics.z.max = this.prev_z;

                    // set all relevant parameters at the start of each layer
                    // so that each layer contains all necessary information
                    // for displaying it
                    this.instructions.addInstruction(
                      COMMANDS.MOVE_WITHOUT_EXTRUSION,
                      this.prev_x,
                      this.prev_y
                    );
                    this.instructions.addInstruction(
                      COMMANDS.SET_FEED_RATE,
                      this.feed_rate
                    );
                    this.instructions.addInstruction(
                      COMMANDS.TOOL_CHANGE,
                      this.current_tool
                    );
                  }

                  command = COMMANDS.MOVE_WITH_EXTRUSION;
                  this.last_z_with_extrusion = this.prev_z;
                  if (this.feed_rate !== this.last_feed_rate_with_extrusion) {
                    if (this.feed_rate > this.statistics.extruded_feed_rate.max)
                      this.statistics.extruded_feed_rate.max = this.feed_rate;
                    if (this.feed_rate < this.statistics.extruded_feed_rate.min)
                      this.statistics.extruded_feed_rate.min = this.feed_rate;
                  }
                  this.last_feed_rate_with_extrusion = this.feed_rate;
                } else {
                  command = COMMANDS.MOVE_WITHOUT_EXTRUSION;
                }

                // Set X value for move command
                if (!isNaN(this.field_values[X])) {
                  if (this.axis_coordinates_absolute)
                    x_coord = this.field_values[X];
                  else x_coord = this.prev_x + this.field_values[X];
                  if (x_coord > this.statistics.x.max)
                    this.statistics.x.max = x_coord;
                  if (x_coord < this.statistics.x.min)
                    this.statistics.x.min = x_coord;
                } else x_coord = this.prev_x;

                // Set Y value for move command
                if (!isNaN(this.field_values[Y])) {
                  if (this.axis_coordinates_absolute)
                    y_coord = this.field_values[Y];
                  else y_coord = this.prev_y + this.field_values[Y];
                  if (y_coord > this.statistics.y.max)
                    this.statistics.y.max = y_coord;
                  if (y_coord < this.statistics.y.min)
                    this.statistics.y.min = y_coord;
                } else y_coord = this.prev_y;
                this.instructions.addInstruction(command, x_coord, y_coord);
                //this.line_index.push(this.byte_index);
                this.prev_x = x_coord;
                this.prev_y = y_coord;
              }

              // Set feed rate if F field is present
              if (!isNaN(this.field_values[F])) {
                this.feed_rate = this.field_values[F];
                this.instructions.addInstruction(
                  COMMANDS.SET_FEED_RATE,
                  this.field_values[F]
                );
                if (this.feed_rate > this.statistics.feed_rate.max)
                  this.statistics.feed_rate.max = this.feed_rate;
                if (this.feed_rate < this.statistics.feed_rate.min)
                  this.statistics.feed_rate.min = this.feed_rate;
                //this.line_index.push(this.byte_index);
              }

              if (!isNaN(this.field_values[Z])) {
                if (this.field_values[Z] > this.prev_z) {
                  this.instructions.addInstruction(COMMANDS.RETRACTION);
                  //this.line_index.push(this.byte_index);
                }
                this.prev_z = this.field_values[Z];
              }

              break;
            case 90: // G90
              this.axis_coordinates_absolute = true;
              break;
            case 91: // G91
              this.axis_coordinates_absolute = false;
              break;
          }
        }
        // check if this is a G command
        else if (!isNaN(this.field_values[M])) {
          switch (this.field_values[M]) {
            case 82:
              this.extruder_coordinates_absolute = true;
              break;
            case 83:
              this.extruder_coordinates_absolute = false;
              break;
          }
        } else if (!isNaN(this.field_values[T])) {
          this.instructions.addInstruction(
            COMMANDS.TOOL_CHANGE,
            this.field_values[T]
          );
          this.current_tool = this.field_values[T];
        }

        // reset all fields to NaN so that we don't use fields defined
        // in previous commands if the current command does not have an optional
        // field set
        //
        // this is faster than using "field_values.fill(NaN)" for some reason
        for (let j = 0; j < 27; j++) {
          this.field_values[j] = NaN;
        }
      } else if (c === CHAR_SEMICOLON) {
        this.state = STATE_COMMENT;
      }
      this.prev_character = c;
      this.byte_index += 1;
    }
    if (this.state === STATE_FIELD) {
      this.last_block = data.slice(this.value_start);
    }
    //console.log((instruction_index * 4) / 1024 / 1024, instructions_f32);
  }

  pFloat(
    data: Uint8Array,
    data_start: number,
    data_end: number,
    dot_location: number
  ) {
    let result = 0;
    let negative = false;

    for (let i = data_start; i < data_end; ++i) {
      let n = data[i] - 48;
      if (i === data_start && data[i] === CHAR_MINUS) {
        negative = true;
      } else if (i < dot_location) {
        result += n * LOOKUP_BEFORE_DOT[dot_location - i - 1];
      } else if (i > dot_location)
        result += n * LOOKUP_AFTER_DOT[i - dot_location - 1];
    }
    return negative ? -result : result;
  }

  getParsingResult() {
    return {
      instructions: this.instructions,
      layerPositions: this.layer_positions,
      layerHeights: this.layer_heights,
      statistics: this.statistics,
      lineIndex: [] //this.line_index
    };
  }
}

export class Instructions {
  blockSizeInInstructions: number;
  buffers: ArrayBuffer[] = [];
  currentBuffer = 0;
  currentInstruction = 0;
  currentFloat32Array: Float32Array;
  totalInstructions = 0;

  constructor(blockSizeInInstructions: number) {
    this.blockSizeInInstructions = blockSizeInInstructions;
    this.buffers.push(new ArrayBuffer(this.blockSizeInInstructions * 3 * 4));
    this.currentFloat32Array = new Float32Array(
      this.buffers[this.currentBuffer]
    );
  }

  addInstruction(command: number, param1?: number, param2?: number) {
    this.currentFloat32Array[this.currentInstruction * 3] = command;
    if (param1 !== undefined)
      this.currentFloat32Array[this.currentInstruction * 3 + 1] = param1;
    if (param2 !== undefined)
      this.currentFloat32Array[this.currentInstruction * 3 + 2] = param2;
    this.currentInstruction += 1;
    this.totalInstructions += 1;

    if (this.currentInstruction >= this.blockSizeInInstructions) {
      this.buffers.push(new ArrayBuffer(this.blockSizeInInstructions * 3 * 4));
      this.currentBuffer += 1;
      this.currentInstruction = 0;
      this.currentFloat32Array = new Float32Array(
        this.buffers[this.currentBuffer]
      );
    }
  }
}
