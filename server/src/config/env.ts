import dotenv from 'dotenv'
dotenv.config();

const getEnv = (key:string) => {

  const value = process.env[key]

  if(!value){
    throw new Error("Env not found");
  }

  return value

}

export const env = {
  MONGO_URL : getEnv("MONGO_URL"),
  PORT : getEnv("PORT"),
}