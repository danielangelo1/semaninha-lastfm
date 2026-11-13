import { CANVAS_CONFIG } from "../constants";

export interface GridLayout {
  columns: number;
  rows: number;
}

/** Parses a grid size value: "5" is a 5x5 grid, "2x6" is 2 columns by 6 rows */
export const parseGridSize = (size: string): GridLayout => {
  const [columns, rows = columns] = size.split("x").map(Number);
  return { columns, rows };
};

export const getGridItemCount = (size: string): number => {
  const { columns, rows } = parseGridSize(size);
  return columns * rows;
};

/** Square tiles sized so the longest side of the grid matches the canvas size */
export const getGridDimensions = (size: string) => {
  const { columns, rows } = parseGridSize(size);
  const tileSize = CANVAS_CONFIG.WIDTH / Math.max(columns, rows);
  return {
    columns,
    rows,
    tileSize,
    width: Math.round(columns * tileSize),
    height: Math.round(rows * tileSize),
  };
};
