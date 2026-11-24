export function isRecipeImageOptimizable(imageUrl: string): boolean {
  try {
    const url = new URL(imageUrl);
    return (
      url.protocol === "https:" &&
      url.hostname === "images.unsplash.com" &&
      url.pathname.startsWith("/photo-")
    );
  } catch {
    return false;
  }
}
