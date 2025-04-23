import express from 'express';
import protectRoutes from '../middleware/auth.protectrouts.js';
import { deleteMessage, getMessages, getUserforsidebar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users', protectRoutes, getUserforsidebar);
router.get('/:id', protectRoutes, getMessages);
router.post('/:id', protectRoutes, sendMessage);
router.delete('/:id', protectRoutes, deleteMessage);

export default router;