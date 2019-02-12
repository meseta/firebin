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
  .https.onCall((data, context) => {
    console.log(data)
    console.log(context.rawRequest.headers['x-forwarded-for'])
    return {}
  });
