import path from "node:path";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {
		root: path.resolve(__dirname),
	},
};

export default withSentryConfig(nextConfig, {
	org: process.env.SENTRY_ORG ?? "fast-meal",
	project: process.env.SENTRY_PROJECT ?? "fastmeal-backend",
	authToken: process.env.SENTRY_AUTH_TOKEN,
	silent: !process.env.CI,
	widenClientFileUpload: true,
});
