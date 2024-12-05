import {User} from "../models/user.model";
import jwt from "jsonwebtoken"; // Pour générer le JWT
import {Buffer} from "buffer"; // Pour décoder Base64
import {notFound} from "../error/NotFoundError";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export class AuthenticationService {
    public async authenticate(
        username: string,
        password: string
    ): Promise<(string | number)[]> {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            throw notFound("User");
        }

        const decodedPassword = Buffer.from(user.password, "base64").toString(
            "utf-8"
        );
        console.log("Decoded password:", decodedPassword);
        if (password === decodedPassword) {
            console.log("Provided password:", password);
            let jwtToken = this.generateJwt(user.username)
            return ([jwtToken, user.id, user.username, user.email]);
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
        console.log("JWT Payload: ", payload);  // Log the payload
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    }

}

export const authService = new AuthenticationService();
