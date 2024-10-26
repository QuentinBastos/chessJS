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
@Security("jwt")
export class UserController extends Controller {
    @Get("/")
    public async getAllUsers(): Promise<UserOutputDTO[]> {
        return userService.getAllUsers();
    }

    @Get("{id}")
    public async getUserById(@Path() id: number): Promise<UserOutputDTO> {
        return userService.getUserById(id);
    }

    @Post("/")
    public async createUser(
        @Body() requestBody: UserInputDTO,
    ): Promise<UserOutputDTO> {
        const { name, email, password, rank } = requestBody;
        return userService.createUser(name, email, password, rank);
    }

    @Delete("{id}")
    public async deleteUser(@Path() id: number): Promise<void> {
        await userService.deleteUser(id);
    }

    @Patch("{id}")
    public async updateUser(
        @Path() id: number,
        @Body() requestBody: UserInputPatchDTO,
    ): Promise<UserOutputDTO> {
        const { name, email, password, rank } = requestBody;
        return userService.updateUser(id, name, email, password, rank);
    }
}
