import express from 'express';
import chessRoutes from './routes/chessRoutes';

const app = express();
app.use(express.json());

app.use('/chess', chessRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});