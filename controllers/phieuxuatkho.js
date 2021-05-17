const PhieuXuatKho = require('../models/phieuxuatkho');
const PhieuNhapKho = require('../models/phieunhapkho');
const PhieuXuatKhoChiTiet = require('../models/phieuxuatkhochitiet');

module.exports = {
    createPNK: async (req, res, next) => {
        try {
            const { data, lydoxuatkho, sotienthanhtoan, phuongthucthanhtoan } = req.body;

            let today = new Date();
            let created = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();

            PhieuXuatKho.find().then(async (check) => {
                if (check.length === 0) {
                    const newPXK = PhieuXuatKho({ malohang: "1000", nguoitaolohang: data[0].nguoitaolohang, ngaytaolohang: created, lydoxuatkho, sotienthanhtoan, phuongthucthanhtoan });
                    await newPXK
                        .save()
                        .then(async (doc) => {
                            data.forEach(async dataPXK => {
                                const newPXKDetail = PhieuXuatKhoChiTiet({
                                    malohang: "1000", nguoitaolohang: dataPXK.nguoitaolohang, tenkienhang: dataPXK.tenkienhang, soluongkienhang: dataPXK.soluongkienhang, trangthai: dataPXK.trangthai,
                                    loaikienhang: dataPXK.loaikienhang, khochuakienhang: dataPXK.khochuakienhang, diachikhochua: dataPXK.diachikhochua,
                                    tennguoinhan: dataPXK.tennguoinhan, sdtnguoinhan: dataPXK.sdtnguoinhan, diachinguoinhan: dataPXK.diachinguoinhan,
                                    tennguoigui: dataPXK.tennguoigui, sdtnguoigui: dataPXK.sdtnguoigui, diachinguoigui: dataPXK.diachinguoigui
                                });
                                await newPXKDetail.save();
                            });
                            res.status(200).json({ malohang: "1000" });
                        })
                        .catch(err => {
                            console.log(error);
                            res.status(400).json({ message: "create PNK error" });
                        });
                }
                else {
                    PhieuXuatKho.find().sort({ malohang: -1 }).then(async (pxk) => {
                        const malohangCheck = (parseInt(pxk[0].malohang) + 1).toString();
                        const foundPXK = await PhieuXuatKho.findOne({ malohang: malohangCheck });
                        if (foundPXK) {
                            res.status(403).json({ message: "ID PNK is a already in use" });
                        }
                        else {
                            const newPXK = PhieuXuatKho({ malohang: malohangCheck, nguoitaolohang: data[0].nguoitaolohang, ngaytaolohang: created,lydoxuatkho, sotienthanhtoan, phuongthucthanhtoan });
                            await newPXK
                                .save()
                                .then(async (doc) => {
                                    data.forEach(async dataPXK => {
                                        const newPXKDetail = PhieuXuatKhoChiTiet({
                                            malohang: malohangCheck, nguoitaolohang: dataPXK.nguoitaolohang, tenkienhang: dataPXK.tenkienhang, soluongkienhang: dataPXK.soluongkienhang, trangthai: dataPXK.trangthai,
                                            loaikienhang: dataPXK.loaikienhang, khochuakienhang: dataPXK.khochuakienhang, diachikhochua: dataPXK.diachikhochua,
                                            tennguoinhan: dataPXK.tennguoinhan, sdtnguoinhan: dataPXK.sdtnguoinhan, diachinguoinhan: dataPXK.diachinguoinhan,
                                            tennguoigui: dataPXK.tennguoigui, sdtnguoigui: dataPXK.sdtnguoigui, diachinguoigui: dataPXK.diachinguoigui
                                        });
                                        await newPXKDetail.save();
                                    });
                                    res.status(200).json({ malohang: malohangCheck });
                                })
                                .catch(err => {
                                    console.log(error);
                                    res.status(400).json({ message: "create PNK error" });
                                });
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "create PNK error" });
        }
    },

    getListPXK: async (req, res, next) => {
        const { nguoitaolohang } = req.body;
        console.log(nguoitaolohang)
        try {
            if(nguoitaolohang === ''){
                PhieuXuatKho.find().then((pxk) => {
                    res.json({
                        result: 'ok',
                        data: pxk,
                        length: pxk.length,
                        message: 'get PNK successfully'
                    })
                })
            }
            else{
                PhieuXuatKho.find({nguoitaolohang}).then((pxk) => {
                    res.json({
                        result: 'ok',
                        data: pxk,
                        length: pxk.length,
                        message: 'get PNK successfully'
                    })
                })
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get PNK error" });
        }
    },

    getPNKChiTiet: async (req, res, next) => {
        const { malohang } = req.body;
        try {
            PhieuXuatKhoChiTiet.find({malohang}).then((pxkchitiet) => {
                res.json({
                    result: 'ok',
                    data: pxkchitiet,
                    message: 'get PXKDetail successfully'
                })
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get PXKDetail error" });
        }
    },

    searchPNK: async (req, res, next) => {
        const { queryString, dataQuery } = req.body;
        try {
            if(queryString === "nguoitaolohang"){
                PhieuXuatKho.find({nguoitaolohang: dataQuery}).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if(queryString === "malohang"){
                PhieuXuatKho.find({malohang: dataQuery}).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if(queryString === "ngaytaolohang"){
                
                PhieuXuatKho.find({ ngaytaolohang: { $gte: dataQuery.date_from, $lte: dataQuery.date_to}}).sort([['time', -1]]).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if(queryString === "khochuakienhang"){
                let listMaLoHang = [];
                PhieuXuatKhoChiTiet.find({khochuakienhang: dataQuery}).then((pnkchitiet) => {
                    pnkchitiet.forEach(element => {
                        listMaLoHang.push(element.malohang)
                    });
                    PhieuXuatKho.find({ malohang: listMaLoHang }).then((pnkchitiet) => {
                        res.json({
                            result: 'ok',
                            data: pnkchitiet,
                            message: 'get PNK successfully'
                        })
                    })
                })
            }
            
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get PNK error" });
        }
    },

    report: async (req, res, next) => {
       
        try {
            PhieuXuatKho.find().then((pxk) => {
                const lengthPXK = pxk.length;
                PhieuNhapKho.find().then((pnk) => {
                    const lengthPNK = pnk.length;
                    const total = lengthPXK + lengthPNK;

                    const percentPNK = lengthPNK/total*100;
                    const percentPXK = lengthPXK/total*100;
                    res.json({
                        result: 'ok',
                        percentPNK: percentPNK,
                        percentPXK: percentPXK,
                        message: 'get report successfully'
                    })
                })
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get report error" });
        }
    },
}