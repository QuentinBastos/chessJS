import { GameOutputDTO } from "../dto/game.dto";
import { notFound } from "../error/NotFoundError";
import { GameMapper } from "../mapper/game.mapper";
import { Game } from "../models/game.model";

export class GameService {

    public async getAllGames(): Promise<GameOutputDTO[]> {
        const gameList = await Game.findAll();
        return GameMapper.toOutputDtoList(gameList);
    }


    public async getGameById(id: number): Promise<GameOutputDTO> {
        const game = await Game.findByPk(id);
        if (game) {
            return GameMapper.toOutputDto(game);
        } else {
            notFound("Game");
        }
    }

    public async createGame(
        name: string,
        review: string,
        share: number,
    ): Promise<GameOutputDTO> {
        return GameMapper.toOutputDto(
            await Game.create({ name: name ,review: review, share: share }),
        );
    }

    public async deleteGame(id: number): Promise<void> {
        const game = await Game.findByPk(id);
        if (game) {
            await game.destroy();
        } else {
            notFound("Game");
        }
    }

    public async updateGame(
        id: number,
        name: string,
        review: string,
        share: number,
    ): Promise<GameOutputDTO> {
        const game = await Game.findByPk(id);
        if (game) {
            if (name) game.name = name;
            if (review) game.review = review;
            if (share) game.share = share
            await game.save();
            return GameMapper.toOutputDto(game);
        } else {
            notFound("Game");
        }
    }
}

export const gameService = new GameService();
