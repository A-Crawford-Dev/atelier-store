export type Img = {
  src: string;
  alt: string;
};

type Crop = {
  /** Focal point as a fraction of width/height (0–1) */
  x: number;
  y: number;
  /** Zoom factor; > 1 crops in for a detail shot */
  zoom: number;
};

/** Unsplash (imgix) URL. Pass `crop` to zoom into a detail of the photo. */
export function unsplash(id: string, width = 1600, crop?: Crop) {
  const params = new URLSearchParams({ auto: "format", fit: "crop", w: String(width), q: "80" });
  if (crop) {
    params.set("crop", "focalpoint");
    params.set("fp-x", String(crop.x));
    params.set("fp-y", String(crop.y));
    params.set("fp-z", String(crop.zoom));
    // Fix the frame to the product aspect (4:5) so the zoom has room to work
    params.set("h", String(Math.round(width * 1.25)));
  }
  return `https://images.unsplash.com/photo-${id}?${params}`;
}
