import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { User } from "./user.model";
import { Game } from "./game.model";

export interface HistoryAttributes {
    id?: number;
    idUser: number;
    idGame: number;
}

export class History
    extends Model<HistoryAttributes>
    implements HistoryAttributes
{
    public id!: number;
    public idUser!: number;
    public idGame!: number;
}

History.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        idGame: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Game,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        tableName: "History",
    }
);

User.hasMany(History, { foreignKey: "idUser" });
Game.hasMany(History, { foreignKey: "idGame" });
History.belongsTo(User, { foreignKey: "idUser" });
History.belongsTo(Game, { foreignKey: "idGame" });
