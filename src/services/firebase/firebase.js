const admin = require('firebase-admin');
const serviceAccount = require('../../../firebase/service-account.json');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
