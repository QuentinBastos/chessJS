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
import { historyService } from "../services/history.service";
import {
    HistoryInputDTO,
    HistoryInputPatchDTO,
    HistoryOutputDTO,
} from "../dto/history.dto";

@Route("histories")
@Tags("Histories")
@Security("jwt")
export class HistoryController extends Controller {
    @Get("/")
    public async getAllHistories(): Promise<HistoryOutputDTO[]> {
        return historyService.getAllHistories();
    }

    @Get("{id}")
    public async getHistoryById(@Path() id: number): Promise<HistoryOutputDTO> {
        return historyService.getHistoryById(id);
    }

    @Get("user/{userId}")
    public async getHistoriesByUserId(
        @Path() userId: number
    ): Promise<HistoryOutputDTO[]> {
        return await historyService.getHistoriesByUser(userId);
    }


    @Post("/")
    public async createHistory(
        @Body() requestBody: HistoryInputDTO,
    ): Promise<HistoryOutputDTO> {
        return historyService.createHistory(requestBody);
    }

    @Delete("{id}")
    public async deleteHistory(@Path() id: number): Promise<void> {
        await historyService.deleteHistory(id);
    }

    @Patch("{id}")
    public async updateHistory(
        @Path() id: number,
        @Body() requestBody: HistoryInputPatchDTO,
    ): Promise<HistoryOutputDTO> {
        return historyService.updateHistory(id, requestBody);
    }
}
