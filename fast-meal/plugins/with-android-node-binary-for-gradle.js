const { withAppBuildGradle } = require("@expo/config-plugins");

const MARKER = "resolveNodeBinaryForExpo";

const NODE_RESOLVER_AND_ENV_BLOCK = `
// Gradle often runs with a minimal PATH (no nvm), so plain \`node\` can be an old system binary (e.g. Node 16).
// Prefer NODE_BINARY, else resolve via a login shell so nvm/fnm paths apply (undici needs Node 18+ globals).
def ${MARKER} = {
    String envNode = System.getenv("NODE_BINARY")
    if (envNode != null && !envNode.trim().isEmpty()) {
        return envNode.trim()
    }
    def os = System.getProperty("os.name").toLowerCase()
    // nvm default (e.g. v16) wins unless we cd into the app and \`nvm use\` so .nvmrc applies.
    if (os.contains("mac")) {
        try {
            def pb = new ProcessBuilder("/bin/zsh", "-ilc", 'cd "$NVM_USE_CWD" && nvm use >/dev/null 2>&1; command -v node')
            pb.environment().put("NVM_USE_CWD", projectRoot)
            pb.directory(new File(projectRoot))
            def proc = pb.start()
            proc.waitFor()
            def path = proc.inputStream.text.trim()
            if (proc.exitValue() == 0 && path && new File(path).exists()) {
                return path
            }
        } catch (Throwable ignored) {}
    } else if (os.contains("linux")) {
        try {
            def pb = new ProcessBuilder("/bin/bash", "-lc", 'cd "$NVM_USE_CWD" && nvm use >/dev/null 2>&1; command -v node')
            pb.environment().put("NVM_USE_CWD", projectRoot)
            pb.directory(new File(projectRoot))
            def proc = pb.start()
            proc.waitFor()
            def path = proc.inputStream.text.trim()
            if (proc.exitValue() == 0 && path && new File(path).exists()) {
                return path
            }
        } catch (Throwable ignored) {}
    }
    return "node"
}()

`;

/**
 * Ensures Android release bundles use the same Node as your dev shell (nvm/fnm), not a stale PATH node.
 */
module.exports = function withAndroidNodeBinaryForGradle(config) {
	return withAppBuildGradle(config, (modConfig) => {
		if (modConfig.modResults.language !== "groovy") {
			return modConfig;
		}

		let contents = modConfig.modResults.contents;
		if (contents.includes(MARKER)) {
			return modConfig;
		}

		const projectRootLine =
			"def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()";
		if (!contents.includes(projectRootLine)) {
			throw new Error(
				"withAndroidNodeBinaryForGradle: expected projectRoot line in app/build.gradle",
			);
		}

		contents = contents.replace(
			`${projectRootLine}\n`,
			`${projectRootLine}\n${NODE_RESOLVER_AND_ENV_BLOCK}`,
		);

		contents = contents.replaceAll('["node",', `[${MARKER},`);

		if (!contents.includes("nodeExecutableAndArgs = [resolveNodeBinaryForExpo]")) {
			contents = contents.replace(
				/(bundleCommand = "export:embed")\n/,
				`$1\n    nodeExecutableAndArgs = [${MARKER}]\n\n`,
			);
		}

		modConfig.modResults.contents = contents;
		return modConfig;
	});
};
