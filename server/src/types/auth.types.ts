
export type RegisterPayload = {
    name: string;
    number: string;
    password: string;
    avatar: string;
}

export type LoginPayload = Omit<RegisterPayload, "name">;

export type JWTPayload = {
    _id: string;
    number: string;
    role: string;
}