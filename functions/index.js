const functions = require("firebase-functions");
const nodemailer = require('nodemailer');
const mkdirp = require('mkdirp');
const admin = require('firebase-admin');
const { object } = require("firebase-functions/v1/storage");
admin.initializeApp();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

const db = admin.firestore();

//////// AUTHENTICATION//////////
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

const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;

const THUMB_PREFIX = 'thumb_';


exports.generateThumbnail = functions.storage.bucket("fir-cert.appspot.com").object().onFinalize(async (object) => {

  const filePath = object.name;
  const contentType = object.contentType; 
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  if (!contentType.startsWith('image/')) {
    return functions.logger.log('This is not an image.');
  }

  if (fileName.startsWith(THUMB_PREFIX)) {
    return functions.logger.log('Already a Thumbnail.');
  }

  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {
    contentType: contentType,
  };
  
  await mkdirp(tempLocalDir)
  await file.download({destination: tempLocalFile});
  functions.logger.log('The file has been downloaded to', tempLocalFile);
  await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  functions.logger.log('Thumbnail created at', tempLocalThumbFile);


  await bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
  functions.logger.log('Thumbnail uploaded to Storage at', thumbFilePath);

  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);

  const results = await Promise.all([
    thumbFile.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    }),
    file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    }),
  ]);
  functions.logger.log('Got Signed URLs.');
  const thumbResult = results[0];
  const originalResult = results[1];
  const thumbFileUrl = thumbResult[0];
  const fileUrl = originalResult[0];

  await admin.database().ref('images').push({path: fileUrl, thumbnail: thumbFileUrl});
  return functions.logger.log('Thumbnail URLs saved to database.');
});


exports.filedeleted = functions.storage.bucket("fir-cert.appspot.com").object().onDelete(async (object) => {
    functions.logger.info("onDelete event");
    functions.logger.info(object.bucket);
    functions.logger.info(object.name);
    functions.logger.info(object.contentType);
});



  