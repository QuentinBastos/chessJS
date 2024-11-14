import { UserOutputDTO } from "../dto/user.dto";
import { notFound } from "../error/NotFoundError";
import { UserMapper } from "../mapper/user.mapper";
import { User } from "../models/user.model";

export class UserService {

    public async getAllUsers(): Promise<UserOutputDTO[]> {
        let userList = await User.findAll();
        return UserMapper.toOutputDtoList(userList);
    }


    public async getUserById(id: number): Promise<UserOutputDTO> {
        let user = await User.findByPk(id);
        if (user) {
            return UserMapper.toOutputDto(user);
        } else {
            notFound("User");
        }
    }

    public async createUser(
        username: string,
        email: string,
        password: string,
        rank: number,
    ): Promise<UserOutputDTO> {
        return UserMapper.toOutputDto(
            await User.create({ username: username ,email: email ,password: password, rank: rank }),
        );
    }

    public async deleteUser(id: number): Promise<void> {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
        } else {
            notFound("User");
        }
    }

    public async updateUser(
        id: number,
        username?: string,
        email?: string,
        password?: string,
        rank?: number,
    ): Promise<UserOutputDTO> {
        const user = await User.findByPk(id);
        if (user) {
            if (username) user.username = username;
            if (email) user.email = email;
            if (password) user.password = password;
            if (rank) user.rank = rank;
            await user.save();
            return UserMapper.toOutputDto(user);
        } else {
            notFound("User");
        }
    }
}

export const userService = new UserService();
