import express, { Application } from "express";
import cors from 'cors'; // Importer le middleware CORS
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "./routes/index";
import errorHandler from "./middlewares/errorHandler";

const PORT = 8000;
const app: Application = express();

// Configuration de CORS
const allowedOrigins = ['http://localhost:5173']; // Frontend
app.use(cors({
    origin: allowedOrigins, // Autoriser cette origine
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes HTTP autorisées
    credentials: true, // Si vous utilisez des cookies ou des headers d'authentification
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
