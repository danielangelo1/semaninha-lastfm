import { describe, it, expect, vi } from "vitest";
import { processImages } from "../canvasUtils";
import { UserRequest } from "../../types/userRequest";
import { ERROR_MESSAGES } from "../../constants";

const userInput: UserRequest = {
  user: "dandowski",
  period: "7day",
  limit: 3,
  showAlbum: false,
  showPlays: false,
  type: "album",
};

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ src: `image-${i}.png` }));

describe("processImages", () => {
  it("throws when there is no data at all", async () => {
    await expect(
      processImages([], userInput, (item) => item.src, vi.fn()),
    ).rejects.toThrow(ERROR_MESSAGES.INSUFFICIENT_DATA);
  });

  it("generates a full grid without marking it partial", async () => {
    const result = await processImages(
      makeItems(9),
      userInput,
      (item) => item.src,
      vi.fn(),
    );

    expect(result.isPartial).toBe(false);
    expect(result.dataURL).toMatch(/^data:image\/jpeg/);
  });

  it("fills missing cells and marks the result as partial", async () => {
    const drawExtraDetails = vi.fn();
    const result = await processImages(
      makeItems(4),
      userInput,
      (item) => item.src,
      drawExtraDetails,
    );

    expect(result.isPartial).toBe(true);
    // detalhes só são desenhados para os itens reais, não para placeholders
    expect(drawExtraDetails).toHaveBeenCalledTimes(4);
  });
});
