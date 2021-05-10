const PhieuNhapKho = require('../models/phieunhapkho');
const PhieuNhapKhoChiTiet = require('../models/phieunhapkhochitiet');

module.exports = {
    createPNK: async (req, res, next) => {
        try {
            const { data } = req.body;

            let today = new Date();
            let created = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();

            PhieuNhapKho.find().then(async (check) => {
                if (check.length === 0) {
                    const newPNK = PhieuNhapKho({ malohang: "1000", nguoitaolohang: data[0].nguoitaolohang, ngaytaolohang: created });
                    await newPNK
                        .save()
                        .then(async (doc) => {
                            data.forEach(async dataPNK => {
                                const newPNKDetail = PhieuNhapKhoChiTiet({
                                    malohang: "1000", nguoitaolohang: dataPNK.nguoitaolohang, tenkienhang: dataPNK.tenkienhang, soluongkienhang: dataPNK.soluongkienhang, trangthai: dataPNK.trangthai,
                                    loaikienhang: dataPNK.loaikienhang, khochuakienhang: dataPNK.khochuakienhang, diachikhochua: dataPNK.diachikhochua,
                                    tennguoinhan: dataPNK.tennguoinhan, sdtnguoinhan: dataPNK.sdtnguoinhan, diachinguoinhan: dataPNK.diachinguoinhan,
                                    tennguoigui: dataPNK.tennguoigui, sdtnguoigui: dataPNK.sdtnguoigui, diachinguoigui: dataPNK.diachinguoigui
                                });
                                await newPNKDetail.save();
                            });
                            res.status(200).json({ malohang: "1000" });
                        })
                        .catch(err => {
                            console.log(error);
                            res.status(400).json({ message: "create PNK error" });
                        });
                }
                else {
                    PhieuNhapKho.find().sort({ malohang: -1 }).then(async (pnk) => {
                        const malohangCheck = (parseInt(pnk[0].malohang) + 1).toString();
                        const foundPNK = await PhieuNhapKho.findOne({ malohang: malohangCheck });
                        if (foundPNK) {
                            res.status(403).json({ message: "ID PNK is a already in use" });
                        }
                        else {
                            const newPNK = PhieuNhapKho({ malohang: malohangCheck, nguoitaolohang: data[0].nguoitaolohang, ngaytaolohang: created });
                            await newPNK
                                .save()
                                .then(async (doc) => {
                                    data.forEach(async dataPNK => {
                                        const newPNKDetail = PhieuNhapKhoChiTiet({
                                            malohang: malohangCheck, nguoitaolohang: dataPNK.nguoitaolohang, tenkienhang: dataPNK.tenkienhang, soluongkienhang: dataPNK.soluongkienhang, trangthai: dataPNK.trangthai,
                                            loaikienhang: dataPNK.loaikienhang, khochuakienhang: dataPNK.khochuakienhang, diachikhochua: dataPNK.diachikhochua,
                                            tennguoinhan: dataPNK.tennguoinhan, sdtnguoinhan: dataPNK.sdtnguoinhan, diachinguoinhan: dataPNK.diachinguoinhan,
                                            tennguoigui: dataPNK.tennguoigui, sdtnguoigui: dataPNK.sdtnguoigui, diachinguoigui: dataPNK.diachinguoigui
                                        });
                                        await newPNKDetail.save();
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

    getListPNK: async (req, res, next) => {
        const { nguoitaolohang } = req.body;
        try {
            if(nguoitaolohang === ''){
                PhieuNhapKho.find().then((pnk) => {
                    res.json({
                        result: 'ok',
                        data: pnk,
                        length: pnk.length,
                        message: 'get PNK successfully'
                    })
                })
            }
            else{
                PhieuNhapKho.find({nguoitaolohang}).then((pnk) => {
                    res.json({
                        result: 'ok',
                        data: pnk,
                        length: pnk.length,
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
            PhieuNhapKhoChiTiet.find({malohang}).then((pnkchitiet) => {
                res.json({
                    result: 'ok',
                    data: pnkchitiet,
                    message: 'get PNKDetail successfully'
                })
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get PNKDetail error" });
        }
    },

    searchPNK: async (req, res, next) => {
        const { queryString, dataQuery } = req.body;
        try {
            if(queryString === "nguoitaolohang"){
                PhieuNhapKho.find({nguoitaolohang: dataQuery}).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if(queryString === "malohang"){
                PhieuNhapKho.find({malohang: dataQuery}).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if(queryString === "ngaytaolohang"){
                
                PhieuNhapKho.find({ ngaytaolohang: { $gte: dataQuery.date_from, $lte: dataQuery.date_to}}).sort([['time', -1]]).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if(queryString === "khochuakienhang"){

            }
            
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get PNK error" });
        }
    },


}