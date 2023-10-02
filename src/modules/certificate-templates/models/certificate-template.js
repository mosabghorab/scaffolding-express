
const CertificateTemplates = (sequelize, DataTypes) => sequelize.define('certificate_templates', {
    image: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
},);

module.exports = CertificateTemplates;