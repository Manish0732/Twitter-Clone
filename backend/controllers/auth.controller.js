import bcrypt from 'bcryptjs';

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import { mailService } from '../mailService/service.email.js';

// register user with correct information
export const signup = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;

        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailregex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email is already taken' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullname,
            username,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileimg: newUser.profileimg,
                coverimg: newUser.coverimg,
            });
        } else {
            res.status(400).json({ error: "Invalid User Data" });
        }

    } catch (error) {
        console.log("Error in signup controller: " + error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// login user with correct credentials
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || " "); // if not found password then compare with empty string

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileimg: user.profileimg,
            coverimg: user.coverimg,
        })

    } catch (error) {
        console.log('Error in login controller: ' + error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// logout user (destroy cookie )
export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 })
        res.status(200).json({ message: 'Logged Out Successfully' })
    } catch (error) {
        console.log('Error in logout controller' + error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// get logged userInfo
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp');
        res.status(200).json(user);
    } catch (error) {
        console.log('Error in getMe controller ' + error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// generate otp
export const forgot = async (req, res) => {
    try {
        const { email } = req.body;
        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailregex.test(email)) return res.status(400).json({ error: 'Invalid email address' });
        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const OTP = Math.floor(100000 + Math.random() * 900000);
        user.otp.value = OTP;
        user.otp.time = Date.now();
        await user.save();
        user.password = undefined;
        user.otp = undefined;
        await mailService(email, OTP);
        res.status(200).json({ message: 'OTP sent successfully', user });
    } catch (error) {
        console.log('Error in forgot controller ' + error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//set new password
export const verifyReset = async (req, res) => {
    try {
        const { email, OTP, newPassword } = req.body;
        if (!OTP) return res.status(400).json({ error: 'OTP is required' });
        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.otp.value === null) return res.status(400).json({ error: 'User does not have OTP' });
        if (user.otp && user.otp.time.getTime() + (1000 * 60 * 5) < Date.now()) {
            user.otp.value = null;
            await user.save();
            return res.status(400).json({ error: 'OTP has expired' });
        }
        if (OTP.toString() !== user.otp.value.toString()) return res.status(400).json({ error: 'Invalid OTP' });
        if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters long' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp.value = null;
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.log("Error in verifyReset controller " + error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}