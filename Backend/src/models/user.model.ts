import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données

export interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    password: string;
    rank: number;
}

export class User
    extends Model<UserAttributes>
    implements UserAttributes
{
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public rank!: number;
}

User.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "User",
    },
);
