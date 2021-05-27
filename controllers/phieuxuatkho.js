const PhieuXuatKho = require('../models/phieuxuatkho');
const PhieuNhapKho = require('../models/phieunhapkho');
const PhieuXuatKhoChiTiet = require('../models/phieuxuatkhochitiet');
const KienHangTonKho = require('../models/kienhangtonkho');

module.exports = {
    createPNK: async (req, res, next) => {
        try {
            const { data, lydoxuatkho, sotienthanhtoan, phuongthucthanhtoan, taixevanchuyen } = req.body;

            let today = new Date();
            let created = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();

            PhieuXuatKho.find().then(async (check) => {
                if (check.length === 0) {
                    const newPXK = PhieuXuatKho({
                        malohang: "1000", nguoitaolohang: data[0].nguoitaolohang, ngaytaolohang: created, lydoxuatkho,
                        sotienthanhtoan: new Intl.NumberFormat().format(sotienthanhtoan), phuongthucthanhtoan, taixevanchuyen
                    });
                    await newPXK
                        .save()
                        .then(async (doc) => {
                            data.forEach(async dataPXK => {
                                const newPXKDetail = PhieuXuatKhoChiTiet({
                                    malohang: "1000", nguoitaolohang: dataPXK.nguoitaolohang, tenkienhang: dataPXK.tenkienhang, soluongkienhang: dataPXK.soluongkienhang, trangthai: dataPXK.trangthai,
                                    loaikienhang: dataPXK.loaikienhang, khochuakienhang: dataPXK.khochuakienhang, diachikhochua: dataPXK.diachikhochua,
                                    tennguoinhan: dataPXK.tennguoinhan, sdtnguoinhan: dataPXK.sdtnguoinhan, diachinguoinhan: dataPXK.diachinguoinhan,
                                    tennguoigui: dataPXK.tennguoigui, sdtnguoigui: dataPXK.sdtnguoigui, diachinguoigui: dataPXK.diachinguoigui,
                                    dongia: dataPXK.dongia
                                });
                                await newPXKDetail.save();

                                const foundKHTK = await KienHangTonKho.findOne({
                                    tenkienhang: (dataPXK.tenkienhang).toLowerCase(),
                                    dongia: dataPXK.dongia, loaikienhang: dataPXK.loaikienhang,
                                    khochuakienhang: dataPXK.khochuakienhang
                                });

                                if (parseFloat(foundKHTK.soluongkienhang, 10) - parseFloat(dataPXK.soluongkienhang, 10) === 0) {
                                    //xoa
                                    KienHangTonKho.findOneAndDelete({
                                        tenkienhang: (dataPXK.tenkienhang).toLowerCase(),
                                        dongia: dataPXK.dongia, loaikienhang: dataPXK.loaikienhang,
                                        khochuakienhang: dataPXK.khochuakienhang
                                    }, async function (err, docs) {
                                        if (err) {
                                            res.status(404).json({ message: "delete KHTK error" });
                                        }
                                    });
                                }
                                else {
                                    const khtkQty = parseFloat(foundKHTK.soluongkienhang, 10) - parseFloat(dataPXK.soluongkienhang, 10);

                                    KienHangTonKho.findOneAndUpdate({ _id: foundKHTK._id },
                                        {
                                            $set: {
                                                soluongkienhang: khtkQty
                                            }
                                        }, async function (err, docs) {
                                            if (err) {
                                                res.status(404).json({ message: "create PXK error" });
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
                    PhieuXuatKho.find().sort({ malohang: -1 }).then(async (pxk) => {
                        const malohangCheck = (parseInt(pxk[0].malohang) + 1).toString();
                        const foundPXK = await PhieuXuatKho.findOne({ malohang: malohangCheck });
                        if (foundPXK) {
                            res.status(403).json({ message: "ID PNK is a already in use" });
                        }
                        else {
                            const newPXK = PhieuXuatKho({
                                malohang: malohangCheck, nguoitaolohang: data[0].nguoitaolohang,
                                ngaytaolohang: created, lydoxuatkho,
                                sotienthanhtoan: new Intl.NumberFormat().format(sotienthanhtoan), phuongthucthanhtoan, taixevanchuyen
                            });
                            await newPXK
                                .save()
                                .then(async (doc) => {
                                    data.forEach(async dataPXK => {
                                        const newPXKDetail = PhieuXuatKhoChiTiet({
                                            malohang: malohangCheck, nguoitaolohang: dataPXK.nguoitaolohang, tenkienhang: dataPXK.tenkienhang, soluongkienhang: dataPXK.soluongkienhang, trangthai: dataPXK.trangthai,
                                            loaikienhang: dataPXK.loaikienhang, khochuakienhang: dataPXK.khochuakienhang, diachikhochua: dataPXK.diachikhochua,
                                            tennguoinhan: dataPXK.tennguoinhan, sdtnguoinhan: dataPXK.sdtnguoinhan, diachinguoinhan: dataPXK.diachinguoinhan,
                                            tennguoigui: dataPXK.tennguoigui, sdtnguoigui: dataPXK.sdtnguoigui, diachinguoigui: dataPXK.diachinguoigui,
                                            dongia: dataPXK.dongia
                                        });
                                        await newPXKDetail.save();

                                        const foundKHTK = await KienHangTonKho.findOne({
                                            tenkienhang: (dataPXK.tenkienhang).toLowerCase(),
                                            dongia: dataPXK.dongia, loaikienhang: dataPXK.loaikienhang,
                                            khochuakienhang: dataPXK.khochuakienhang
                                        });

                                        if (parseFloat(foundKHTK.soluongkienhang, 10) - parseFloat(dataPXK.soluongkienhang, 10) === 0) {
                                            //xoa
                                            KienHangTonKho.findOneAndDelete({
                                                tenkienhang: (dataPXK.tenkienhang).toLowerCase(),
                                                dongia: dataPXK.dongia, loaikienhang: dataPXK.loaikienhang,
                                                khochuakienhang: dataPXK.khochuakienhang
                                            }, async function (err, docs) {
                                                if (err) {
                                                    res.status(404).json({ message: "delete KHTK error" });
                                                }
                                            });
                                        }
                                        else {
                                            const khtkQty = parseFloat(foundKHTK.soluongkienhang, 10) - parseFloat(dataPXK.soluongkienhang, 10);

                                            KienHangTonKho.findOneAndUpdate({ _id: foundKHTK._id },
                                                {
                                                    $set: {
                                                        soluongkienhang: khtkQty
                                                    }
                                                }, async function (err, docs) {
                                                    if (err) {
                                                        res.status(404).json({ message: "create PXK error" });
                                                    }
                                                });
                                        }
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
            if (nguoitaolohang === '') {
                PhieuXuatKho.find().then((pxk) => {
                    res.json({
                        result: 'ok',
                        data: pxk,
                        length: pxk.length,
                        message: 'get PNK successfully'
                    })
                })
            }
            else {
                PhieuXuatKho.find({ nguoitaolohang }).then((pxk) => {
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
            PhieuXuatKhoChiTiet.find({ malohang }).then((pxkchitiet) => {
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
            if (queryString === "nguoitaolohang") {
                PhieuXuatKho.find({ nguoitaolohang: dataQuery }).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if (queryString === "malohang") {
                PhieuXuatKho.find({ malohang: dataQuery }).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if (queryString === "ngaytaolohang") {

                PhieuXuatKho.find({ ngaytaolohang: { $gte: dataQuery.date_from, $lte: dataQuery.date_to } }).sort([['time', -1]]).then((pnkchitiet) => {
                    res.json({
                        result: 'ok',
                        data: pnkchitiet,
                        message: 'get PNK successfully'
                    })
                })
            }
            else if (queryString === "khochuakienhang") {
                let listMaLoHang = [];
                PhieuXuatKhoChiTiet.find({ khochuakienhang: dataQuery }).then((pnkchitiet) => {
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

                    const percentPNK = lengthPNK / total * 100;
                    const percentPXK = lengthPXK / total * 100;
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

    editPXK: async (req, res, next) => {
        try {
            const { malohang, tenkienhang, soluongkienhang, dongia,
                trangthai, loaikienhang, khochuakienhang, diachikhochua, diachinguoigui,
                tennguoinhan, sdtnguoinhan, diachinguoinhan, dataUpdate } = req.body;

            const foundPXK = await PhieuXuatKhoChiTiet.findOne({
                malohang: dataUpdate.malohang, tenkienhang: dataUpdate.tenkienhang, soluongkienhang: dataUpdate.soluongkienhang,
                dongia: dataUpdate.dongia, trangthai: dataUpdate.trangthai, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang,
                diachinguoigui: dataUpdate.diachinguoigui, tennguoinhan: dataUpdate.tennguoinhan, sdtnguoinhan: dataUpdate.sdtnguoinhan, diachinguoinhan: dataUpdate.diachinguoinhan
            });

            const foundKHTK = await KienHangTonKho.findOne({
                tenkienhang: (dataUpdate.tenkienhang).toLowerCase(),
                dongia: dataUpdate.dongia, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang
            });

            if (!foundPXK) {
                res.status(403).json({ message: "PXK is not in data" });
            }
            else {
                const tenkienhangUpdate = (tenkienhang !== '' && tenkienhang !== undefined) ? tenkienhang : foundPNK.tenkienhang;
                const soluongkienhangUpdate = (soluongkienhang !== '' && soluongkienhang !== undefined) ? soluongkienhang : foundPNK.soluongkienhang;
                const dongiaUpdate = (dongia !== '' && dongia !== undefined) ? dongia : foundPNK.dongia;
                const trangthaiUpdate = (trangthai !== '' && trangthai !== undefined) ? trangthai : foundPNK.trangthai;
                const loaikienhangUpdate = (loaikienhang !== '' && loaikienhang !== undefined) ? loaikienhang : foundPNK.loaikienhang;
                const khochuakienhangUpdate = (khochuakienhang !== '' && khochuakienhang !== undefined) ? khochuakienhang : foundPNK.khochuakienhang;
                const diachikhochuaUpdate = (diachikhochua !== '' && diachikhochua !== undefined) ? diachikhochua : foundPNK.diachikhochua;
                const diachinguoiguiUpdate = (diachinguoigui !== '' && diachinguoigui !== undefined) ? diachinguoigui : foundPNK.diachinguoigui;
                const tennguoinhanUpdate = (tennguoinhan !== '' && tennguoinhan !== undefined) ? tennguoinhan : foundPNK.tennguoinhan;
                const sdtnguoinhanUpdate = (sdtnguoinhan !== '' && sdtnguoinhan !== undefined) ? sdtnguoinhan : foundPNK.sdtnguoinhan;
                const diachinguoinhanUpdate = (diachinguoinhan !== '' && diachinguoinhan !== undefined) ? diachinguoinhan : foundPNK.diachinguoinhan;

                let dongiaChitietUpdate = dongiaUpdate;
                if (dongiaUpdate.includes(",")) {
                    dongiaChitietUpdate = (dongiaUpdate).split(",").join("");
                }

                PhieuXuatKhoChiTiet.findOneAndUpdate({ _id: foundPXK._id },
                    {
                        $set: {
                            tenkienhang: tenkienhangUpdate, soluongkienhang: soluongkienhangUpdate,
                            dongia: new Intl.NumberFormat().format(dongiaChitietUpdate), trangthai: trangthaiUpdate, loaikienhang: loaikienhangUpdate,
                            khochuakienhang: khochuakienhangUpdate, diachikhochua: diachikhochuaUpdate,
                            diachinguoigui: diachinguoiguiUpdate, tennguoinhan: tennguoinhanUpdate,
                            sdtnguoinhan: sdtnguoinhanUpdate, diachinguoinhan: diachinguoinhanUpdate
                        }
                    }, async function (err, docs) {
                        if (err) {
                            res.status(404).json({ message: "update PXK error" });
                        }
                        else {
                            //update tong tien
                            const foundPXKUpdate = await PhieuXuatKho.findOne({ malohang });
                            const dongiaDetail = (foundPXK.dongia).split(",").join("");
                            const dongiaUpdateFormat = (dongiaUpdate).split(",").join("");
                            const foundPXKUpdateFormat = (foundPXKUpdate.sotienthanhtoan).split(",").join("");

                            const totalUpdate = parseFloat(foundPXKUpdateFormat, 10) - parseFloat(dongiaDetail, 10) * parseFloat(foundPXK.soluongkienhang, 10) + parseFloat(dongiaUpdateFormat, 10) * parseFloat(soluongkienhangUpdate, 10);
                            PhieuXuatKho.findOneAndUpdate({ _id: foundPXKUpdate._id },
                                {
                                    $set: {
                                        sotienthanhtoan: new Intl.NumberFormat().format(totalUpdate)
                                    }
                                }, function (err, docs) {
                                    if (err) {
                                        res.status(404).json({ message: "update PNK error" });
                                    }
                                });

                            let qtyUpdateKHTK = 0;
                            //co update so luong

                            if (soluongkienhang !== '' && soluongkienhang !== undefined) {
                                qtyUpdateKHTK = parseFloat(foundPXK.soluongkienhang, 10) - parseFloat(soluongkienhang, 10);
                            }

                            const qty = parseFloat(foundKHTK.soluongkienhang, 10) + parseFloat(qtyUpdateKHTK, 10);
                            KienHangTonKho.findOneAndUpdate({ _id: foundKHTK._id },
                                {
                                    $set: {
                                        soluongkienhang: qty,
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
            res.status(400).json({ message: "update PXK error" });
        }
    },

    deletePXK: async (req, res, next) => {
        try {
            const { dataUpdate } = req.body;

            const foundPXK = await PhieuXuatKhoChiTiet.findOne({
                malohang: dataUpdate.malohang, tenkienhang: dataUpdate.tenkienhang, soluongkienhang: dataUpdate.soluongkienhang,
                dongia: dataUpdate.dongia, trangthai: dataUpdate.trangthai, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang,
                diachinguoigui: dataUpdate.diachinguoigui, tennguoinhan: dataUpdate.tennguoinhan, sdtnguoinhan: dataUpdate.sdtnguoinhan, diachinguoinhan: dataUpdate.diachinguoinhan
            });

            const foundKHTK = await KienHangTonKho.findOne({
                tenkienhang: (dataUpdate.tenkienhang).toLowerCase(),
                dongia: dataUpdate.dongia, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang
            });

            if (!foundPXK) {
                res.status(403).json({ message: "PXK is not in data" });
            }
            else {
                PhieuXuatKhoChiTiet.findOneAndDelete({
                    malohang: dataUpdate.malohang, tenkienhang: dataUpdate.tenkienhang, soluongkienhang: dataUpdate.soluongkienhang,
                    dongia: dataUpdate.dongia, trangthai: dataUpdate.trangthai, loaikienhang: dataUpdate.loaikienhang, khochuakienhang: dataUpdate.khochuakienhang,
                    diachinguoigui: dataUpdate.diachinguoigui, tennguoinhan: dataUpdate.tennguoinhan, sdtnguoinhan: dataUpdate.sdtnguoinhan, diachinguoinhan: dataUpdate.diachinguoinhan
                }, async function (err, docs) {
                    if (err) {
                        res.status(404).json({ message: "delete PXK error" });
                    }
                    else {
                        const malohangCheck = dataUpdate.malohang

                        const foundPXKChecked = await PhieuXuatKhoChiTiet.findOne({
                            malohang: malohangCheck
                        });
                        if (foundPXKChecked) {
                            //update tong tien
                            const foundPXKUpdate = await PhieuXuatKho.findOne({ malohang: malohangCheck });
                            const dongiaDetail = (foundPXK.dongia).split(",").join("");
                            const foundPXKUpdateFormat = (foundPXKUpdate.sotienthanhtoan).split(",").join("");

                            const totalUpdate = parseFloat(foundPXKUpdateFormat, 10) - parseFloat(dongiaDetail, 10) * parseFloat(foundPXK.soluongkienhang, 10);
                            PhieuXuatKho.findOneAndUpdate({ _id: foundPXKUpdate._id },
                                {
                                    $set: {
                                        sotienthanhtoan: new Intl.NumberFormat().format(totalUpdate)
                                    }
                                }, function (err, docs) {
                                    if (err) {
                                        res.status(404).json({ message: "update PXK error" });
                                    }
                                });
                        }
                        else {
                            const foundPXKDelete = await PhieuXuatKho.findOne({
                                malohang: malohangCheck
                            });
                            // console.log(foundPNKDelete)
                            const id = foundPXKDelete._id;
                            PhieuXuatKho.findByIdAndDelete(id, function (err, docs) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log("Deleted : ", docs);
                                }
                            });
                        }


                        if (foundKHTK) {
                            const qty = parseFloat(foundKHTK.soluongkienhang, 10) + parseFloat(foundPXK.soluongkienhang, 10);

                            KienHangTonKho.findOneAndUpdate({ _id: foundKHTK._id },
                                {
                                    $set: {
                                        soluongkienhang: qty,
                                    }
                                }, async function (err, docs) {
                                    if (err) {
                                        res.status(404).json({ message: "update PXK error" });
                                    }
                                });
                        }

                        res.status(200).json({ message: "update PXK success" });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "delete PXK error" });
        }
    },
}