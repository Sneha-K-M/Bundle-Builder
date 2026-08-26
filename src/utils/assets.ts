type AssetMap = Record<string, string>;

/**
 * Drop-in art: any SVG added to the asset folders is picked up by file name,
 * with no code change needed. Components fall back to the built-in line
 * icons for names that have no file yet.
 */
function byFileName(modules: Record<string, unknown>): AssetMap {
  const assets: AssetMap = {};
  for (const [path, url] of Object.entries(modules)) {
    const fileName = path
      .split("/")
      .pop()
      ?.replace(/\.(svg|png|jpe?g|webp|avif)$/i, "");
    if (fileName && typeof url === "string") {
      assets[fileName] = url;
    }
  }
  return assets;
}

const productArt = byFileName(
  import.meta.glob("../assets/products/*.{svg,png,jpg,jpeg,webp,avif}", {
    eager: true,
    query: "?url",
    import: "default",
  })
);

const variantArt = byFileName(
  import.meta.glob("../assets/variants/*.{svg,png,jpg,jpeg,webp,avif}", {
    eager: true,
    query: "?url",
    import: "default",
  })
);

const uiIcons = byFileName(
  import.meta.glob("../assets/icons/*.{svg,png,jpg,jpeg,webp,avif}", {
    eager: true,
    query: "?url",
    import: "default",
  })
);

/** `products/<product.image>.<ext>`, e.g. `products/cam-v4.svg`. */
export function productArtUrl(imageKey: string): string | undefined {
  return productArt[imageKey];
}

export function variantArtUrl(imageKey: string, variantId: string): string | undefined {
  return variantArt[`${imageKey}-${variantId}`];
}

/** `icons/<name>.<ext>`, e.g. `icons/camera.svg`. */
export function iconUrl(name: string): string | undefined {
  return uiIcons[name];
}
