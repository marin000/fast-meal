import * as Sentry from "@sentry/nextjs";
import { connectMongo } from "@/app/service/mongodb";
import { ERROR_LOG_MESSAGES } from "@/constants/messages";

export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("./sentry.server.config");
	}

	if (process.env.NEXT_RUNTIME === "edge") {
		await import("./sentry.edge.config");
	}

	if (process.env.NEXT_RUNTIME !== "nodejs") {
		return;
	}

	try {
		await connectMongo();
		console.log("[meal-backend] MongoDB startup connected");
	} catch (error) {
		console.error(ERROR_LOG_MESSAGES.MONGODB_STARTUP_CONNECT_FAILED, error);
		Sentry.captureException(error);
	}
}

export const onRequestError = Sentry.captureRequestError;
