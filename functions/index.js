const functions = require('firebase-functions');
const pako = require('pako');
const admin = require('firebase-admin');
const firebase = require('firebase');
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

    let binId
    let editId
    return admin.firestore().collection('firebin').add({
      ip: ip,
      created: admin.firestore.FieldValue.serverTimestamp(),
      data: body.data,
      encode: body.encode,
      compress: body.compress
    })
    .then(doc => {
      binId = doc.id

      return {binId: binId}
    })
  });

exports.saveFirebinExt = functions
  .runWith(runtimeOpts)
  .https.onRequest((req, res) => {

    let ip = req.headers['x-forwarded-for']
    let data = req.body
    let encode = 'text'
    let compress = 'none'
    let input = Buffer.from(data, 'utf-8')
    let b64str

    try {
      let compress = pako.deflate(input)
      let blob = firebase.firestore.Blob.fromUint8Array(compress)
      b64str = blob.toBase64()
    } catch (err) {
      console.log(err)
      throw new StatusException(500, 'Server Error')
    }

    if (b64str.length < data.length) {
      data = b64str
      encode = 'base64'
      compress = 'zlib'
    }

    return admin.firestore().collection('firebin').add({
      ip: ip,
      created: admin.firestore.FieldValue.serverTimestamp(),
      data: data,
      encode: encode,
      compress: compress
    })
    .then(doc => {
      binId = doc.id
      return returnOk(res, {binId: binId})
    })
  });
