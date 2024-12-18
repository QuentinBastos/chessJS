import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données

export interface GameAttributes {
    id?: number;
    name: string;
    review: string;
    share: number;
}

export class Game
    extends Model<GameAttributes>
    implements GameAttributes
{
    public id!: number;
    public name!: string;
    public review!: string;
    public share!: number;
}

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        review: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        share: {
            type: DataTypes.INTEGER,
        }

    },
    {
        sequelize,
        tableName: "Game",
    },
);
