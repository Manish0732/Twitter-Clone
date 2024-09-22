import express from 'express';
import { getMe, signup, login, logout, forgot, verifyReset } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/me', protectRoute, getMe);

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/forgot', forgot);

router.post('/verify-reset', verifyReset);

export default router;