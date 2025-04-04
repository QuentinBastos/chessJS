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
import { userService } from "../services/user.service";
import {
    UserInputDTO,
    UserInputPatchDTO,
    UserOutputDTO,
} from "../dto/user.dto";

@Route("users")
@Tags("Users")

export class UserController extends Controller {
    @Get("/")
    @Security("jwt")
    public async getAllUsers(): Promise<UserOutputDTO[]> {
        return userService.getAllUsers();
    }

    @Get("{id}")
    @Security("jwt")
    public async getUserById(@Path() id: number): Promise<UserOutputDTO> {
        return userService.getUserById(id);
    }

    @Post("/")
    public async createUser(
        @Body() requestBody: UserInputDTO,
    ): Promise<UserOutputDTO> {
        const { username, email, password, rank } = requestBody;
        return userService.createUser(username, email, password, rank);
    }

    @Delete("{id}")
    @Security("jwt")
    public async deleteUser(@Path() id: number): Promise<void> {
        await userService.deleteUser(id);
    }

    @Patch("{id}")
    @Security("jwt")
    public async updateUser(
        @Path() id: number,
        @Body() requestBody: UserInputPatchDTO,
    ): Promise<UserOutputDTO> {
        const { username, email, password, rank } = requestBody;
        return userService.updateUser(id, username, email, password, rank);
    }
}
