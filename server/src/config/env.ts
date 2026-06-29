import dotenv from 'dotenv'
dotenv.config();

const getEnv = (key: string) => {

  const value = process.env[key]

  if (!value) {
    throw new Error("Env not found");
  }

  return value

}

export const env = {
  MONGO_URL: getEnv("MONGO_URL"),
  PORT: getEnv("PORT"),
  SALT: getEnv("SALT"),
  CLIENT_URL: getEnv("CLIENT_URL"),
  NODE_ENV: getEnv("NODE_ENV"),
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  ACCESS_TOKEN_EXPIRES_IN: getEnv("ACCESS_TOKEN_EXPIRES_IN"),
  REFRESH_TOKEN_EXPIRES_IN: getEnv("REFRESH_TOKEN_EXPIRES_IN")
}