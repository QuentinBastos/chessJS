export interface GameInputDTO {
    name: string;
    review: string;
    share: number;
}

export interface GameInputPatchDTO {
    name?: string;
    review?: string;
    share?: number;
}

export interface GameOutputDTO {
    id: number;
    name: string;
    review: string;
    share: number;
}
