import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/index"; // tsoa va générer ce fichier
import errorHandler from "./middlewares/errorHandler";
import chessRoutes from './routes/chessRoutes';

const PORT = 8000;
const app: Application = express();

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173' // Adjust the origin to match your frontend's URL
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