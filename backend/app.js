import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import connectToMOngoDB from './db/connectToMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev')); // morgan for console level request tracking.

app.use(express.json());  // to parse req.body
app.use(express.urlencoded({ extended: true }))  // to parse form data

app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    connectToMOngoDB();
});