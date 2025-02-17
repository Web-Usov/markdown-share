import LZString from "lz-string";

export const compressText = (text: string): string => {
  return LZString.compressToEncodedURIComponent(text);
};

export const decompressText = (compressed: string): string => {
  try {
    const decoded = decodeURIComponent(compressed);
    return LZString.decompressFromEncodedURIComponent(decoded) || "";
  } catch (e) {
    console.error("Failed to decompress text:", e);
    return "";
  }
};
