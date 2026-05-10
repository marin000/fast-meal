const { withProjectBuildGradle } = require("@expo/config-plugins");

const LOCAL_REPO_MARKER =
	"@react-native-async-storage/async-storage/android/local_repo";

/**
 * Async Storage v3 depends on `org.asyncstorage.shared_storage:storage-android`,
 * which is shipped only under the package's `android/local_repo`. Gradle must
 * resolve that flat Maven repo from the app root.
 */
function withAsyncStorageLocalMavenRepository(config) {
	return withProjectBuildGradle(config, (modConfig) => {
		if (modConfig.modResults.language !== "groovy") {
			return modConfig;
		}

		let contents = modConfig.modResults.contents;
		if (contents.includes(LOCAL_REPO_MARKER)) {
			return modConfig;
		}

		const needle = "allprojects {\n  repositories {\n";
		const insert = `allprojects {\n  repositories {\n    // Async Storage v3: storage-android is vendored under node_modules (not on Maven Central)\n    maven { url = uri("\${rootDir}/../node_modules/@react-native-async-storage/async-storage/android/local_repo") }\n`;

		if (!contents.includes(needle)) {
			throw new Error(
				"withAsyncStorageLocalMavenRepository: could not find allprojects.repositories block in android/build.gradle",
			);
		}

		modConfig.modResults.contents = contents.replace(needle, insert);
		return modConfig;
	});
}

module.exports = function withAsyncStorageLocalMavenRepositoryPlugin(config) {
	return withAsyncStorageLocalMavenRepository(config);
};
