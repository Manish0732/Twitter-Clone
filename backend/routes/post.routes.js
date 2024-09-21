import express from 'express';

import { getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts, createPost, likeUnlikepost, commentOnPost, deletePost } from '../controllers/post.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/following', protectRoute, getFollowingPosts);
router.get('/user/:username', protectRoute, getUserPosts);
router.get('/likes/:id', protectRoute, getLikedPosts);
router.post('/create', protectRoute, createPost);
router.post('/like/:id', protectRoute, likeUnlikepost);
router.post('/comment/:id', protectRoute, commentOnPost);
router.delete('/:id', protectRoute, deletePost);

export default router;