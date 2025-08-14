import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Canvas from "../Canvas";
import { AlbumApiResponse } from "../../../types/apiResponse";
import { UserRequest } from "../../../types/userRequest";

// Mock the generateCanvas utils
vi.mock("../../../utils/generateCanvas", () => ({
  createAlbumImage: vi.fn().mockResolvedValue("data:image/png;base64,mock"),
  createSpotifyImage: vi.fn().mockResolvedValue("data:image/png;base64,mock"),
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
    type: "albums",
  };

  it("renders canvas component with loading state", () => {
    render(<Canvas data={mockAlbumData} userInput={mockUserInput} />);

    // Should show loading spinner initially
    expect(screen.getByLabelText("Gerando colagem de álbuns")).toBeInTheDocument();
  });

  it("renders image after loading", async () => {
    render(<Canvas data={mockAlbumData} userInput={mockUserInput} />);

    // Wait for image to load - using the new descriptive alt text
    const image = await screen.findByAltText(/Colagem de \d+x\d+ álbuns mais escutados de .+ no período de .+/);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "data:image/png;base64,mock");
  });
});
