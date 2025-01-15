export function notFound(name: string): never {
    const error = new Error(name + " not found");
    (error as CustomError).status = 404;
    throw error;
}
