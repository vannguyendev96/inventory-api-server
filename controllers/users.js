const User = require('../models/user');
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration/index');


require('dotenv').config();



signToken = (user,expiredToken) => {
    return JWT.sign({
        iss: 'PorTalERP',
        sub: user.id,
        iat: new Date().getTime(),
        exp: expiredToken
        // exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
}

module.exports = {
    signUp: async (req, res, next) => {
        console.log('signUp call');
        const { email, password,roll, name, emailUser, sdt } = req.value.body;
        
        const foundUser = await User.findOne({ email });
        if (foundUser) {
            res.status(403).json({ error: "Email is a already in use" });
        }
        else{
            const newUser = User({ email, password, roll, name, emailUser, sdt });
            await newUser.save();
    
            const expired = new Date().setDate(new Date().getDate() + 1);
            const token = signToken(newUser,expired);
    
            res.status(200).json({ token });
        }
    },

    signIn: async (req, res, next) => {
        console.log('signUp in');
        const expiredToken = new Date().setDate(new Date().getDate() + 1);
        const token = signToken(req.user,expiredToken);

        const expiredRefreshToken = new Date().setDate(new Date().getDate() + 3650);
        const refreshToken = signToken(req.user,expiredRefreshToken);
       
        res.status(200).json({ roll: req.user.roll, token: token, refreshToken: refreshToken});
    },

    secret: async (req, res, next) => {
        console.log('secret call test submit')
        res.status(200).json({  });
    },

}