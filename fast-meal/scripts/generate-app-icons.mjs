import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const imagesDir = join(rootDir, "assets", "images");
const sourceDir = join(imagesDir, "source");

const BRAND_GREEN = "#2D8A4E";
const SIZE = 1024;
const LOGO_SCALE = 22;

const extractSvgBody = (svg) =>
	svg
		.replace(/<svg[^>]*>/, "")
		.replace(/<\/svg>/, "")
		.trim();

const markBody = extractSvgBody(
	readFileSync(join(sourceDir, "fridge-ai-mark.svg"), "utf8"),
);
const monochromeMarkBody = extractSvgBody(
	readFileSync(join(sourceDir, "fridge-ai-mark-monochrome.svg"), "utf8"),
);

const wrapMark = (body, scale = LOGO_SCALE) =>
	`<g transform="translate(${SIZE / 2} ${SIZE / 2}) scale(${scale}) translate(-14 -14)">${body}</g>`;

const buildSvg = (body) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${body}</svg>`;

const fullIconSvg = buildSvg(
	`<rect width="${SIZE}" height="${SIZE}" fill="${BRAND_GREEN}" />${wrapMark(markBody)}`,
);
const foregroundSvg = buildSvg(wrapMark(markBody));
const monochromeSvg = buildSvg(wrapMark(monochromeMarkBody));
const backgroundSvg = buildSvg(
	`<rect width="${SIZE}" height="${SIZE}" fill="${BRAND_GREEN}" />`,
);

const writePng = async (svg, outputPath, size = SIZE) => {
	await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outputPath);
};

await writePng(fullIconSvg, join(imagesDir, "icon.png"));
await writePng(foregroundSvg, join(imagesDir, "android-icon-foreground.png"));
await writePng(backgroundSvg, join(imagesDir, "android-icon-background.png"));
await writePng(monochromeSvg, join(imagesDir, "android-icon-monochrome.png"));
await writePng(foregroundSvg, join(imagesDir, "splash-icon.png"));
await writePng(fullIconSvg, join(imagesDir, "favicon.png"), 48);

console.log("Generated app icons in assets/images/");
