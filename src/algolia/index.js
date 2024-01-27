// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// // const {onRequest} = require("firebase-functions/v2/https");
// // const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });


// const functions = require("firebase-functions");
const algoliasearch = require("algoliasearch");

// const APP_ID = functions.config().algolia.app;
// const ADMIN_KEY = functions.config().algolia.key;

// const client = algoliasearch(APP_ID, ADMIN_KEY);
// const index = client.initIndex("Products");

// exports.addToIndex = functions.firestore.document(
//     "ProductSnapDetails/{ProductSnapDetailsID}")
//     .onCreate((snapshot) => {
//         const data = snapshot.data();
//         const objectID = snapshot.id;
//         return index.addObject({...data, objectID});
//     });
// exports.addToIndex = functions.firestore.document(
//     "ProductSnapDetails/{ProductSnapDetailsID}")
//     .onUpdate((change) => {
//         const newData = change.after.data();
//         const objectID = change.after.id;
//         return index.saveObject({...newData, objectID});
//     });
// exports.addToIndex = functions.firestore.document(
//     "ProductSnapDetails/{ProductSnapDetailsID}")
//     .onDelete((snapshot) => {
//         return index.deleteObject(snapshot.id);
//     });



const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const index = client.initIndex("Medicine");

export const addToIndex = (data, objectID) => {
    return index.saveObject({...data, objectID});
};
export const updateToIndex = (newData, objectID) => {
    return index.partialUpdateObject({...newData, objectID}, {createIfNotExists: true});
};
export const deleteFromIndex = (objectID) => {
    return index.deleteObject(objectID);
};
