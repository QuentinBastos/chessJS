import { HistoryOutputDTO } from "../dto/history.dto";
import { History } from "../models/history.model";

export class HistoryMapper {

    public static toOutputDto(history: History): HistoryOutputDTO {
        return {
            id: history.id,
            idUser: history.idUser,
            idGame: history.idGame,
        };
    }

    public static toOutputDtoList(historyList: History[]): HistoryOutputDTO[] {
        return historyList.map((history) => HistoryMapper.toOutputDto(history));
    }
}
