// apps/api/src/index.ts

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import type { ApolloServerPlugin } from "@apollo/server";
import { readFileSync } from "fs";
import path from "path";
import { Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { DateTimeResolver } from "graphql-scalars";

// Nossos módulos customizados
import { connectDB } from "./database";
import logger from "./logger";

import dotenv from "dotenv";
dotenv.config();

const typeDefs = readFileSync(
	path.resolve(__dirname, "../../../packages/graphql-schema/schema.graphql"),
	{ encoding: "utf-8" }
);

export interface MyContext {
	db: Db;
	userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	logger.error("A variável de ambiente JWT_SECRET não foi definida!");
	process.exit(1);
}

const loggingPlugin: ApolloServerPlugin<MyContext> = {
	async requestDidStart(requestContext) {
		const { query, variables } = requestContext.request;
		if (query?.includes("IntrospectionQuery")) return;
		logger.info({ query, variables }, "Requisição GraphQL recebida");
		return {
			async didEncounterErrors(ctx) {
				logger.error(
					{ errors: ctx.errors },
					"Erro encontrado na requisição GraphQL"
				);
			},
		};
	},
};

// ======================= RESOLVERS 100% COMPLETOS E ATUALIZADOS =======================
const resolvers = {
	// <-- ADIÇÃO: Informa ao Apollo como processar o tipo customizado DateTime
	DateTime: DateTimeResolver,

	Query: {
		listEvents: async (
			_parent: any,
			args: { limit?: number; offset?: number },
			context: MyContext
		) => {
			const limit = args.limit || 10;
			const offset = args.offset || 0;
			const events = await context.db
				.collection("events")
				.find()
				.skip(offset)
				.limit(limit)
				.sort({ date: 1 })
				.toArray();
			const totalCount = await context.db.collection("events").countDocuments();
			return { events, totalCount };
		},

		getEvent: async (_parent: any, args: { id: string }, context: MyContext) => {
			if (!ObjectId.isValid(args.id)) {
				throw new GraphQLError("ID do evento inválido.", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}
			return context.db
				.collection("events")
				.findOne({ _id: new ObjectId(args.id) });
		},

		getMyRegistrations: async (_parent: any, _args: any, context: MyContext) => {
			if (!context.userId) {
				throw new GraphQLError(
					"Não autenticado. Faça login para ver suas inscrições.",
					{ extensions: { code: "UNAUTHENTICATED" } }
				);
			}
			return context.db
				.collection("registrations")
				.find({ participantId: new ObjectId(context.userId) })
				.toArray();
		},

		getAttendeesForMyEvent: async (
			_parent: any,
			args: { eventId: string },
			context: MyContext
		) => {
			if (!context.userId) {
				throw new GraphQLError("Não autenticado.", {
					extensions: { code: "UNAUTHENTICATED" },
				});
			}
			if (!ObjectId.isValid(args.eventId)) {
				throw new GraphQLError("ID do evento inválido.", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}

			const event = await context.db
				.collection("events")
				.findOne({ _id: new ObjectId(args.eventId) });
			if (!event) {
				throw new GraphQLError("Evento não encontrado.", {
					extensions: { code: "NOT_FOUND" },
				});
			}

			if (event.organizerId.toHexString() !== context.userId) {
				throw new GraphQLError(
					"Você não tem permissão para ver os participantes deste evento.",
					{ extensions: { code: "FORBIDDEN" } }
				);
			}

			return context.db
				.collection("registrations")
				.find({ eventId: new ObjectId(args.eventId) })
				.toArray();
		},
	},

	Mutation: {
		signup: async (_parent: any, args: any, context: MyContext) => {
			const { name, email, password } = args;

			const existingUser = await context.db.collection("users").findOne({ email });
			if (existingUser) {
				throw new GraphQLError("Usuário já cadastrado com este e-mail.", {
					extensions: { code: "BAD_REQUEST" },
				});
			}

			const hashedPassword = await bcrypt.hash(password, 12);

			const result = await context.db.collection("users").insertOne({
				name,
				email,
				password: hashedPassword,
				role: "PARTICIPANT",
			});

			const user = await context.db
				.collection("users")
				.findOne({ _id: result.insertedId });

			const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, {
				expiresIn: "7d",
			});

			return { token, user };
		},

		login: async (_parent: any, args: any, context: MyContext) => {
			const { email, password } = args;
			const user = await context.db.collection("users").findOne({ email });
			if (!user) {
				throw new GraphQLError("Credenciais inválidas.", {
					extensions: { code: "UNAUTHENTICATED" },
				});
			}

			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				throw new GraphQLError("Credenciais inválidas.", {
					extensions: { code: "UNAUTHENTICATED" },
				});
			}

			const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
				expiresIn: "7d",
			});

			return { token, user };
		},

		createEvent: async (_parent: any, args: any, context: MyContext) => {
			if (!context.userId) {
				throw new GraphQLError(
					"Não autenticado. Você precisa fazer login para criar um evento.",
					{ extensions: { code: "UNAUTHENTICATED" } }
				);
			}

			// Nenhuma mudança aqui. O scalar DateTime já garante que `args.date` é uma string válida.
			const newEventDocument = {
				...args,
				date: new Date(args.date),
				organizerId: new ObjectId(context.userId),
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const result = await context.db
				.collection("events")
				.insertOne(newEventDocument);
			const createdEvent = await context.db
				.collection("events")
				.findOne({ _id: result.insertedId });

			return createdEvent;
		},

		registerForEvent: async (
			_parent: any,
			args: { eventId: string },
			context: MyContext
		) => {
			const { userId } = context;
			const { eventId } = args;

			if (!userId) {
				throw new GraphQLError(
					"Não autenticado. Faça login para se inscrever em eventos.",
					{ extensions: { code: "UNAUTHENTICATED" } }
				);
			}
			if (!ObjectId.isValid(eventId)) {
				throw new GraphQLError("ID do evento inválido.", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}

			const event = await context.db
				.collection("events")
				.findOne({ _id: new ObjectId(eventId) });
			if (!event) {
				throw new GraphQLError("Evento não encontrado.", {
					extensions: { code: "NOT_FOUND" },
				});
			}

			const existingRegistration = await context.db
				.collection("registrations")
				.findOne({
					eventId: new ObjectId(eventId),
					participantId: new ObjectId(userId),
				});
			if (existingRegistration) {
				throw new GraphQLError("Você já está inscrito neste evento.", {
					extensions: { code: "BAD_REQUEST" },
				});
			}

			const newRegistration = {
				eventId: new ObjectId(eventId),
				participantId: new ObjectId(userId),
				status: "CONFIRMED",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const result = await context.db
				.collection("registrations")
				.insertOne(newRegistration);
			return context.db
				.collection("registrations")
				.findOne({ _id: result.insertedId });
		},
	},

	Event: {
		id: (parent: { _id: ObjectId }) => parent._id.toHexString(),
		organizer: async (
			parent: { organizerId: ObjectId },
			_args: any,
			context: MyContext
		) => {
			return context.db.collection("users").findOne({ _id: parent.organizerId });
		},
	},

	User: {
		id: (parent: { _id: ObjectId }) => parent._id.toHexString(),
	},

	Registration: {
		id: (parent: { _id: ObjectId }) => parent._id.toHexString(),
		event: async (
			parent: { eventId: ObjectId },
			_args: any,
			context: MyContext
		) => {
			return context.db.collection("events").findOne({ _id: parent.eventId });
		},
		participant: async (
			parent: { participantId: ObjectId },
			_args: any,
			context: MyContext
		) => {
			return context.db.collection("users").findOne({ _id: parent.participantId });
		},
	},
};
// =========================================================================

const startServer = async () => {
	const db = await connectDB();

	const server = new ApolloServer<MyContext>({
		typeDefs: [typeDefs], // <-- MUDANÇA SUTIL: Garantindo que está como array
		resolvers,
		plugins: [loggingPlugin],
	});

	const { url } = await startStandaloneServer(server, {
		listen: { port: 4000 },
		context: async ({ req }) => {
			const authHeader = req.headers.authorization || "";
			if (authHeader.startsWith("Bearer ")) {
				const token = authHeader.substring(7, authHeader.length);
				try {
					const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
					return { db, userId: decoded.userId };
				} catch (err) {
					logger.warn(
						{ token: token.substring(0, 10) + "..." },
						"Token inválido ou expirado recebido."
					);
				}
			}
			return { db };
		},
	});

	logger.info(`🚀 Servidor pronto em: ${url}`);
};

startServer();
