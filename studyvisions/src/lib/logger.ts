import { prisma } from "@/lib/prisma";

export type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";
export type LogCategory = "APPLICATION" | "API" | "AUTH" | "PAYMENT" | "ERROR" | "SYSTEM";

interface LogProps {
  level: LogLevel;
  category: LogCategory;
  message: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

export const logger = {
  log: async ({ level, category, message, requestId, metadata }: LogProps) => {
    try {
      // In production, we don't await this to avoid blocking the request thread.
      prisma.systemLog.create({
        data: {
          level,
          category,
          message,
          requestId,
          metadata: metadata ? (typeof metadata === 'object' ? metadata : { raw: metadata }) : undefined,
        }
      }).catch(console.error);

      // Console fallback for local dev
      if (process.env.NODE_ENV !== "production") {
        console.log(`[${level}] [${category}] ${message}`, metadata || "");
      }
    } catch (e) {
      console.error("Logger Failed", e);
    }
  },
  
  error: (message: string, metadata?: any) => 
    logger.log({ level: "ERROR", category: "ERROR", message, metadata }),
    
  info: (message: string, category: LogCategory = "APPLICATION", metadata?: any) => 
    logger.log({ level: "INFO", category, message, metadata }),
    
  critical: (message: string, metadata?: any) => 
    logger.log({ level: "CRITICAL", category: "SYSTEM", message, metadata }),
};
