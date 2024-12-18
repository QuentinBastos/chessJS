import {
    Controller,
    Get,
    Post,
    Delete,
    Route,
    Path,
    Body,
    Tags,
    Patch,
    Security,
} from "tsoa";
import { gameService } from "../services/game.service";
import {
    GameInputDTO,
    GameInputPatchDTO,
    GameOutputDTO,
} from "../dto/game.dto";

@Route("games")
@Tags("Games")
@Security("jwt")
export class GameController extends Controller {
    @Get("/")
    public async getAllGames(): Promise<GameOutputDTO[]> {
        return await gameService.getAllGames();
    }

    @Get("{id}")
    public async getGameById(@Path() id: number): Promise<GameOutputDTO> {
        return await gameService.getGameById(id);
    }

    @Post("/")
    public async createGame(
        @Body() requestBody: GameInputDTO
    ): Promise<GameOutputDTO> {
        const { name, review, share } = requestBody;
        return await gameService.createGame(name, review, share);
    }

    @Delete("{id}")
    public async deleteGame(@Path() id: number): Promise<void> {
        await gameService.deleteGame(id);
    }

    @Patch("{id}")
    public async updateGame(
        @Path() id: number,
        @Body() requestBody: GameInputPatchDTO
    ): Promise<GameOutputDTO> {
        const { name, review, share } = requestBody;
        return await gameService.updateGame(id, <string>name, <string>review, <number>share);
    }
}
