import { HistoryInputDTO, HistoryInputPatchDTO, HistoryOutputDTO } from "../dto/history.dto";
import { notFound } from "../error/NotFoundError";
import { History } from "../models/history.model";
import { User } from "../models/user.model";
import { Game } from "../models/game.model";
import {HistoryMapper} from "../mapper/history.mapper";


export class HistoryService {


    public async getAllHistories(): Promise<HistoryOutputDTO[]> {
        const historyList = await History.findAll({
            include: [User, Game],
        });
        return HistoryMapper.toOutputDtoList(historyList);
    }

    public async getHistoryById(id: number): Promise<HistoryOutputDTO> {
        const history = await History.findByPk(id, {
            include: [User, Game],
        });
        if (history) {
            return HistoryMapper.toOutputDto(history);
        } else {
            notFound("History");
        }
    }

    public async createHistory(input: HistoryInputDTO): Promise<HistoryOutputDTO> {
        const { idUser, idGame } = input;

        const user = await User.findByPk(idUser);
        const game = await Game.findByPk(idGame);

        if (!user) notFound("User");
        if (!game) notFound("Game");

        const newHistory = await History.create({
            idUser: idUser,
            idGame: idGame,
        });

        return HistoryMapper.toOutputDto(newHistory);
    }

    public async deleteHistory(id: number): Promise<void> {
        const history = await History.findByPk(id);
        if (history) {
            await history.destroy();
        } else {
            notFound("History");
        }
    }

    public async updateHistory(id: number, input: HistoryInputPatchDTO): Promise<HistoryOutputDTO> {
        const history = await History.findByPk(id);
        if (history) {
            if (input.idUser) {
                const user = await User.findByPk(input.idUser);
                if (!user) notFound("User");
                history.idUser = input.idUser;
            }

            if (input.idGame) {
                const game = await Game.findByPk(input.idGame);
                if (!game) notFound("Game");
                history.idGame = input.idGame;
            }

            await history.save();
            return HistoryMapper.toOutputDto(history);
        } else {
            notFound("History");
        }
    }
}

export const historyService = new HistoryService();
