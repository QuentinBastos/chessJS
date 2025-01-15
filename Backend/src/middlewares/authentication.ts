import * as express from "express";
import * as jwt from "jsonwebtoken";

interface DecodedToken {
    scopes?: { [resource: string]: string[] };
    [key: string]: unknown;
}

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<DecodedToken> {
    if (securityName === "jwt") {
        const token =
            request.body.token ||
            request.query.token ||
            request.headers["authorization"]?.split(' ')[1];

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));
            }
            jwt.verify(
                token,
                "your_jwt_secret_key",
                {},
                (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
                    if (err) {
                        reject(err);
                    } else {
                        const decodedToken = decoded as DecodedToken;
                        if (scopes !== undefined) {
                            const userScopes = decodedToken.scopes;

                            for (const scope of scopes) {
                                const [resource, action] = scope.split(":");
                                if (!userScopes?.[resource]?.includes(action)) {
                                    reject(new Error(`JWT does not contain required permission for ${scope}`));
                                }
                            }
                        }
                        resolve(decodedToken);
                    }
                }
            );
        });
    } else {
        throw new Error("Only support JWT securityName");
    }
}