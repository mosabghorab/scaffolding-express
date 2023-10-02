const express = require('express');
const { getCertificateTemplate, saveCertificateTemplate} = require('./certificate-templates-controller');
const { userMiddleware, adminMiddleware, authIfExistMiddleware } = require('../../middlewares/auth-middleware');

const router = express.Router();

router.get('/', userMiddleware,getCertificateTemplate);
router.post('/', adminMiddleware,saveCertificateTemplate);

module.exports = router;