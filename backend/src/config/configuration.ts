export interface AppConfig {
  port: number;
  mongoUri: string;
  corsOrigins: string[];
  adminApiKey: string;
  funnel: {
    whatsappGroupUrl: string;
    progressPercentage: number;
  };
}

export const configuration = (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  mongoUri: process.env.MONGODB_URI ?? '',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  adminApiKey: process.env.ADMIN_API_KEY ?? '',
  funnel: {
    whatsappGroupUrl: process.env.WHATSAPP_GROUP_URL ?? '',
    progressPercentage: parseInt(process.env.FUNNEL_PROGRESS ?? '79', 10),
  },
});
