import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //    expires in 15 days, value is in ms
        httpOnly: true, // prevents (xss) cross-site scripting attacks
        sameSite: "strict", // cross-site request forgery(CSRF) attacks protection
        secure: process.env.NODE_ENV !== 'development', // only send cookie over https in production
    })

}