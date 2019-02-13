const functions = require('firebase-functions');
const pako = require('pako');
const admin = require('firebase-admin');
admin.initializeApp();

const runtimeOpts = {
  memory: '128MB',
  timeoutSeconds: 20
}

class StatusException extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function returnErr(res, err) {
  console.error(err)
  if (err instanceof StatusException) {
    res.status(err.code).send(err.message)
  }
  else {
    res.status(500).send()
  }
  return
}

function returnOk(res, msg) {
  res.status(200).send(msg)
  return
}

exports.saveFirebin = functions
  .runWith(runtimeOpts)
  .https.onCall((body, context) => {

    let ip = context.rawRequest.headers['x-forwarded-for']

    return admin.firestore().collection('firebin').add({
      ip: ip,
      created: admin.firestore.FieldValue.serverTimestamp(),
      data: body.data,
      encode: body.encode,
      compress: body.compress
    })
    .then(doc => {
      return {binId: doc.id}
    })
  });
/*
exports.loadFirebin = functions
  .runWith(runtimeOpts)
  .https.onRequest((req, res) => {

    return admin.firestore().collection('firebin').doc(req.binId).get()
    .then(doc => {
      if (!doc.exists) {
        throw new StatusException(404, "firebin not found")
      }

      return returnOk(res, {
        data: doc.get('data'),
        compress: doc.get('compress')
        encode: doc.get('encode')
      })
    })
    .catch(err => {
      return returnErr(res, err)
    })
  }); */
