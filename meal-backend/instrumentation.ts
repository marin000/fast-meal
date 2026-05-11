import { connectMongo } from "@/app/service/mongodb";
export async function register() {
	if (process.env.NEXT_RUNTIME !== "nodejs") {
		return;
	}

	try {
		await connectMongo();
		console.log("[meal-backend] MongoDB startup connected");
	} catch (error) {
		console.error("[meal-backend] MongoDB startup connect failed:", error);
	}
}
