import GCodeParser from "app/gcode-parser";

test("init empty parser", () => {
  const parser = new GCodeParser();
  expect(parser).toBeDefined();
  console.log(parser);
});
