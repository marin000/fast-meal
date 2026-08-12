import * as Sentry from "@sentry/nextjs";

export const runtime = "nodejs";

export async function GET() {
	Sentry.captureException(new Error("Sentry backend smoke test"));
	await Sentry.flush(2000);
	return Response.json({ ok: true });
}
