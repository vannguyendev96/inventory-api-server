const KiemKe = require('../models/kiemke');

module.exports = {
    createKiemKe: async (req, res, next) => {
        try {
            const { data, soluong, trangthai } = req.body;

            let today = new Date();
            let created = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();

            const newKiemKe = KiemKe({
                tenkienhang: data.tenkienhang,
                soluongkiemke: soluong,
                trangthaikienhang: trangthai,
                dongia: data.dongia,
                loaikienhang: data.loaikienhang,
                khochuakienhang: data.khochuakienhang,
                ngaykiemke: created
            });

            await newKiemKe.save();
            res.status(200).json({ message: "create kiem ke success" });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "create kiem ke error" });
        }
    },

    getdetail: async (req, res, next) => {
        try {
            const { data } = req.body;
            KiemKe.find({
                tenkienhang: data.tenkienhang,
                dongia: data.dongia,
                loaikienhang: data.loaikienhang,
                khochuakienhang: data.khochuakienhang
            }).then((kiemke) => {
                res.json({
                    result: 'ok',
                    data: kiemke,
                    message: 'get kiem ke successfully'
                })
            });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get kiem ke error" });
        }
    },
}