import { v2 as cloudinary } from 'cloudinary';

import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

// create post with valid content(text/img)
export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId).select('-password -otp');
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!text && !img) return res.status(400).json({ error: 'Post must have text or image' });

        if (img) {
            const uploadedImage = await cloudinary.uploader.upload(img);
            img = uploadedImage.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        res.status(200).json(newPost);

    } catch (error) {
        console.log("Error in post controller (Create Post) ", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }

}

// delete particular post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.user.toString() !== req.user._id.toString()) return res.status(401).json({ error: 'you are not authorized to delete this post' });
        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post deleted Successfully' });

    } catch (error) {
        console.log("Error in post controller (Delete Post) ", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}


// comment on post
export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) return res.status(400).json({ error: "Some Text is required" });
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const comment = { user: userId, text }
        post.comments.push(comment);
        await post.save();
        const updatedPost = await Post.findById(postId)
            .populate(
                {
                    path: "user",
                    select: '-password -otp'
                })
            .populate({
                path: 'comments.user',
                select: '-password -otp'
            });
        res.status(200).json(updatedPost);

    } catch (error) {
        console.log('Error in post controller (Comment On Post) ', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//  like/unlike post
export const likeUnlikepost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const userLikedPost = post.likes.includes(userId);
        if (!userLikedPost) {
            //like post
            post.likes.push(userId);
            await post.save();
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })

            // saving as notification
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: 'like'
            })
            await notification.save();

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
        else {
            //unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        }

    } catch (error) {
        console.log("Error in like-unlike controller ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


// get all post in database sorted by date-time(latest first)
export const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find().sort({ createdAt: -1 }).populate(
            {
                path: "user",
                select: '-password -otp'
            })
            .populate({
                path: 'comments.user',
                select: '-password -otp'
            })

        if (posts.length === 0) return res.status(200).json({ message: "Posts Not found" });
        res.status(200).json(posts);

    } catch (error) {
        console.log("Error in getAllPost controller ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// get all liked posts
export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User Not found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate(
            {
                path: "user",
                select: '-password -otp'
            })
            .populate({
                path: 'comments.user',
                select: '-password -otp'
            });

        res.status(200).json(likedPosts);

    } catch (error) {
        console.log("Error in getLikedPosts controller ", error);
        res.status(500).json({ error: 'Internal Server error' });
    }
}
// get post from following only
export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not Found' });
        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password -otp"
            })
            .populate({
                path: "comments.user",
                select: "-password -otp"
            })

        res.status(200).json(feedPosts);

    } catch (error) {
        console.log("Error in get-following-posts ", error.message);
        res.status(500).json({ error: 'Internal Server error' });
    }
}

// get logged in user's post 
export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username });
        if (!user) return res.status(404).json({ error: "User not Found" });
        const userPosts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: '-password -otp'
            })
            .populate({
                path: 'comments.user',
                select: '-password -otp'
            })
        if (!userPosts) return res.status(200).josn({ message: "User did not posted anything" });

        res.status(200).json(userPosts);

    } catch (error) {
        console.log("Error in get-user-Posts controller ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// delete comment on post
export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        if (comment.user.toString() !== userId.toString() && post.user.toString() !== userId.toString()) {
            return res.status(401).json({ error: 'You are not authorized to delete this comment' });
        }
        await Post.updateOne({ _id: postId }, { $pull: { comments: { _id: commentId } } });

        const updatedPost = await Post.findById(postId)
            .populate(
                {
                    path: "user",
                    select: '-password -otp'
                })
            .populate({
                path: 'comments.user',
                select: '-password -otp'
            });

        res.status(200).json(updatedPost);

    } catch (error) {
        console.log("Error in deleteComment controller ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}