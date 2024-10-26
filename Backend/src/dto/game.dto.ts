export interface GameInputDTO {
    name: string;
    status: number;
    review: string;
}

export interface GameInputPatchDTO {
    name?: string;
    status?: number;
    review?: string;
}

export interface GameOutputDTO {
    id: number;
    name: string;
    status: number;
    review: string;
}
