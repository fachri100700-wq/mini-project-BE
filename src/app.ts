import express, {Request, Response} from 'express';

const PORT: number = 8000;

const app = express();

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});