export interface HistoryInputDTO {
    idUser: number;
    idGame: number;
}

export interface HistoryInputPatchDTO {
    idUser?: number;
    idGame?: number;
}

export interface HistoryOutputDTO {
    id: number;
    idUser: number;
    idGame: number;
}
