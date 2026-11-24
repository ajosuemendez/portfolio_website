# AM logo icon (pixel version)

Square pixel monogram "AM": white pixels on a navy tile, with the A crossbar in orange. Built on a 9×5 pixel grid, so it must stay square-cornered and never be blurred or stretched.

## Files

| File | Use |
|---|---|
| `icon.svg` | Main logo icon (navy tile). Use it in the site header/nav and as the SVG favicon. |
| `icon-mark.svg` | Same letters without the tile, transparent background. Navy on light, white on dark (follows the OS colour scheme). For places where the tile would be too heavy. |
| `favicon.ico` | Classic favicon with hand-tuned 16, 32 and 48 px pixel grids. Put it at the site root. |
| `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png` | Optional PNG favicons. |
| `apple-touch-icon.png` | 180×180, for iOS home screen. |
| `icon-192.png`, `icon-512.png` | PWA / Android icons (512 also works as maskable). |
| `site.webmanifest` | Optional web app manifest that references the two PWA icons. |

## Add to the site

Copy all files into the static/public folder (the one served from `/`), then add this inside `<head>`. Adjust paths if the project serves assets from somewhere else.

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1B213F">
```

Logo in the header (links home, 36–44 px works best, keep it a multiple of 4 px if possible for crisp pixels):

```html
<a href="/" aria-label="Alejandro Mendez, home">
  <img src="/icon.svg" width="40" height="40" alt="">
</a>
```

If the image is the only content of the link, keep the `aria-label` on the link and `alt=""` on the image, as above.

## Rules

- Keep corners square (no `border-radius`) and do not recolour or add shadows.
- Minimum size 16 px. Below 32 px prefer the PNG/ICO files, they are pixel-aligned.
- Colours: navy `#1B213F`, white `#FFFFFF`, orange `#C4692B`. Site indigo is `#4A5FD1`, page background `#F5F6FC`.
