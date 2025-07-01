// apps/api/src/database.ts

import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;
if (!MONGODB_URI) {
	throw new Error("A variável de ambiente MONGO_URI não foi definida!");
}

let db: Db;

export async function connectDB(): Promise<Db> {
	if (db) {
		return db;
	}

	const client = new MongoClient(MONGODB_URI!);
	await client.connect();

	// Você pode definir o nome do seu banco de dados aqui
	db = client.db("eventPlatformDB");

	console.log("🔌 Conectado ao MongoDB com sucesso!");
	return db;
}
