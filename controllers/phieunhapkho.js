const PhieuNhapKho = require('../models/phieunhapkho');
const PhieuNhapKhoChiTiet = require('../models/phieunhapkhochitiet');
const KienHangTonKho = require('../models/kienhangtonkho');

module.exports = {
    createPNK: async (req, res, next) => {
        try {
            const { data, driver } = req.body;

            let today = new Date();
            let created = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();

            let tongtienlohang = 0;

            data.forEach(dataPNK => {
                const dongiaConvert = (dataPNK.dongia).split(",").join("");
                tongtienlohang = tongtienlohang + parseFloat(dongiaConvert, 10) * parseFloat(dataPNK.soluongkienhang, 10);
            });


            PhieuNhapKho.find().then(async (check) => {
                if (check.length === 0) {
                    const newPNK = PhieuNhapKho({
                        malohang: "1000", nguoitaolohang: data[0].nguoitaolohang, ngaytaolohang: created,
                        taixevanchuyen: driver, tongtien: new Intl.NumberFormat().format(tongtienlohang)
                    });
                    await newPNK
                        .save()
                        .then(async (doc) => {
                            data.forEach(async dataPNK => {
                                const newPNKDetail = PhieuNhapKhoChiTiet({
                                    malohang: "1000", nguoitaolohang: dataPNK.nguoitaolohang, tenkienhang: dataPNK.tenkienhang, soluongkienhang: dataPNK.soluongkienhang, trangthai: dataPNK.trangthai,
                                    loaikienhang: dataPNK.loaikienhang, khochuakienhang: dataPNK.khochuakienhang, diachikhochua: dataPNK.diachikhochua,
                                    tennguoinhan: dataPNK.tennguoinhan, sdtnguoinhan: dataPNK.sdtnguoinhan, diachinguoinhan: dataPNK.diachinguoinhan,
                                    tennguoigui: dataPNK.tennguoigui, sdtnguoigui: dataPNK.sdtnguoigui, diachinguoigui: dataPNK.diachinguoigui,
                                    dongia: dataPNK.dongia
                                });
                                await newPNKDetail.save();

                                const foundKHTK = await KienHangTonKho.findOne({
                                    tenkienhang: (dataPNK.tenkienhang).toLowerCase(),
                                    dongia: dataPNK.dongia, loaikienhang: dataPNK.loaikienhang, khochuakienhang: dataPNK.khochuakienhang
                                });

                                if (!foundKHTK) {
                                    const newKienHangTonKho = KienHangTonKho({
                                        tenkienhang: dataPNK.tenkienhang,
                                        soluongkienhang: dataPNK.soluongkienhang,
                                        dongia: dataPNK.dongia,
                                        loaikienhang: dataPNK.loaikienhang,
                                        khochuakienhang: dataPNK.khochuakienhang,
                                        kiemke: "chưa kiểm kê"
                                    })
                                    await newKienHangTonKho.save();
                                }
                                else {
                                    const khtkQty = parseFloat(foundKHTK.soluongkienhang, 10) + parseFloat(dataPNK.soluongkienhang, 10);
                                    KienHangTonKho.findOneAndUpdate({ _id: foundKHTK._id },
                                        {
                                            $set: {
                                                soluongkienhang: khtkQty
                                            }
                                        }, async function (err, docs) {
                                            if (err) {
                                                res.status(404).json({ message: "create PNK error" });
                                            }
                                        });
                                }
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
                            const newPNK = PhieuNhapKho({
                                malohang: malohangCheck, nguoitaolohang: data[0].nguoitaolohang, ngaytaolohang: created,
                                taixevanchuyen: driver, tongtien: new Intl.NumberFormat().format(tongtienlohang)
                            });
                            await newPNK
                                .save()
                                .then(async (doc) => {
                                    data.forEach(async dataPNK => {
                                        const newPNKDetail = PhieuNhapKhoChiTiet({
                                            malohang: malohangCheck, nguoitaolohang: dataPNK.nguoitaolohang, tenkienhang: dataPNK.tenkienhang, soluongkienhang: dataPNK.soluongkienhang, trangthai: dataPNK.trangthai,
                                            loaikienhang: dataPNK.loaikienhang, khochuakienhang: dataPNK.khochuakienhang, diachikhochua: dataPNK.diachikhochua,
                                            tennguoinhan: dataPNK.tennguoinhan, sdtnguoinhan: dataPNK.sdtnguoinhan, diachinguoinhan: dataPNK.diachinguoinhan,
                                            tennguoigui: dataPNK.tennguoigui, sdtnguoigui: dataPNK.sdtnguoigui, diachinguoigui: dataPNK.diachinguoigui,
                                            dongia: dataPNK.dongia
                                        });
                                        await newPNKDetail.save();

                                        const foundKHTK = await KienHangTonKho.findOne({
                                            tenkienhang: (dataPNK.tenkienhang).toLowerCase(),
                                            dongia: dataPNK.dongia, loaikienhang: dataPNK.loaikienhang, khochuakienhang: dataPNK.khochuakienhang
                                        });

                                        if (!foundKHTK) {
                                            const newKienHangTonKho = KienHangTonKho({
                                                tenkienhang: dataPNK.tenkienhang,
                                                soluongkienhang: dataPNK.soluongkienhang,
                                                dongia: dataPNK.dongia,
                                                loaikienhang: dataPNK.loaikienhang,
                                                khochuakienhang: dataPNK.khochuakienhang,
                                                kiemke: "chưa kiểm kê"
                                            })
                                            await newKienHangTonKho.save();
                                        }
                                        else {
                                            const khtkQty = parseFloat(foundKHTK.soluongkienhang, 10) + parseFloat(dataPNK.soluongkienhang, 10);
                                            KienHangTonKho.findOneAndUpdate({ _id: foundKHTK._id },
                                                {
                                                    $set: {
                                                        soluongkienhang: khtkQty
                                                    }
                                                }, async function (err, docs) {
                                                    if (err) {
                                                        res.status(404).json({ message: "create PNK error" });
                                                    }
                                                    else {
                                                        res.status(200).json({ malohang: malohangCheck });
                                                    }
                                                });
                                        }
                                    });
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
            if (nguoitaolohang === '') {
                PhieuNhapKho.find().then((pnk) => {
                    res.json({
                        result: 'ok',
                        data: pnk,
                        length: pnk.length,
                        message: 'get PNK successfully'
                    })
                })
            }
            else {
                PhieuNhapKho.find({ nguoitaolohang }).then((pnk) => {
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
            PhieuNhapKhoChiTiet.find({ malohang }).then((pnkchitiet) => {
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
            if (queryString === "nguoitaolohang") {
                PhieuNhapKho.find({ nguoitaolohang: dataQuery }).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if (queryString === "malohang") {
                PhieuNhapKho.find({ malohang: dataQuery }).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if (queryString === "ngaytaolohang") {

                PhieuNhapKho.find({ ngaytaolohang: { $gte: dataQuery.date_from, $lte: dataQuery.date_to } }).sort([['time', -1]]).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if (queryString === "khochuakienhang") {
                let listMaLoHang = [];
                PhieuNhapKhoChiTiet.find({ khochuakienhang: dataQuery }).then((pnkchitiet) => {
                    pnkchitiet.forEach(element => {
                        listMaLoHang.push(element.malohang)
                    });
                    PhieuNhapKho.find({ malohang: listMaLoHang }).then((pnkchitiet) => {
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

    editPNK: async (req, res, next) => {
        try {
            const { malohang, tenkienhang, soluongkienhang, dongia,
                trangthai, loaikienhang, khochuakienhang, diachikhochua, diachinguoinhan,
                tennguoigui, sdtnguoigui, diachinguoigui, dataUpdate } = req.body;

            const foundPNK = await PhieuNhapKhoChiTiet.findOne({
                malohang: dataUpdate.malohang, tenkienhang: dataUpdate.tenkienhang, soluongkienhang: dataUpdate.soluongkienhang,
                dongia: dataUpdate.dongia, trangthai: dataUpdate.trangthai, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang,
                diachinguoinhan: dataUpdate.diachinguoinhan, tennguoigui: dataUpdate.tennguoigui, sdtnguoigui: dataUpdate.sdtnguoigui, diachinguoigui: dataUpdate.diachinguoigui
            });

            const foundKHTK = await KienHangTonKho.findOne({
                tenkienhang: (dataUpdate.tenkienhang).toLowerCase(),
                dongia: dataUpdate.dongia, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang
            });

            if (!foundPNK) {
                res.status(403).json({ message: "PNK is not in data" });
            }
            else {
                const tenkienhangUpdate = (tenkienhang !== '' && tenkienhang !== undefined) ? tenkienhang : foundPNK.tenkienhang;
                const soluongkienhangUpdate = (soluongkienhang !== '' && soluongkienhang !== undefined) ? soluongkienhang : foundPNK.soluongkienhang;
                const dongiaUpdate = (dongia !== '' && dongia !== undefined) ? dongia : foundPNK.dongia;
                const trangthaiUpdate = (trangthai !== '' && trangthai !== undefined) ? trangthai : foundPNK.trangthai;
                const loaikienhangUpdate = (loaikienhang !== '' && loaikienhang !== undefined) ? loaikienhang : foundPNK.loaikienhang;
                const khochuakienhangUpdate = (khochuakienhang !== '' && khochuakienhang !== undefined) ? khochuakienhang : foundPNK.khochuakienhang;
                const diachikhochuaUpdate = (diachikhochua !== '' && diachikhochua !== undefined) ? diachikhochua : foundPNK.diachikhochua;
                const diachinguoinhanUpdate = (diachinguoinhan !== '' && diachinguoinhan !== undefined) ? diachinguoinhan : foundPNK.diachinguoinhan;
                const tennguoiguiUpdate = (tennguoigui !== '' && tennguoigui !== undefined) ? tennguoigui : foundPNK.tennguoigui;
                const sdtnguoiguiUpdate = (sdtnguoigui !== '' && sdtnguoigui !== undefined) ? sdtnguoigui : foundPNK.sdtnguoigui;
                const diachinguoiguiUpdate = (diachinguoigui !== '' && diachinguoigui !== undefined) ? diachinguoigui : foundPNK.diachinguoigui;

                let dongiaChitietUpdate = dongiaUpdate;
                if (dongiaUpdate.includes(",")) {
                    dongiaChitietUpdate = (dongiaUpdate).split(",").join("");
                }

                PhieuNhapKhoChiTiet.findOneAndUpdate({ _id: foundPNK._id },
                    {
                        $set: {
                            tenkienhang: tenkienhangUpdate, soluongkienhang: soluongkienhangUpdate,
                            dongia: new Intl.NumberFormat().format(dongiaChitietUpdate), trangthai: trangthaiUpdate, loaikienhang: loaikienhangUpdate,
                            khochuakienhang: khochuakienhangUpdate, diachikhochua: diachikhochuaUpdate,
                            diachinguoinhan: diachinguoinhanUpdate, tennguoigui: tennguoiguiUpdate,
                            sdtnguoigui: sdtnguoiguiUpdate, diachinguoigui: diachinguoiguiUpdate
                        }
                    }, async function (err, docs) {
                        if (err) {
                            res.status(404).json({ message: "update PNK error" });
                        }
                        else {
                            //update tong tien
                            const foundPNKUpdate = await PhieuNhapKho.findOne({ malohang });
                            const dongiaDetail = (foundPNK.dongia).split(",").join("");
                            const dongiaUpdateFormat = (dongiaUpdate).split(",").join("");
                            const foundPNKUpdateFormat = (foundPNKUpdate.tongtien).split(",").join("");

                            const totalUpdate = parseFloat(foundPNKUpdateFormat, 10) - parseFloat(dongiaDetail, 10) * parseFloat(foundPNK.soluongkienhang, 10) + parseFloat(dongiaUpdateFormat, 10) * parseFloat(soluongkienhangUpdate, 10);
                            PhieuNhapKho.findOneAndUpdate({ _id: foundPNKUpdate._id },
                                {
                                    $set: {
                                        tongtien: new Intl.NumberFormat().format(totalUpdate)
                                    }
                                }, function (err, docs) {
                                    if (err) {
                                        res.status(404).json({ message: "update PNK error" });
                                    }
                                });

                            let qtyUpdateKHTK = 0;
                            //co update so luong

                            if (soluongkienhang !== '' && soluongkienhang !== undefined) {
                                qtyUpdateKHTK = parseFloat(soluongkienhang, 10) - parseFloat(foundPNK.soluongkienhang, 10);
                            }

                            const qty = parseFloat(foundKHTK.soluongkienhang, 10) + parseFloat(qtyUpdateKHTK, 10);
                            KienHangTonKho.findOneAndUpdate({ _id: foundKHTK._id },
                                {
                                    $set: {
                                        tenkienhang: tenkienhangUpdate,
                                        soluongkienhang: qty,
                                        dongia: new Intl.NumberFormat().format(dongiaChitietUpdate),
                                        loaikienhang: loaikienhangUpdate,
                                        khochuakienhang: khochuakienhangUpdate
                                    }
                                }, async function (err, docs) {
                                    if (err) {
                                        res.status(404).json({ message: "create PNK error" });
                                    }
                                });

                            res.status(200).json({ message: "update PNK success" });
                        }
                    });
            }

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "update PNK error" });
        }
    },

    deletePNK: async (req, res, next) => {
        try {
            const { dataUpdate } = req.body;
            const foundPNK = await PhieuNhapKhoChiTiet.findOne({
                malohang: dataUpdate.malohang, tenkienhang: dataUpdate.tenkienhang, soluongkienhang: dataUpdate.soluongkienhang,
                dongia: dataUpdate.dongia, trangthai: dataUpdate.trangthai, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang,
                diachinguoinhan: dataUpdate.diachinguoinhan, tennguoigui: dataUpdate.tennguoigui, sdtnguoigui: dataUpdate.sdtnguoigui, diachinguoigui: dataUpdate.diachinguoigui
            });

            const foundKHTK = await KienHangTonKho.findOne({
                tenkienhang: (dataUpdate.tenkienhang).toLowerCase(),
                dongia: dataUpdate.dongia, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang
            });

            if (!foundPNK) {
                res.status(403).json({ message: "PNK is not in data" });
            }
            else {
                PhieuNhapKhoChiTiet.findOneAndDelete({
                    malohang: dataUpdate.malohang, tenkienhang: dataUpdate.tenkienhang, soluongkienhang: dataUpdate.soluongkienhang,
                    dongia: dataUpdate.dongia, trangthai: dataUpdate.trangthai, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang,
                    diachinguoinhan: dataUpdate.diachinguoinhan, tennguoigui: dataUpdate.tennguoigui, sdtnguoigui: dataUpdate.sdtnguoigui, diachinguoigui: dataUpdate.diachinguoigui
                }, async function (err, docs) {
                    if (err) {
                        res.status(404).json({ message: "delete PNK error" });
                    }
                    else {
                        const malohangCheck = dataUpdate.malohang
                        const foundPNKChecked = await PhieuNhapKhoChiTiet.findOne({
                            malohang: malohangCheck
                        });

                        if(foundPNKChecked){
                            //update tong tien
                            const foundPNKUpdate = await PhieuNhapKho.findOne({ malohang: malohangCheck });
                            const dongiaDetail = (foundPNK.dongia).split(",").join("");
                            const foundPNKUpdateFormat = (foundPNKUpdate.tongtien).split(",").join("");
    
                            const totalUpdate = parseFloat(foundPNKUpdateFormat, 10) - parseFloat(dongiaDetail, 10)*parseFloat(foundPNK.soluongkienhang, 10);
                            PhieuNhapKho.findOneAndUpdate({ _id: foundPNKUpdate._id },
                                {
                                    $set: {
                                        tongtien: new Intl.NumberFormat().format(totalUpdate)
                                    }
                                }, function (err, docs) {
                                    if (err) {
                                        res.status(404).json({ message: "update PNK error" });
                                    }
                                });
                        }
                        else{
                            const foundPNKDelete = await PhieuNhapKho.findOne({
                                 malohang: malohangCheck
                            });
                            // console.log(foundPNKDelete)
                            const id = foundPNKDelete._id;
                            PhieuNhapKho.findByIdAndDelete(id, function (err, docs) {
                                if (err){
                                    console.log(err)
                                }
                                else{
                                    console.log("Deleted : ", docs);
                                }
                            });
                        }
                    

                        if (foundKHTK) {
                            if (parseFloat(foundKHTK.soluongkienhang, 10) > parseFloat(foundPNK.soluongkienhang, 10)) {
                                //update lai so luong
                                const qty = parseFloat(foundKHTK.soluongkienhang, 10) - parseFloat(foundPNK.soluongkienhang, 10);

                                KienHangTonKho.findOneAndUpdate({ _id: foundKHTK._id },
                                    {
                                        $set: {
                                            soluongkienhang: qty,
                                        }
                                    }, async function (err, docs) {
                                        if (err) {
                                            res.status(404).json({ message: "update PNK error" });
                                        }
                                    });

                            }
                            else{
                                KienHangTonKho.findOneAndDelete({
                                    tenkienhang: (dataUpdate.tenkienhang).toLowerCase(),
                                    dongia: dataUpdate.dongia, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang
                                }, async function (err, docs) {
                                    if (err) {
                                        res.status(404).json({ message: "update PNK error" });
                                    }
                                }); 
                            }
                        }
                        res.status(200).json({ message: "update PNK success" });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "delete PNK error" });
        }
    },

    getListKHTK: async (req, res, next) => {
        try {
            KienHangTonKho.find().then((khtk) => {
                res.json({
                    result: 'ok',
                    data: khtk,
                    length: khtk.length,
                    message: 'get KHTK successfully'
                })
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get KHTK error" });
        }
    },

    getDetailKHTKByID: async (req, res, next) => {
        const { id } = req.body;
        try {
            KienHangTonKho.find({ _id: id }).then((khtk) => {
                res.json({
                    result: 'ok',
                    data: khtk,
                    message: 'get KHTKDetail successfully'
                })
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "get KHTKDetail error" });
        }
    },
}