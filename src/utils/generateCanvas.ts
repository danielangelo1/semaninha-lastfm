import { ApiResponse } from "../types/apiResponse";

export const generateCanvas = (data: ApiResponse) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1250;
  canvas.height = 1250;
  const context = canvas.getContext("2d");
};
