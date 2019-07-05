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
