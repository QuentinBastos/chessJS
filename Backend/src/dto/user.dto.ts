export interface UserInputDTO {
    username: string;
    email: string;
    password: string;
    rank: number;
}

export interface UserInputPatchDTO {
    username?: string;
    email?: string;
    password?: string;
    rank?: number;
}

export interface UserOutputDTO {
    id: number
    username: string;
    email: string;
    password: string;
    rank: number;
}
