const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const runtimeOpts = {
  memory: '128MB',
  timeoutSeconds: 20
}

exports.saveFirebin = functions
  .runWith(runtimeOpts)
  .https.onCall((data, context) => {

    let ip = context.rawRequest.headers['x-forwarded-for']
    console.log(ip)
    console.log(data)

    return admin.firestore().collection('firebin').add({
      ip: ip,
      created: admin.firestore.FieldValue.serverTimestamp(),
      data: data.data,
      compressed: false
    })
    .then(doc => {
      return {binId: doc.id}
    })
  });

exports.loadFirebin = functions
  .runWith(runtimeOpts)
  .https.onCall((data, context) => {

    return admin.firestore().collection('firebin').doc(data.binId).get()
    .then(doc => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found');
      }
      return { data: doc.get('data') }
    })
  });
