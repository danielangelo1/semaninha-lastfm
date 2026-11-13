import { describe, expect, it } from "vitest";
import { getGridDimensions, getGridItemCount, parseGridSize } from "../grid.helper";

describe("grid helper", () => {
  it("parses square sizes", () => {
    expect(parseGridSize("5")).toEqual({ columns: 5, rows: 5 });
    expect(getGridItemCount("5")).toBe(25);
  });

  it("parses columns by rows sizes", () => {
    expect(parseGridSize("2x6")).toEqual({ columns: 2, rows: 6 });
    expect(getGridItemCount("2x6")).toBe(12);
  });

  it("keeps square grids at the full canvas size", () => {
    expect(getGridDimensions("5")).toMatchObject({ width: 1300, height: 1300, tileSize: 260 });
  });

  it("makes rectangular grids follow their longest side with square tiles", () => {
    const { width, height, tileSize } = getGridDimensions("2x6");
    expect(height).toBe(1300);
    expect(width).toBe(433);
    expect(tileSize).toBeCloseTo(1300 / 6);
  });
});
