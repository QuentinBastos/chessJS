export interface UserInputDTO {
    name: string;
    email: string;
    password: string;
    rank: number;
}

export interface UserInputPatchDTO {
    name?: string;
    email?: string;
    password?: string;
    rank?: number;
}

export interface UserOutputDTO {
    id: number
    name: string;
    email: string;
    password: string;
    rank: number;
}
