import { UserOutputDTO } from "../dto/user.dto";
import { User } from "../models/user.model";

export class UserMapper {
    public static toOutputDto(user: User): UserOutputDTO {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            rank: user.rank,
        };
    }

    public static toOutputDtoList(userList: User[]): UserOutputDTO[] {
        return userList.map((user) => UserMapper.toOutputDto(user));
    }
}
