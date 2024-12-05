import express, { Application } from "express";
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import { API_PORT, FRONT_URL, API_ROOT_URL, API_DOC_URL } from "../../Shared/constants";
import { RegisterRoutes } from "./routes";
import errorHandler from "./middlewares/errorHandler";
import chessRoutes from "./routes/chessRoutes";

const PORT = API_PORT || 8000;
const app: Application = express();

app.use(cors({
    origin: FRONT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(express.static("public"));
app.use(
    API_DOC_URL,
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    }),
);

RegisterRoutes(app);

app.use(errorHandler);

app.use(API_ROOT_URL, chessRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});