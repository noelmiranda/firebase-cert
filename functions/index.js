const functions = require("firebase-functions");
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const { object } = require("firebase-functions/v1/storage");
admin.initializeApp();

const db = admin.firestore();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'L1 Firebase Certificate';

//////// AUTHENTICATION//////////

exports.welcomeUser = functions.auth.user().onCreate((user) => {
    const email = user.email; 
  return welcomeUser(email);
});

async function welcomeUser(email) {
    const mailOptions = {
      from: `${APP_NAME} <noreply@firebase.com>`,
      to: email,
    };
  
   
    mailOptions.subject = `Welcome to ${APP_NAME}!`;
    mailOptions.html = `<p>Hello <strong>${email || ''}!</strong>, Welcome to <b>${APP_NAME}</b>. I hope you will enjoy our service.</p>`;
    await mailTransport.sendMail(mailOptions);
    functions.logger.log('New welcome email sent to:', email);
    return null;
  }





exports.deleteUser = functions.auth.user().onDelete(async (user) => {
    const email = user.email;
    return deleteUser(email);
})


async function deleteUser(email) {
    const mailOptions = {
      from: `${APP_NAME} <noreply@firebase.com>`,
      to: email,
    };
  
    mailOptions.subject = `Bye!`;
    mailOptions.text = `Hey ${email || ''}!, We confirm that we have deleted your ${APP_NAME} account.`;
    await mailTransport.sendMail(mailOptions);
    functions.logger.log('Account deletion confirmation email sent to:', email);
    return null;
  }

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