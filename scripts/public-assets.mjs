// Only these reviewed public files may be built or served. Raw captures stay outside the repository.
export const SCREENSHOT_NAMES = Object.freeze(['annotator-connotator','sprint-lab','pronunciation-lab','speaking-lab']);
export const PUBLIC_ASSETS = Object.freeze([
  'index.html','404.html','assets/style.css','assets/app.js','assets/guide.js','assets/screenshots.js','assets/favicon.svg',
  ...SCREENSHOT_NAMES.flatMap(name => [`assets/screenshots/${name}.webp`, `assets/screenshots/${name}-thumb.webp`]),
]);
