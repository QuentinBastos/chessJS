export interface GameInputDTO {
    name: string;
    review: string;
}

export interface GameInputPatchDTO {
    name?: string;
    review?: string;
}

export interface GameOutputDTO {
    id: number;
    name: string;
    review: string;
}
