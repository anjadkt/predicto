
import jwt, { type SignOptions } from "jsonwebtoken";

export const createToken = (payload: any, secret: string, expires: string | number) => {
    return jwt.sign(payload, secret, { expiresIn: expires } as SignOptions);
}