import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import connectToMOngoDB from './db/connectToMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    connectToMOngoDB();
});