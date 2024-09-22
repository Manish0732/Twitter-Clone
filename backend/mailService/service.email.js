import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})


export const mailService = async (email, OTP) => {
    try {
        const info = await transporter.sendMail({
            from: "Twitter-Clone 𝕏",
            to: email,
            subject: "You Requested Password Reset OTP for Twitter-Clone",
            html: `<b>This is OTP for your Twitter-Clone account</b><br><br>Your OTP is: <b>${OTP}</b>`,
        });

        console.log(`OTP sent to ${email} `, info.messageId);
    }
    catch (error) {
        console.log("Error in mailService ", error.message);
    }
}

