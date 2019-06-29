import GCodeParser from "app/gcode-parser";
import { readFileSync } from "fs";
import { join } from "path";

test("init parser", () => {
  const parser = new GCodeParser();
  expect(parser).toBeDefined();
});

test("init parser", () => {
  const parser = new GCodeParser();
  var cwd = process.cwd();
  console.log(__dirname);
  const file = readFileSync(join(__dirname, "./minimal.gcode"));
  parser.parse(file);
  const result = parser.getParsingResult();
  console.log(result);
});
