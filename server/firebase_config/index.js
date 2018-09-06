const Storage = require('@google-cloud/storage');
const firebase = require('firebase');
const firebase_admin = require("firebase-admin");
const chamber = require('../chamber');

const firebase_keyfile = "./firebase.json";
const firebase_ServiceAccount = require(firebase_keyfile);
const firebaseadmin_keyfile = "./firebase-admin.json";
const firebaseadmin_ServiceAccount = require(firebaseadmin_keyfile);

const firebaseConfig = firebase_ServiceAccount;
const firebaseApp = firebase.initializeApp(firebaseConfig);



firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(firebaseadmin_ServiceAccount),
  storageBucket: firebaseConfig.storageBucket,
  databaseURL: firebaseConfig.databaseURL,
});


const firebase_db         = firebase_admin.database();
const firebase_bucket     = firebase_admin.storage().bucket();
const firestore_fs        = firebase_admin.firestore();



function createPublicFileURL(filename) {
  return `https://storage.googleapis.com/${firebaseConfig.storageBucket}/${encodeURIComponent(filename)}`;
}

function upload_file(file, prev_ref = "") {
  return new Promise((resolve, reject) => {
    let unique_filename = chamber.uniqueValue();
    let filename = unique_filename + file.name;
    let image_path = __dirname + '/' + filename;

    file.mv(filename, function(error) {
      if (error) {
        return reject({error: true, message: "could not upload file..."});
      }
      else {
        return resolve({ filename, image_path });
      }
    });
  });
}

function upload_bucket(filename, prev_ref = "") {
  return new Promise((resolve, reject) => {
    var options = {
      public: true
    };
    if(prev_ref && /https:\/\/storage.googleapis.com\/.*\/.*/.test(prev_ref)) {
      // console.log("previous image exist; Deleting it...", prev_ref);
      // options.destination = firebase_bucket.file(prev_ref.split('/')[4]);
      try {
        firebase_bucket.file(prev_ref.split('/')[4]).delete();
        // console.log('storage file deleted successfully!');
      }
      catch(e) {
        // console.log('error deleting: ', e);
      }
    }
    firebase_bucket.upload(filename, options)
    .then((data) => {
      let link = createPublicFileURL(filename);
      return resolve({ link, prev_ref })
    })
    .catch((e) => {
      console.log("error", e);
      return reject({error: true, message: "Could Not Upload To Bucket..."})
    });
  });
}

function upload_chain(file, prev_ref = "") {
  return new Promise((resolve, reject) => {
    upload_file(file, prev_ref)
    .then(filedata => {
      upload_bucket(filedata.filename, prev_ref)
      .then(bucketdata => {
        return resolve(bucketdata);
      })
      .catch(error => { return reject(error); })
    })
    .catch(error => { return reject(error); })
  });
}


module.exports = {
  firebaseConfig,
  firebase_ServiceAccount,
  firebaseadmin_ServiceAccount,
  firebaseApp,
  firebase_admin,
  firebase_db,
  firestore_fs,
  firebase_bucket,
  createPublicFileURL,
  upload_file,
  upload_bucket,
  upload_chain
}
