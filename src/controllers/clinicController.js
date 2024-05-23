import clinicService from '../services/clinicService'

let createClinic = async (req, res) => {
    try {
        let infor = await clinicService.createClinic(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinic();
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let EditClinic = async (req, res) => {
    try {
        let infor = await clinicService.EditClinic(req.body);
        return res.status(200).json(
            infor
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let DeleteClinic = async (req, res) => {
    try {
        let infor = await clinicService.DeleteClinic(req.body.id);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllClinicByPageNumber = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinicByPageNumber(req.query.limit, req.query.pageNumber);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessnage: 'Error from the server'
        })
    }
}

let getSuggestClinics = async (req, res) => {
    try {
        let infor = await clinicService.getSuggestClinics(req.query.limit, req.query.region);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessnage: 'Error from the server'
        })
    }
}

let getOustandingClinics = async (req, res) => {
    try {
        let infor = await clinicService.getOustandingClinics(req.query.limit);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessnage: 'Error from the server'
        })
    }
}

let getClinicByKeyWord = async (req, res) => {
    try {
        let infor = await clinicService.getClinicByKeyWord(req.query.keyWord);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessnage: 'Error from the server'
        })
    }
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