const Driver = require('../models/driver');

module.exports = {
    createInfoDriver: async (req,res,next) =>{
        try {
            const { cmnd, tentx,trangthai, sdt, namsinh, provine,district, phuong } = req.body;

            const foundDriver = await Driver.findOne({ cmnd });
            if (foundDriver) {
                res.status(403).json({ message: "Driver info is a already in use" });
            }
            else{
                const newDriver = Driver({ cmnd, tentx,trangthai, sdt, namsinh, provine,district, phuong });
                await newDriver.save();
                res.status(200).json({ message: "create info driver success" });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "create info driver error" });
        }
    }
}