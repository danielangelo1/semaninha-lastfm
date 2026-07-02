import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Canvas from "../Canvas";
import { AlbumApiResponse } from "../../../types/apiResponse";
import { UserRequest } from "../../../types/userRequest";

// Mock the generateCanvas utils
vi.mock("../../../utils/generateCanvas", () => ({
  createAlbumImage: vi
    .fn()
    .mockResolvedValue({ dataURL: "data:image/png;base64,mock", isPartial: false }),
  createSpotifyImage: vi
    .fn()
    .mockResolvedValue({ dataURL: "data:image/png;base64,mock", isPartial: false }),
  createTrackImage: vi
    .fn()
    .mockResolvedValue({ dataURL: "data:image/png;base64,mock", isPartial: false }),
}));

describe("Canvas Component", () => {
  const mockAlbumData: AlbumApiResponse = {
    topalbums: {
      album: [
        {
          name: "Test Album",
          artist: { name: "Test Artist", mbid: "", url: "", playcount: "50" },
          image: [{ "#text": "test-image-url", size: "large" }],
          playcount: "100",
          mbid: "",
          url: "",
        },
      ],
    },
  };

  const mockUserInput: UserRequest = {
    user: "dandowski",
    period: "7day",
    limit: 3,
    showAlbum: true,
    showPlays: true,
    type: "album",
  };

  it("renders canvas component with loading state", () => {
    render(<Canvas data={mockAlbumData} userInput={mockUserInput} />);

    // Should show loading spinner initially (setup força idioma pt)
    expect(screen.getByLabelText("Gerando colagem")).toBeInTheDocument();
  });

  it("renders image after loading with a translated, type-aware alt text", async () => {
    render(<Canvas data={mockAlbumData} userInput={mockUserInput} />);

    const image = await screen.findByAltText(
      "Colagem 3x3 do top Álbuns de dandowski no período: Últimos 7 dias",
    );
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "data:image/png;base64,mock");
  });

  it("renders a download link for the generated image", async () => {
    render(<Canvas data={mockAlbumData} userInput={mockUserInput} />);

    const link = await screen.findByRole("link", { name: "Baixar imagem" });
    expect(link).toHaveAttribute("href", "data:image/png;base64,mock");
    expect(link).toHaveAttribute("download", "semaninha-dandowski-album-3x3.jpg");
  });
});
