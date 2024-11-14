import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { Buffer } from "buffer";
import { notFound } from "../error/NotFoundError";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export class AuthenticationService {
    public async authenticate(
        name: string,
        password: string
    ): Promise<string> {
        const user = await User.findOne({ where: { name } });

        if (!user) {
            throw notFound("User");
        }

        const decodedPassword = Buffer.from(user.password, "base64").toString(
            "utf-8"
        );

        if (password === decodedPassword) {
            return this.generateJwt(user.name);
        } else {
            let error = new Error("Wrong password");
            (error as any).status = 403;
            throw error;
        }
    }

    private generateJwt(username: string): string {
        let permissions: any = {};

        const payload = {
            username: username,
            scopes: permissions,
        };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    }
}

export const authService = new AuthenticationService();
