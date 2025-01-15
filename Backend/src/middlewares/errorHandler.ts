import { Request, Response } from "express";

interface Error {
    status?: number;
    message?: string;
}

interface RequestField {
    message?: string;
    value?: string;
}


const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
): void => {

    const statusCode = err.status || 500;

    if (statusCode === 400 && "fields" in err) {
        for (const key in err.fields as string[]) {
            const request = (err.fields as RequestField[])[key];
            if ("message" in request && "value" in request) {
                err.message =
                    key.replace("requestBody.", "") +
                    " " +
                    request.value +
                    " " +
                    request.message;
            }
        }
    }

    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        status: statusCode,
        message: message,
    });
};

export default errorHandler;
