import handbookService from "../services/handbookService";
import HandbookService from "../services/handbookService";

let createHandbook = async (req, res) => {
    try {
        let infor = await HandbookService.createHandbook(req.body);
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

let getAllHandbook = async (req, res) => {
    try {
        let infor = await handbookService.getAllHandbook();
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

let getDetailHandbookById = async (req, res) => {
    try {
        let infor = await handbookService.getDetailHandbookById(req.query.id, req.query.location);
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

let getAllHandbookVer2 = async (req, res) => {
    try {
        let infor = await handbookService.getAllHandbookVer2(req.query.limit, req.query.pageNumber);
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

let EditHandbook = async (req, res) => {
    try {
        let infor = await HandbookService.EditHandbook(req.body);
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

let DeleteHandbook = async (req, res) => {
    try {
        let infor = await HandbookService.DeleteHandbook(req.body);
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






module.exports = {
    createHandbook: createHandbook,
    getAllHandbook: getAllHandbook,
    getDetailHandbookById: getDetailHandbookById,
    getAllHandbookVer2: getAllHandbookVer2,
    EditHandbook: EditHandbook,
    DeleteHandbook: DeleteHandbook
}