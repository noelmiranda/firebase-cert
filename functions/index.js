const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { object } = require("firebase-functions/v1/storage");
admin.initializeApp();

const db = admin.firestore();


//////// AUTHENTICATION//////////

exports.welcomeUser = functions.auth.user().onCreate((user) => {
    return new Promise((resolve, reject) => {
        console.log(`The user ${user.email} has been added`);
        resolve(true);
    })
})


exports.deleteUser = functions.auth.user().onDelete(async (user) => {
    return new Promise((resolve, reject) => {
        console.log(`The user ${user.email} has been deleted`);
        resolve(true);
    })
})

//////// FIRESTORE//////////

exports.creationWebsite = functions.firestore
    .document('websites/{id}')
    .onCreate((snap) => {
        const website = snap.data();

        db.collection('logs').add({
            action: 'Created',
            date: new Date().toISOString(),
            website: website,
        })
    })
exports.deletionWebsite = functions.firestore
    .document('websites/{id}')
    .onDelete((snap) => {
        const website = snap.data();

        db.collection('logs').add({
            action: 'Deleted',
            date: new Date().toISOString(),
            website: website,
        })
    })
exports.updateWebsite = functions.firestore
    .document('websites/{id}')
    .onUpdate((change) => {
        const previousWebsite = change.before.data();
        const updatedWebsite = change.after.data();

        db.collection('logs').add({
            action: 'Updated',
            date: new Date().toISOString(),
            previousWebsite,
            updatedWebsite
        })
    })

//////// STORAGE//////////
exports.fileAdded = functions.storage.bucket("fir-cert.appspot.com").object().onFinalize(async (object) => {
    functions.logger.info("onFinalize event");
    functions.logger.info(object.bucket);
    functions.logger.info(object.name);
    functions.logger.info(object.contentType);
});
exports.filedeleted = functions.storage.bucket("fir-cert.appspot.com").object().onDelete(async (object) => {
    functions.logger.info("onDelete event");
    functions.logger.info(object.bucket);
    functions.logger.info(object.name);
    functions.logger.info(object.contentType);
});