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

exports.editFirebin = functions
  .runWith(runtimeOpts)
  .https.onCall((body, context) => {

    let binId = body.binId
    let editId = body.editId


    return admin.firestore().collection('firebin-edit').doc(editId).get()
    .then(doc => {
      if (doc.get('binId') !== binId) {
        throw new StatusException(403, 'Access Denied')
      }
      let edits = doc.get('edits') || 0;
      edts += 1;

      return admin.firestore().collection('firebin-edit').doc(editId).set({
        edits: edits
      }, {merge: true})

    })
    .then(() => {

      return admin.firestore().collection('firebin').doc(binId).set({
        data: body.data,
        encode: body.encode,
        compress: body.compress,
        language: body.language
      }, {merge: true})
    })
    .then(() => {
      return {binId: binId, editId: editId}
    })
  });


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
      compress: body.compress,
      language: body.language
    })
    .then(doc => {
      binId = doc.id

      return admin.firestore().collection('firebin-edit').add({
        edits: 0,
        created: admin.firestore.FieldValue.serverTimestamp(),
        binId: binId
      })
    })
    .then(doc => {
      editId = doc.id
      return {binId: binId, editId: editId}
    })
  });

exports.saveFirebinExt = functions
  .runWith(runtimeOpts)
  .https.onRequest((req, res) => {

    let ip = req.headers['x-forwarded-for']
    console.log(req.headers)
    let data = req.body
    let encode = 'text'
    let compress = 'none'
    console.log(data)
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
      compress: compress,
      language: null
    })
    .then(doc => {
      binId = doc.id

      return admin.firestore().collection('firebin-edit').add({
        edits: 0,
        created: admin.firestore.FieldValue.serverTimestamp(),
        binId: binId
      })
    })
    .then(doc => {
      editId = doc.id
      return returnOk(res, {binId: binId, editId: editId})
    })
  });
