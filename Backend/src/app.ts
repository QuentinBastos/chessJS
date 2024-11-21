import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/index"; // tsoa va générer ce fichier
import errorHandler from "./middlewares/errorHandler";
import chessRoutes from './routes/chessRoutes';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;
const app: Application = express();

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: process.env.FRONTEND_URL,
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