const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], fileName, { type: blob.type || "image/png" });
};

/** Whether this browser can share an image file through the native share sheet */
export const canShareImages = (): boolean => {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;
  try {
    const probe = new File([new Blob()], "probe.png", { type: "image/png" });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
};

export const downloadImage = (dataUrl: string, fileName: string): void => {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
};

/**
 * Opens the native share sheet with the image attached.
 * Resolves false when the user closes the sheet without sharing.
 */
export const shareImage = async (
  dataUrl: string,
  fileName: string,
  text: string,
): Promise<boolean> => {
  const file = await dataUrlToFile(dataUrl, fileName);
  try {
    await navigator.share({ files: [file], text });
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return false;
    throw error;
  }
};
