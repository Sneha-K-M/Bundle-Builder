# UI icons

Optional images that override the built-in line icons, by name. SVG, PNG,
JPG, WebP, and AVIF all work.

| File              | Where it appears                          |
| ----------------- | ----------------------------------------- |
| `camera.svg`      | "Choose your cameras" step header         |
| `shield.svg`      | "Choose your plan" step header            |
| `sensor.svg`      | "Choose your sensors" step header         |
| `grid.svg`        | "Add extra protection" step header        |
| `truck.svg`       | Fast Shipping row in the summary          |
| `badge-check.svg` | Satisfaction guarantee seal in the summary|

Step icons render at 22px square. These load as `<img>`, so they can't
inherit text colour — bake the intended colour into the file.
