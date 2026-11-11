---
title: "How to resize and compress images with ShrinkIt"
description: "Resize, compress, and convert JPG, PNG, GIF, and WebP images in your browser with ShrinkIt — no sign-up, no uploads."
category: apps
type: how-to
updated: "2026-11-02"
draft: false
---

ShrinkIt is a free image resizer and compressor that runs entirely in your
browser. Open [shrinkit.dusrel.com](https://shrinkit.dusrel.com), add your
images, and get smaller files back — nothing is uploaded to a server, there
is no sign-up, and there are no watermarks on your output.

It handles JPG, PNG, GIF, and WebP images, and you can process several
images in one batch.

## Resize and compress an image

<img src="/docs-sections/how-to-resize-and-compress-images-with-shrinkit-s1.jpg" alt="Resize and compress an image" width="700" height="394">


1. Open [shrinkit.dusrel.com](https://shrinkit.dusrel.com).
2. Add your images with the dropzone or the file picker. You can add more
   than one image at a time.
3. Choose how to resize each image: by percent of the original size, by
   exact pixels, or in centimetres or inches.
4. Pick an output format (JPG, PNG, WebP, or GIF). For JPG, you can also
   set the quality from 0 to 100 — lower quality means a smaller file.
5. Start the processing and wait for the results. Each finished image can
   be downloaded on its own, or you can download the whole batch as a ZIP
   file.

That is the whole flow. Your original files are never sent anywhere: the
resizing and encoding happen on your own device.

## Tips

<img src="/docs-sections/how-to-resize-and-compress-images-with-shrinkit-s2.jpg" alt="Tips" width="700" height="394">


- **Start from percent when you just need smaller files.** Resizing to
  50% is usually enough for sharing photos online, and you do not need to
  work out pixel dimensions.
- **Use exact pixels when a site asks for them.** Profile pictures, post
  covers, and form uploads often specify a size like 800 × 800 — enter
  those numbers directly.
- **Watch the format when transparency matters.** JPG has no
  transparency, so a transparent PNG converted to JPG gets flattened onto
  a white or black background. Keep PNG or WebP if you need to preserve
  transparent areas.
- **EXIF data is stripped by default.** Location and camera details are
  removed from your output images, which is what you want before sharing
  photos publicly. There is an option to preserve the source EXIF data if
  you need it.
- **Very large images may be refused with a clear error.** Browsers have
  real memory limits for image processing, so extremely large files cannot
  always be handled. If that happens, try a smaller source image first.
- **WebP and GIF do not carry DPI metadata.** There is no standard
  container for it in those formats, so ShrinkIt does not pretend
  otherwise — DPI values are written only where the format supports them
  (JPG and PNG).
