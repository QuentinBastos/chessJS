interface CustomError extends Error {
    status?: number;
}

const error: CustomError = new Error("Invalid grant_type");
error.status = 400;
throw error;