const PhieuNhapKho = require('../models/phieunhapkho');
const PhieuNhapKhoChiTiet = require('../models/phieunhapkhochitiet');
const Warehouse = require('../models/warehouse');

async function getDoanhThu(khochua) {
    let result = 0;
    let listMaLoHang = [];
    await PhieuNhapKhoChiTiet.find({ khochuakienhang: khochua }).then((pnkchitiet) => {
        pnkchitiet.forEach(element => {
            listMaLoHang.push(element.malohang)
        });
    })
    await PhieuNhapKho.find({ malohang: listMaLoHang }).then((pnk) => {

        for (let i = 0; i < pnk.length; i++) {
            const dongiaConvert = (pnk[i].tongtien).split(",").join("");
            result = result + parseFloat(dongiaConvert, 10);
        }
        return result;
    })
    return result;
}

module.exports = {
    createWarehouse: async (req, res, next) => {
        try {
            const { tenkhohang, succhua, trangthai, provine, district, phuong } = req.body;

            const foundWarehouse = await Warehouse.findOne({ tenkhohang });
            if (foundWarehouse) {
                res.status(403).json({ message: "Warehouse info is a already in use" });
            }
            else {
                const newWarehouse = Warehouse({ tenkhohang, succhua, trangthai, provine, district, phuong });
                await newWarehouse.save();
                res.status(200).json({ message: "create info warehouse success" });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "create info warehouse error" });
        }
    },

    getListWarehouse: async (req, res, next) => {
        //const getdoanhthu = getDoanhThu(khohang.tenkhohang);
        try {
            const result = [];
            await Warehouse.find().then(async (warehouse) => {
                // warehouse.forEach(async khohang => {
                //     const resultdoanhthu = await getDoanhThu(khohang.tenkhohang);
                //     const dataAdd = {
                //         _id: khohang._id,
                //         tenkhohang: khohang.tenkhohang,
                //         succhua: khohang.succhua,
                //         trangthai: khohang.trangthai,
                //         provine: khohang.provine,
                //         district: khohang.district,
                //         phuong: khohang.phuong,
                //         doanhthu: resultdoanhthu,
                //         __v: 0
                //     }
                //     result.push(dataAdd);
                // });
                for(let i=0; i< warehouse.length; i++)
                {
                    const resultdoanhthu = await getDoanhThu(warehouse[i].tenkhohang);
                    const dataAdd = {
                        _id: warehouse[i]._id,
                        tenkhohang: warehouse[i].tenkhohang,
                        succhua: warehouse[i].succhua,
                        trangthai: warehouse[i].trangthai,
                        provine: warehouse[i].provine,
                        district: warehouse[i].district,
                        phuong: warehouse[i].phuong,
                        doanhthu: new Intl.NumberFormat().format(resultdoanhthu),
                        __v: 0
                    }
                    result.push(dataAdd);
                }
            })
            res.json({
                result: 'ok',
                data: result,
                length: result.length,
                message: 'get warehouse successfully'
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
            else {
                Warehouse.findOneAndDelete({ tenkhohang }, function (err, docs) {
                    if (err) {
                        res.status(404).json({ message: "delete Warehouse error" });
                    }
                    else {
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
            const { tenkhohang, succhua, trangthai, provine, district, phuong } = req.body;
            const foundWarehouse = await Warehouse.findOne({ tenkhohang });
            if (!foundWarehouse) {
                res.status(403).json({ message: "Warehouse is not in data" });
            }
            else {
                const succhuaUpdate = (succhua !== '' && succhua !== undefined) ? succhua : foundWarehouse.succhua;
                const trangthaiUpdate = (trangthai !== '' && trangthai !== undefined) ? trangthai : foundWarehouse.trangthai;
                const provineUpdate = (provine !== '' && provine !== undefined) ? provine : foundWarehouse.provine;
                const districtUpdate = (district !== '' && district !== undefined) ? district : foundWarehouse.district;
                const phuongUpdate = (phuong !== '' && phuong !== undefined) ? phuong : foundWarehouse.phuong;

                Warehouse.findOneAndUpdate({ _id: foundWarehouse._id }, { $set: { succhua: succhuaUpdate, trangthai: trangthaiUpdate, provine: provineUpdate, district: districtUpdate, phuong: phuongUpdate } }, function (err, docs) {
                    if (err) {
                        res.status(404).json({ message: "update Warehouse error" });
                    }
                    else {
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
            else {
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