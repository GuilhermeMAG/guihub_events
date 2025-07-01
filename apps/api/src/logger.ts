// apps/api/src/logger.ts
import pino from "pino";

const logger = pino({
	// Define o nível mínimo de log a ser exibido (ex: 'info', 'debug', 'warn', 'error')
	level: process.env.LOG_LEVEL || "debug",
	// Configuração do transporte para formatar os logs
	transport:
		process.env.NODE_ENV !== "production"
			? {
					// Usa 'pino-pretty' em desenvolvimento
					target: "pino-pretty",
					options: {
						colorize: true, // Deixa o output colorido e legível
						translateTime: "SYS:dd-mm-yyyy HH:MM:ss", // Formato de data/hora
						ignore: "pid,hostname", // Oculta informações desnecessárias no dev
					},
			  }
			: undefined, // Em produção, usa o formato JSON padrão do Pino
});

export default logger;
