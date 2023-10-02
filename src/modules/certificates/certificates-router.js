const express = require('express');
const {
    saveCertificate,
    getSavedCertificates,
} = require('./certificates-controller');
const { userMiddleware, adminMiddleware } = require('../../middlewares/auth-middleware');


const router = express.Router();

router.post('/save-certificate', userMiddleware,saveCertificate);
router.get('/get-saved-certificates',adminMiddleware,getSavedCertificates);

module.exports = router;