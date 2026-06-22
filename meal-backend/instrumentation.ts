import { ERROR_LOG_MESSAGES } from "@/app/constants/messages";
import { connectMongo } from "@/app/service/mongodb";
export async function register() {
	if (process.env.NEXT_RUNTIME !== "nodejs") {
		return;
	}

	try {
		await connectMongo();
		console.log("[meal-backend] MongoDB startup connected");
	} catch (error) {
		console.error(ERROR_LOG_MESSAGES.MONGODB_STARTUP_CONNECT_FAILED, error);
	}
}
