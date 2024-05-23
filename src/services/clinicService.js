const db = require('../models');

const { Op, fn, col } = db.Sequelize;

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!data.name || !data.address
                || !data.imageBase64
                || !data.descriptionHTML
                || !data.descriptionMarkdown
                || !data.selectedProvince
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    provinceId: data.selectedProvince.value
                })

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                include: [
                    { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errMessage: 'ok',
                errCode: 0,
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getOustandingClinics = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limit) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                const totalRate = await db.Comment.findAll({
                    attributes: [
                        'clinicId',
                        [db.Sequelize.fn('AVG', db.Sequelize.col('rate')), 'avg_rate'],
                    ],
                    limit: +limit,
                    group: ['clinicId'],
                });

                const clinicIds = totalRate.map(item => item.clinicId);
                let dataByOustanding = [];
                if (clinicIds.length > 0) {
                    dataByOustanding = await db.Clinic.findAll({
                        include: [
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }
                        ],
                        where: { id: clinicIds },
                        raw: true,
                        nest: true
                    });
                }

                let data;

                if (clinicIds.length > 0) {
                    data = await db.Clinic.findAll({
                        include: [
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }
                        ],
                        where: { id: { [db.Sequelize.Op.notIn]: clinicIds } },
                        limit: +limit - clinicIds.length,
                        raw: true,
                        nest: true
                    });
                } else {
                    data = await db.Clinic.findAll({
                        include: [
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }
                        ],
                        limit: +limit,
                        raw: true,
                        nest: true
                    });
                }

                if (clinicIds.length > 0) {
                    data = [...dataByOustanding, ...data];
                }




                if (data && data.length > 0) {
                    data.map(item => {
                        item.image = new Buffer(item.image, 'base64').toString('binary');
                        return item;
                    })
                }


                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getSuggestClinics = (limit, region) => {
    return new Promise(async (resolve, reject) => {
        try {
            let totalDataByRegion = 0;

            let dataByRegion = await db.Clinic.findAll({
                limit: limit,
                include: [
                    {
                        model: db.Allcode,
                        as: 'provinceTypeData',
                        attributes: ['valueEn', 'valueVi'],
                        where: { valueEn: region },
                    }
                ],
                raw: true,
                nest: true
            });

            if (dataByRegion && dataByRegion.length > 0) {
                totalDataByRegion = dataByRegion.length
            }


            let data = await db.Clinic.findAll({
                limit: limit - totalDataByRegion,
                include: [
                    {
                        model: db.Allcode,
                        as: 'provinceTypeData',
                        attributes: ['valueEn', 'valueVi'],
                        where: { valueEn: { [db.Sequelize.Op.ne]: region } },
                    }
                ],
                raw: true,
                nest: true
            });

            data = [...dataByRegion, ...data];


            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }




            resolve({
                errMessage: 'ok',
                errCode: 0,
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllClinicByPageNumber = (limit, pageNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limit || !pageNumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let orderByType = ['updatedAt', 'DESC'];
                const offset = (pageNumber - 1) * limit;

                let fake = []

                fake = await db.Clinic.findAll({
                    attributes: ['id']
                })



                let data = await db.Clinic.findAll({
                    include: [
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    order: [['id', 'ASC']],
                    limit: +limit,
                    offset: offset,
                    raw: true,
                    nest: true
                });
                if (data && data.length > 0) {
                    data.map(item => {
                        item.image = new Buffer(item.image, 'base64').toString('binary');
                        return item;
                    })
                }
                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data,
                    maxDataNumber: fake.length
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['id', 'name', 'address', 'descriptionHTML', 'descriptionMarkdown', 'image']
                })

                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId']
                    })
                    data.doctorClinic = doctorClinic;
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                } else data = {}

                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e);

        }
    })
}

let EditClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.id
                || !data.name
                || !data.descriptionHTML
                || !data.descriptionMarkdown
                || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {

                let clinicInfor = await db.Clinic.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false
                })
                if (clinicInfor) {
                    clinicInfor.name = data.name;
                    clinicInfor.descriptionHTML = data.descriptionHTML;
                    clinicInfor.descriptionMarkdown = data.descriptionMarkdown;
                    clinicInfor.address = data.address;
                    if (data.imageBase64) {
                        clinicInfor.image = data.imageBase64;
                    }
                    await clinicInfor.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Ko luu dc'
                    })
                }
            }
        }
        catch (e) {
            reject(e)
        }
    })
}


let DeleteClinic = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: clinicId },
                raw: false
            })
            if (!clinic) {
                resolve({
                    errCode: 2,
                    message: `The clinic isn't exist!`
                })
            }

            else {
                await clinic.destroy();

                resolve({
                    errCode: 0,
                    message: "The clinic is deleted"
                })
            }
        } catch (e) {
            reject(e)
        }

    })
}

let getClinicByKeyWord = (keyWord) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                where: {
                    name: {
                        [db.Sequelize.Op.or]: [
                            {
                                [db.Sequelize.Op.iLike]: `%${keyWord}%` // không phân biệt chữ hoa thường
                            },
                            {
                                [db.Sequelize.Op.like]: `%${keyWord}%` // phân biệt chữ hoa thường
                            }
                        ]
                    }
                },
                include: [
                    { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }
                ],
                limit: 8,
                raw: true,
                nest: true
            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            } else {
                data = []
            }
            resolve({
                errMessage: 'ok',
                errCode: 0,
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    EditClinic: EditClinic,
    DeleteClinic: DeleteClinic,
    getAllClinicByPageNumber: getAllClinicByPageNumber,
    getSuggestClinics: getSuggestClinics,
    getOustandingClinics: getOustandingClinics,
    getClinicByKeyWord: getClinicByKeyWord
}