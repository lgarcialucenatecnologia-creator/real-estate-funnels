export interface AppConfig {
  port: number;
  mongoUri: string;
  corsOrigins: string[];
  adminPassword: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
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
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '12h',
  },
  funnel: {
    whatsappGroupUrl: process.env.WHATSAPP_GROUP_URL ?? '',
    progressPercentage: parseInt(process.env.FUNNEL_PROGRESS ?? '79', 10),
  },
});
