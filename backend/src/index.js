import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import connectToDatabase from "./lib/db.js";
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { io, app, server } from "./lib/socket.js";

app.use(express.json());
dotenv.config();

const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

connectToDatabase();

app.use('/api/auth', authRoutes);

app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});