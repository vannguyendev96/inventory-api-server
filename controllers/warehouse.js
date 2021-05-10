const Warehouse = require('../models/warehouse');

module.exports = {
    createWarehouse: async (req,res,next) =>{
        try {
            const { tenkhohang, succhua,trangthai, provine,district, phuong } = req.body;

            const foundWarehouse = await Warehouse.findOne({ tenkhohang });
            if (foundWarehouse) {
                res.status(403).json({ message: "Warehouse info is a already in use" });
            }
            else{
                const newWarehouse = Warehouse({ tenkhohang, succhua,trangthai, provine,district, phuong });
                await newWarehouse.save();
                res.status(200).json({ message: "create info warehouse success" });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "create info warehouse error" });
        }
    },

    getListWarehouse: async (req, res, next) => {
        try {
            Warehouse.find().then((warehouse) => {
                res.json({
                    result: 'ok',
                    data: warehouse,
                    length: warehouse.length,
                    message: 'get warehouse successfully'
                })
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get info warehouse error" });
        }
    },

    deleteWarehouse: async (req, res, next) => {
        try {
            const { tenkhohang } = req.body;
            const foundWarehouse = await Warehouse.findOne({ tenkhohang });
            if (!foundWarehouse) {
                res.status(403).json({ message: "Warehouse is not in data" });
            }
            else{
                Warehouse.findOneAndDelete({ tenkhohang }, function (err, docs) {
                    if (err){
                        res.status(404).json({ message: "delete Warehouse error" });
                    }
                    else{
                        res.status(200).json({ message: "delete Warehouse success" });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get info user error" });
        }
    },

    editWarehouse: async (req, res, next) => {
        try {
            const { tenkhohang, succhua,trangthai, provine,district, phuong } = req.body;
            const foundWarehouse = await Warehouse.findOne({ tenkhohang });
            if (!foundWarehouse) {
                res.status(403).json({ message: "Warehouse is not in data" });
            }
            else{
                const succhuaUpdate = (succhua !== '' && succhua !== undefined) ? succhua : foundWarehouse.succhua;
                const trangthaiUpdate = (trangthai !== '' && trangthai !== undefined) ? trangthai : foundWarehouse.trangthai;
                const provineUpdate = (provine !== '' && provine !== undefined) ? provine : foundWarehouse.provine;
                const districtUpdate = (district !== '' && district !== undefined) ? district : foundWarehouse.district;
                const phuongUpdate = (phuong !== '' && phuong !== undefined) ? phuong : foundWarehouse.phuong;

                Warehouse.findOneAndUpdate({ _id: foundWarehouse._id },{$set:{succhua:succhuaUpdate,trangthai:trangthaiUpdate,provine: provineUpdate,district:districtUpdate,phuong:phuongUpdate}}, function (err, docs) {
                    if (err){
                        res.status(404).json({ message: "update Warehouse error" });
                    }
                    else{
                        res.status(200).json({ message: "update Warehouse success" });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "update info Warehouse error" });
        }
    },

    getByIDWarehouse: async (req, res, next) => {
        try {
            const { tenkhohang } = req.body;
            const foundWarehouse = await Warehouse.findOne({ tenkhohang });
            if (!foundWarehouse) {
                res.status(403).json({ message: "Warehouse is not in data" });
            }
            else{
                res.json({
                    result: 'ok',
                    data: foundWarehouse,
                    message: 'get warehouse successfully'
                })
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get info user error" });
        }
    },
}