import express, { Application } from "express";
import cors from 'cors'; // Importer le middleware CORS
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "./routes/index"; // tsoa va générer ce fichier
import errorHandler from "./middlewares/errorHandler";
import chessRoutes from './routes/chessRoutes';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;
const app: Application = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,

}));

app.use(express.json());
app.use(express.static("public"));
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    }),
);

RegisterRoutes(app);

app.use(errorHandler);

app.use('/api', chessRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});