const User = require('../models/user');
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration/index');


require('dotenv').config();



signToken = (user, expiredToken) => {
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
        try {
            const { email, password, roll, name, emailUser, sdt, kholamviec } = req.value.body;
            
            const foundUser = await User.findOne({ email });
            if (foundUser) {
                res.status(403).json({ error: "Username is a already in use" });
            }
            else {
                const newUser = User({ email, password, roll: "user", name, emailUser, sdt, kholamviec });
                await newUser.save();

                const expired = new Date().setDate(new Date().getDate() + 1);
                const token = signToken(newUser, expired);

                res.status(200).json({ token });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "create info user error" });
        }

    },

    signIn: async (req, res, next) => {
        console.log('signUp in');
        const expiredToken = new Date().setDate(new Date().getDate() + 1);
        const token = signToken(req.user, expiredToken);

        const expiredRefreshToken = new Date().setDate(new Date().getDate() + 3650);
        const refreshToken = signToken(req.user, expiredRefreshToken);

        res.status(200).json({ roll: req.user.roll, token: token, refreshToken: refreshToken });
    },

    secret: async (req, res, next) => {
        console.log('secret call test submit')
        res.status(200).json({});
    },

    getListUser: async (req, res, next) => {
        try {
            User.find().then((user) => {
                res.json({
                    result: 'ok',
                    data: user,
                    length: user.length,
                    message: 'get User successfully'
                })
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get info user error" });
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const { email } = req.body;
            const foundUser = await User.findOne({ email });
            if (!foundUser) {
                res.status(403).json({ message: "Username is not in data" });
            }
            else{
                if(foundUser.roll === "admin"){
                    res.status(404).json({ message: "can't delete user roll admin" });
                }
                else{
                    User.findOneAndDelete({ email }, function (err, docs) {
                        if (err){
                            res.status(404).json({ message: "delete user error" });
                        }
                        else{
                            res.status(200).json({ message: "delete user success" });
                        }
                    });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get info user error" });
        }
    },


    editUser: async (req, res, next) => {
        try {
            const { email, roll, name, emailUser, sdt, kholamviec } = req.body;
            const foundUser = await User.findOne({ email });
            if (!foundUser) {
                res.status(403).json({ message: "Username is not in data" });
            }
            else{
                User.findOneAndUpdate({ _id: foundUser._id },{$set:{roll:roll,name:name,emailUser: emailUser,sdt:sdt,kholamviec:kholamviec}}, function (err, docs) {
                    if (err){
                        res.status(404).json({ message: "update user error" });
                    }
                    else{
                        res.status(200).json({ message: "update user success" });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "update info user error" });
        }
    },

}