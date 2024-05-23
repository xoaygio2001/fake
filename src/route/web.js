import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/spcialtyController";
import clinicController from "../controllers/clinicController";
import handbookController from "../controllers/handbookController";

let router = express.Router();

let initWebRoutes = (app) => {

    router.get('/', homeController.getHomePage);
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/get-user-by-page-number', userController.getUserByPageNumber);


    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctors', doctorController.postInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);
    router.get('/api/get-all-doctor-ver2', doctorController.getAllDoctorVer2);
    router.get('/api/get-outstanding-doctors', doctorController.getOustandingDoctors);




    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    router.get('/api/get-outstanding-specialty', specialtyController.getOutstandingSpecialty);


    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-clinic', clinicController.getAllClinic);
    router.get('/api/get-suggest-clinic-by-region', clinicController.getSuggestClinics);
    router.get('/api/get-outstanding-clinic', clinicController.getOustandingClinics);
    router.get('/api/get-clinic-by-key-word', clinicController.getClinicByKeyWord);



    router.get('/api/get-clinic-by-pagenumber', clinicController.getAllClinicByPageNumber);


    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    router.post('/api/submit-comment-by-email', doctorController.submitCommentByEmail);


    router.get('/api/get-comment-by-doctorId', doctorController.getCommentByDoctorId);
    router.get('/api/get-comment-by-pagenumber', doctorController.getCommentByPageNumber);
    router.post('/api/delete-comment', doctorController.DeleteComment);


    router.post('/api/post-warning-patient', doctorController.postWarningPatient);

    router.get('/api/get-patient-by-gmail', doctorController.getPatientByGmail);

    router.post('/api/post-Delete-Schedule', patientController.postDeleteSchedule);

    router.post('/api/edit-specialty', specialtyController.EditSpecialty);

    router.delete('/api/delete-specialty', specialtyController.DeleteSpecialty);

    router.post('/api/edit-clinic', clinicController.EditClinic);

    router.delete('/api/delete-clinic', clinicController.DeleteClinic);

    router.post('/api/crate-new-history', doctorController.CreateHistory);

    router.get('/api/get-patient-data-by-id', patientController.getDataPatient);

    router.post('/api/create-new-handbook', handbookController.createHandbook);

    router.get('/api/get-handbook', handbookController.getAllHandbook);

    router.get('/api/get-detail-handbook-by-id', handbookController.getDetailHandbookById);

    router.get('/api/get-all-handbook-ver2', handbookController.getAllHandbookVer2);

    router.post('/api/edit-handbook', handbookController.EditHandbook);
    router.post('/api/delete-handbook', handbookController.DeleteHandbook);











    return app.use("/", router);
};

module.exports = initWebRoutes;