import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données

export interface GameAttributes {
    id?: number;
    name: string;
    status: number;
    review: string;
}

export class Game
    extends Model<GameAttributes>
    implements GameAttributes
{
    public id!: number;
    public name!: string;
    public status!: number;
    public review!: string;
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
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        review: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    },
    {
        sequelize,
        tableName: "Game",
    },
);
