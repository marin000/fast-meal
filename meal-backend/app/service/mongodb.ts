import mongoose from "mongoose";
import { config } from "@/app/config/config";

declare global {
	// eslint-disable-next-line no-var -- Vercel serverless: reuse connection across invocations
	var mongooseCache: {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	};
}

const globalWithMongoose = globalThis as typeof globalThis & {
	mongooseCache?: {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	};
};

const cache = globalWithMongoose.mongooseCache ?? { conn: null, promise: null };

if (!globalWithMongoose.mongooseCache) {
	globalWithMongoose.mongooseCache = cache;
}

export const connectMongo = async (): Promise<typeof mongoose> => {
	if (mongoose.connection.readyState === 1) {
		cache.conn = mongoose;
		return cache.conn;
	}

	if (cache.conn) return cache.conn;

	if (!cache.promise) {
		cache.promise = mongoose.connect(config.mongodbUri, {
			bufferCommands: false,
		});
	}

	try {
		cache.conn = await cache.promise;
	} catch (error) {
		cache.promise = null;
		throw error;
	}

	return cache.conn;
};
