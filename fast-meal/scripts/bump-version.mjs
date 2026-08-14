import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const packageJsonPath = join(rootDir, "package.json");
const appJsonPath = join(rootDir, "app.json");

const usage = `Usage:
  npm run bump -- patch
  npm run bump -- minor
  npm run bump -- major
  npm run bump -- 1.2.1
`;

const parseSemver = (version) => {
	const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version.trim());
	if (!match) {
		throw new Error(`Invalid semver "${version}". Expected X.Y.Z`);
	}
	return {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3]),
	};
};

const formatSemver = ({ major, minor, patch }) =>
	`${major}.${minor}.${patch}`;

const bumpSemver = (version, kind) => {
	const current = parseSemver(version);
	if (kind === "major") {
		return formatSemver({ major: current.major + 1, minor: 0, patch: 0 });
	}
	if (kind === "minor") {
		return formatSemver({
			major: current.major,
			minor: current.minor + 1,
			patch: 0,
		});
	}
	if (kind === "patch") {
		return formatSemver({
			major: current.major,
			minor: current.minor,
			patch: current.patch + 1,
		});
	}
	return formatSemver(parseSemver(kind));
};

const arg = process.argv[2];
if (!arg) {
	console.error(usage);
	process.exit(1);
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const appJson = JSON.parse(readFileSync(appJsonPath, "utf8"));

const currentVersion = appJson.expo?.version ?? packageJson.version;
if (!currentVersion) {
	throw new Error("Could not find current version in app.json or package.json");
}

const nextVersion = bumpSemver(currentVersion, arg);

packageJson.version = nextVersion;
appJson.expo.version = nextVersion;

const currentBuildNumber = Number(appJson.expo.ios?.buildNumber ?? 0);
const currentVersionCode = Number(appJson.expo.android?.versionCode ?? 0);
const nextBuildNumber = String(currentBuildNumber + 1);
const nextVersionCode = currentVersionCode + 1;

if (!appJson.expo.ios) appJson.expo.ios = {};
if (!appJson.expo.android) appJson.expo.android = {};
appJson.expo.ios.buildNumber = nextBuildNumber;
appJson.expo.android.versionCode = nextVersionCode;

writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, "\t")}\n`);
writeFileSync(appJsonPath, `${JSON.stringify(appJson, null, "\t")}\n`);

console.log(
	`Bumped ${currentVersion} → ${nextVersion} (iOS buildNumber ${nextBuildNumber}, Android versionCode ${nextVersionCode})`,
);
