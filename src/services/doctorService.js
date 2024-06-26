const db = require('../models');
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';


const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;


let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        include: [
                            { model: db.Specialty, as: 'SpecialtyTypeData', attributes: ['name'] }
                        ]
                    }
                ],
                raw: true,
                nest: true
            })


            resolve({
                errCode: 0,
                data: users
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

let getAllDoctorVer2 = (limit, pageNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limit || !pageNumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            }
            else {
                let orderByType = ['updatedAt', 'DESC'];
                const offset = (pageNumber - 1) * limit;

                let fake = []

                fake = await db.User.findAll({
                    where: { roleId: 'R2' },
                    attributes: ['id']
                })

                let users = await db.User.findAll({
                    where: { roleId: 'R2' },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            include: [
                                { model: db.Specialty, as: 'SpecialtyTypeData', attributes: ['name'] }
                            ]
                        }
                    ],
                    order: [['id', 'ASC']],
                    limit: +limit,
                    offset: offset,
                    raw: true,
                    nest: true
                })

                if (users && users.length > 0) {
                    users.map(item => {
                        item.image = new Buffer(item.image, 'base64').toString('binary');
                        return item;
                    })
                }


                resolve({
                    errCode: 0,
                    data: users,
                    maxDataNumber: fake.length
                })
            }


        }
        catch (e) {
            reject(e)
        }
    })
}

let getOustandingDoctors = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalRate = await db.Comment.findAll({
                attributes: [
                    'doctorId',
                    [db.Sequelize.fn('AVG', db.Sequelize.col('rate')), 'avg_rate'],
                ],
                limit: +limit,
                group: ['doctorId'],
            });

            let doctorIds = [];
            doctorIds = totalRate.map(item => item.doctorId);
            let dataByOustanding = [];
            if (doctorIds.length > 0) {
                dataByOustanding = await db.User.findAll({
                    where: { roleId: 'R2', id: { [db.Sequelize.Op.in]: doctorIds } },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            include: [
                                { model: db.Specialty, as: 'SpecialtyTypeData', attributes: ['name'] }
                            ]
                        }
                    ],
                    order: [['id', 'ASC']],
                    limit: +limit - doctorIds.length,
                    raw: true,
                    nest: true
                })
            }



            let data;

            if (doctorIds.length > 0) {
                data = await db.User.findAll({
                    where: { roleId: 'R2', id: { [db.Sequelize.Op.notIn]: doctorIds } },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            include: [
                                { model: db.Specialty, as: 'SpecialtyTypeData', attributes: ['name'] }
                            ]
                        }
                    ],
                    order: [['id', 'ASC']],
                    limit: +limit - doctorIds.length,
                    raw: true,
                    nest: true
                })
            } else {
                data = await db.User.findAll({
                    where: { roleId: 'R2' },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            include: [
                                { model: db.Specialty, as: 'SpecialtyTypeData', attributes: ['name'] }
                            ]
                        }
                    ],
                    order: [['id', 'ASC']],
                    limit: +limit,
                    raw: true,
                    nest: true
                })
            }




            if (doctorIds.length > 0) {
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
        } catch (e) {
            reject(e);
        }
    })
}


let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            if (doctors && doctors.image) {
                doctors.image = new Buffer(doctors.image, 'base64').toString('binary');
            }

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {
                //upsert to Markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save();
                    }
                }

                //upsert to Doctor_infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })
                if (doctorInfor) {
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;
                    await doctorInfor.save();

                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password',]
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }

                            ]
                        }

                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                data.formatedDate = data.formatedDate.toString();
                let existing = await db.Schedule.findAll(
                    {
                        where: { doctorId: data.doctorId, date: data.formatedDate },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }
                );

                // let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                //     return a.timeType === b.timeType;
                // });

                // if (toCreate && toCreate.length > 0) {
                //     await db.Schedule.bulkCreate(toCreate);
                // }
                await db.Schedule.destroy({
                    where: {
                        doctorId: data.doctorId,
                        date: data.formatedDate
                    },
                });

                if (schedule && schedule.length > 0) {
                    await db.Schedule.bulkCreate(schedule);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                })

                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExraInforDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {}

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                                }
                            ],

                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        }
                    ],

                    order: [
                        ['timeType', 'ASC']
                    ],


                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


let getPatientByGmail = (patientGmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientGmail) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        roleId: 'R3',
                        email: patientGmail
                    },
                    raw: false,
                    nest: true
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType
                || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                //update
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save()
                }

                await emailService.sendAttachment(data)

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}


let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic',
        'addressClinic', 'note', 'specialtyId'
    ]

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break;
        }
    }

    return {
        isValid: isValid,
        element: element
    }
}

let submitCommentByEmail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.comment || !data.doctorId || !data.clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            } else {

                let userInfor = await db.User.findOne(
                    {
                        where: { email: data.email, roleId: 'R3' },
                        raw: true
                    }
                );

                if (userInfor && userInfor.id) {
                    let bookingInfor = await db.Booking.findAll({
                        where:
                        {
                            patientId: userInfor.id,
                            statusId: 'S3',
                            doctorId: data.doctorId,

                        },
                        raw: true
                    })

                    if (bookingInfor) {
                        await db.Comment.create({
                            patientId: userInfor.id,
                            doctorId: data.doctorId,
                            content: data.comment,
                            clinicId: data.clinicId,
                            specialtyId: data.specialtyId,
                            rate: data.rate
                        })

                        resolve({
                            errCode: 0,
                            errMessage: 'OK'
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Bạn chưa thăm khám với bác sĩ này hoặc nhập sai email!'
                        })
                    }

                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Bạn chưa thăm khám với bác sĩ này hoặc nhập sai email!'
                    })
                }

            }

        } catch (e) {
            reject(e)
        }
    })
}

let getCommentByDoctorId = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            } else {

                let data = await db.Comment.findAll({
                    where: { doctorId: doctorId },
                    raw: false,
                    include: [
                        { model: db.User, as: 'userData', }
                    ],
                    order: [
                        ['id', 'DESC'],
                    ],
                });

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getCommentByPageNumber = (limit, pageNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limit || !pageNumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            } else {
                // let orderByType = ['updatedAt', 'ASC'];

                const offset = (pageNumber - 1) * limit;

                let data = await db.Comment.findAll({
                    limit: +limit,
                    offset: offset,
                    order: [['updatedAt', 'DESC']],
                    raw: false,
                    include: [
                        { model: db.User, as: 'userData', }
                    ]
                });

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let DeleteComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let comment = await db.Comment.findOne({
                where: { id: data.commentId },
                raw: false
            })
            if (!comment) {
                resolve({
                    errCode: 2,
                    message: `The comment isn't exist!`
                })
            }

            else {
                await comment.destroy();

                resolve({
                    errCode: 0,
                    message: "The comment is deleted"
                })
            }
        } catch (e) {
            reject(e)
        }

    })
}

let postWarningPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {

                let user = await db.User.findOne({
                    where: { id: data.patientId },
                    raw: false
                });

                if (user) {
                    user.warning = user.warning + 1;
                    await user.save();
                }

                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'Fault';
                    await appointment.save()
                }

                resolve({
                    errCode: 0,
                    data: 'Success'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let CreateHistory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.patientId || !data.doctorId || !data.image) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            }
            // data.avatar = new Buffer(data.avatar, 'base64').toString('binary');
            await db.History.create({
                patientId: data.patientId,
                doctorId: data.doctorId,
                date: data.date,
                image: data.image,
            });

            resolve({
                errCode: 0,
                message: 'Oke'
            })
        }
        catch (expcept) {
            reject(expcept);
        }
    })
}


module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExraInforDoctorById: getExraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
    submitCommentByEmail: submitCommentByEmail,
    getCommentByDoctorId: getCommentByDoctorId,
    postWarningPatient: postWarningPatient,
    getPatientByGmail: getPatientByGmail,
    CreateHistory: CreateHistory,
    getAllDoctorVer2: getAllDoctorVer2,
    getCommentByPageNumber: getCommentByPageNumber,
    DeleteComment: DeleteComment,
    getOustandingDoctors: getOustandingDoctors
}