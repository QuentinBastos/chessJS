import { GameOutputDTO } from "../dto/game.dto";
import { Game } from "../models/game.model";

export class GameMapper {
    public static toOutputDto(game: Game): GameOutputDTO {
        return {
            id: game.id,
            name: game.name,
            review: game.review,
            share: game.share,
        };
    }

    public static toOutputDtoList(gameList: Game[]): GameOutputDTO[] {
        return gameList.map((game) => GameMapper.toOutputDto(game));
    }
}
