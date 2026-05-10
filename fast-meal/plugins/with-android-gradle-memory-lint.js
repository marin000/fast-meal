const {
	withGradleProperties,
	withProjectBuildGradle,
} = require("@expo/config-plugins");

const LINT_METASPACE_MARKER = "autolinked libraries (Kotlin lint Metaspace)";

function setGradleProperty(modResults, key, value) {
	const idx = modResults.findIndex(
		(p) => p.type === "property" && p.key === key,
	);
	const prop = { type: "property", key, value };
	if (idx >= 0) {
		modResults[idx] = prop;
	} else {
		modResults.push(prop);
	}
}

/**
 * - Raise Gradle/Kotlin Metaspace (lint Kotlin FIR is heavy).
 * - Disable release lint on `com.android.library` subprojects to avoid flaky OOM in tasks like `:react-native-screens:lintVitalAnalyzeRelease`.
 */
module.exports = function withAndroidGradleMemoryLint(config) {
	config = withGradleProperties(config, (modConfig) => {
		setGradleProperty(
			modConfig.modResults,
			"org.gradle.jvmargs",
			"-Xmx4096m -XX:MaxMetaspaceSize=1536m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8",
		);
		setGradleProperty(
			modConfig.modResults,
			"kotlin.daemon.jvmargs",
			"-Xmx3072m -XX:MaxMetaspaceSize=1024m",
		);
		return modConfig;
	});

	config = withProjectBuildGradle(config, (modConfig) => {
		if (modConfig.modResults.contents.includes(LINT_METASPACE_MARKER)) {
			return modConfig;
		}
		modConfig.modResults.contents += `

// ${LINT_METASPACE_MARKER}: skip release lint on AAR deps to avoid OOM in lintVitalAnalyzeRelease
// Use withId (not afterEvaluate): some subprojects are already evaluated when this runs (Expo / RN ordering).
subprojects { subproject ->
  subproject.plugins.withId("com.android.library") {
    subproject.android {
      lint {
        abortOnError false
        checkReleaseBuilds false
      }
    }
  }
}
`;
		return modConfig;
	});

	return config;
};
