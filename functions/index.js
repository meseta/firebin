const cors = require('cors')({origin: true});
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();
admin.firestore().settings({
  timestampsInSnapshots: true
})

const runtimeOpts = {
  memory: '128MB',
  timeoutSeconds: 20
}

exports.saveText = functions
  .runWith(runtimeOpts)
  .https.onCall((req, res) => {
    console.log(req.headers)
    let encoding = req.body
    console.log("got: " + encoding)
    res.status(200)
  });
