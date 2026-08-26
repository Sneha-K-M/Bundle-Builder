# Product art

One image per product, named after the product's `image` key in
`src/data/products.json`. SVG, PNG, JPG, WebP, and AVIF all work. Files are
picked up automatically — no imports to edit. A product with no file here
falls back to the built-in placeholder icon.

| File                  | Product                    |
| --------------------- | -------------------------- |
| `cam-v4.svg`          | Wyze Cam v4                |
| `cam-pan-v3.svg`      | Wyze Cam Pan v3            |
| `floodlight-v2.svg`   | Wyze Cam Floodlight v2     |
| `duo-doorbell.svg`    | Wyze Duo Cam Doorbell      |
| `battery-cam-pro.svg` | Wyze Battery Cam Pro       |
| `plan-shield.svg`     | Cam Unlimited / Cam Protect|
| `sense-motion.svg`    | Wyze Sense Motion Sensor   |
| `sense-hub.svg`       | Wyze Sense Hub             |
| `sense-contact.svg`   | Wyze Sense Contact Sensor  |
| `microsd.svg`         | Wyze MicroSD Card          |
| `solar-panel.svg`     | Wyze Cam Solar Panel       |

Art is rendered in a square frame at up to 96px and scaled with
`object-fit: contain`, so square artwork keeps every card aligned. Use a
transparent background — the cards are white.
