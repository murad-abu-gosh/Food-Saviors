import { collection, setDoc, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, increment, query, orderBy, where } from "firebase/firestore"
import { ref, getDownloadURL, uploadBytesResumable, uploadBytes, getStorage, deleteObject } from "firebase/storage";
import { db, auth, storage } from "./firebase";
import { async } from "@firebase/util";
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState } from "react";
/**
 * Adds a new item entry to database and returns document ID
 * @param itemName
 * @param itemImgUri
 * @param itemAvgWeight
 * @param itemCurrentAmount
 */
export async function addNewItem(itemName, itemImgUri, itemAvgWeight, itemCurrentAmount) {
  const imageRef = await uploadImageAsync(itemImgUri);
  const docRef = await addDoc(collection(db, 'items'), {
    name: itemName,
    image: imageRef.URL,
    imageName: imageRef.name,
    average_weight: itemAvgWeight,
    current_amount: itemCurrentAmount
  })
    .catch(alert);

  return docRef.id;

}



export async function deleteItem(documentID) {
  let docRef = doc(db, "items", documentID);
  const docSnap = await getDoc(docRef);
  let itemImgName = docSnap.data()["imageName"];
  deleteFileFromStorage(itemImgName);
  deleteDoc(doc(db, "items", documentID));

}

/**
 * Updates item. If image to be updated, imageURI must be provided. Otherwise, put imageURI=null
 * @param {*} collectionName 
 * @param {*} itemID 
 * @param {*} imageURI imageURI or null
 * @param {*} updated_fields 
 */
export async function updateItem(collectionName, itemID, imageURI, updated_fields) {
  const itemRef = doc(db, collectionName, itemID);
  if (!imageURI){ // no new image
  updateDoc(itemRef, updated_fields).catch(alert);
  return;
  }
  const docSnap = await getDoc(itemRef);
  deleteFileFromStorage(docSnap.data()["imageName"]); //delete old image
  const imageRef = await uploadImageAsync(imageURI);
  updated_fields.image = imageRef.URL;
  updated_fields.imageName = imageRef.name;

  updateDoc(itemRef, updated_fields).catch(alert);
  
}

/**
 * Updates items current amount that are in the recordMap to the database.
 * @param {*} recordMap Object in the form of (itemID : addAmount). For example:
 * {"gHGHN34d2" : 12 , "bfSYHIKJ83" : -20 , ....}
 */
 async function updateItemsAmountsFromRecord(recordMap) {
  let itemsCollection = await getDocs(collection(db, 'items'));
  // console.log(recordMap);
  let oldAmount = 0;
  let value = 0;
  for (let itemID in recordMap) {
    value = recordMap[itemID];
    for (let itemDoc of itemsCollection.docs) {
      console.log(`checking if ${itemID} == ${itemDoc}`);
      if (itemID === itemDoc.id) {
        console.log(`adding ${value} to ${itemDoc.data()['name']} ...`);
        oldAmount = itemDoc.data()["current_amount"];
        updateDocumentById("items", itemID, { "current_amount": increment(value) });
        console.log(`Added!`);
      }
    }
  }
}


 /**
  * Fetches all items data from the database, sorted by field 'name'. Attaches document ID to JSON
  * @returns JSON array of items.
  */
export async function fetchItemsSorted(){
  const qry = query(collection(db, 'items'), orderBy('name'));

  let Mycollection = await getDocs(qry);
  let arr = [];
  Mycollection.forEach(element => {
    let elementWithID = element.data();
    elementWithID["id"] = element.id //add ID to JSON
    arr.push(elementWithID);
  });

  return arr;
}

function checkForId(item, itemName) {

  if (item.data()["name"] == itemName) {
    updateDocumentById("items", item.id, { "id": item.id });
  }
}

export async function getIdByName(collectionName, itemName) {
  let itemsRef = await getDocs(collection(db, collectionName));
  for (const item in itemsRef) {
    if (item.data()["name"] == itemName) return item.id;
  }
}

//=================================================================================================


/**
 * @param itemID String value of the item's ID
 * @param {*} updated_fields object containing fields and values eg.: {field1 : 1, field2 : "test", field3 : true}
 */
export async function updateDocumentById(collectionName, itemID, updated_fields) {
  const itemRef = doc(db, collectionName, itemID);

  // Updates the fields of the item
  await updateDoc(itemRef, updated_fields).catch(alert);
}

/**
 * Fetch all documents in a collection and returns them as array
 * @param collectionName String value of collection name
 * @returns array containing all documents
 */
async function fetchAllDocuments(collectionName) { // "items" "users" "dropAreas"
  let Mycollection = await getDocs(collection(db, collectionName));
  let arr = [];
  Mycollection.forEach(element => {
    let elementWithID = element.data();
    elementWithID["id"] = element.id //add ID to JSON
    arr.push(elementWithID);
  });

  return arr;
}

export async function fetchDocumentById(collectionName, itemID) {
  const docRef = doc(db, collectionName, itemID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    docSnap.data()["id"] = docSnap.id;
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

/**
 * Adds new Drop Area entry to database. Returns the document's ID
 * @param String areaName 
 * @param String areaAddress 
 * @returns 
 */
export async function addNewDropArea(areaName, areaAddress) {
  // const areasRef = collection(db, 'dropAreas');

  const docRef = await addDoc(collection(db, 'dropAreas'), {
    name: areaName,
    address: areaAddress
  }).catch(alert);

  return docRef.id;

  // updateDocumentById("dropAreas", docRef.id, { "id": docRef.id });
}

/**
 *
 * @param recordID
 * @param recordDate
 * @param recordMap
 */
export async function addNewImportRecord(recordUserID, recordDate, recordMap) {
  // const recordsRef = collection(db, 'importGoodsRecord');

  const docRef = await addDoc(collection(db, 'importGoodsRecords'), {
    userID: recordUserID,
    date: recordDate,
    itemsToAmounts: recordMap // <itemReference : int>
  }).catch(alert);
  // updateDocumentById("importGoodsRecord", docRef.id, { "id": docRef.id });

  updateItemsAmountsFromRecord(recordMap);
  return docRef.id;

}



/**
 * 
 * @param {*} userName 
 * @param {*} userEmail 
 * @param {*} userPhoneNumber 
 * @param {*} userDateCreated 
 * @param {*} userRank 
 */
 export async function createNewUser(userEmail, password, displayName, userPersonalID, phoneNumber, userPhotoURL, userRank) {
  let originalUser = auth.currentUser;
  let userID = null;

  console.log("Hiiiiiiii");
  await createUserWithEmailAndPassword(auth, userEmail, password).then((userCredential) => {
          userID =  userCredential.user.uid;
          // ...
          console.log("Hello world");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.log("Kill THem all");
    });
  console.log("new user created: " + userID);
  await updateCurrentUser(auth, originalUser);
  // userID = auth.currentUser.uid;
  console.log("current user: " + auth.currentUser.uid);


  const docRefID = await addNewUser(userID, userEmail, displayName, userPersonalID, phoneNumber, userPhotoURL, userRank);
  return docRefID;

}



async function addNewUser(userID, userEmail, displayName, userPersonalID, userPhoneNumber, userPhotoURL, userBirthDate, userRank) {
  // let usersRef = collection(db, 'users');

  await setDoc(doc(db, "users", userID), {
    name: displayName,
    email: userEmail,
    personalID: userPersonalID,
    image: userPhotoURL,
    phoneNumber: userPhoneNumber,
    birthDate: userBirthDate,
    rank: userRank,
    isActive: true
  }).catch(alert);

  return userID;
}
/**
 * Fetches users data sorted by name in an array. Attaches userID as a field.
 * if onlyActive=true , fetches only active users. else, fetches all users.
 * @param {*} onlyActive Boolean value
 * @returns array of JSON users data.
 */
export async function fetchUsersSorted(onlyActive) {
  let qry = null;
  if (onlyActive){
    qry = query(collection(db, 'users'), where("isActive", "==", true),  orderBy('name'));
  }
  else {
    qry = query(collection(db, 'users'), orderBy('name'));
  }
  let Mycollection = await getDocs(qry);
  let arr = [];

  Mycollection.forEach(element => {
    let elementWithID = element.data();
    elementWithID["id"] = element.id //add ID to JSON
    arr.push(elementWithID);
  });

  return arr;
}

/**
 * Function does not delete user from records (as it is needed for other info). Instead, sets "isActive" to false.
 * @param {*} userID user ID to be deleted
 */
export function deleteUser(userID) {
  const userRef = doc(db, "users", userID);

  updateDoc(userRef, { isActive: false }).catch(alert);
  if (userID === auth.currentUser.uid) {
    console.log("signing out current user...");
    signOut();
  }

}

export async function addNewFeedback(feedbackUserID, feedbackTitle, feedbackDate, feedbackContent) {
  const docRef = await addDoc(collection(db, 'feedbacks'), {
    userID: feedbackUserID,
    title: feedbackTitle,
    date: feedbackDate,
    content: feedbackContent
  }).catch(alert);
  // updateDocumentById("feedbacks", docRef.id, { "id": docRef.id });

  return docRef.id;
}

export async function addNewGoodWaste(wasteItemID, wasteAmount) {
  // const itemsRef = collection(db, 'goodsWastes');

  const docRef = await addDoc(collection(db, 'goodsWastes'), {
    itemID: wasteItemID,
    amount: wasteAmount
  }).catch(alert);
  // updateDocumentById("goodsWastes", docRef.id, { "id": docRef.id });
  return docRef.id;

}

export async function addNewExportRecord(exportUserID, exportDropAreaID, exportDate, itemToAmountMap) {
  // const itemsRef = collection(db, 'exportGoodsRecords');

  const docRef = await addDoc(collection(db, 'exportGoodsRecords'), {
    userID: exportUserID,
    dropAreaID: exportDropAreaID,
    date: exportDate,
    itemToAmount: itemToAmountMap
  }).catch(alert);

  // updateDocumentById("exportGoodsRecords", docRef.id, { "id": docRef.id });
  return docRef.id;

}

export async function addNewWasteRecord(wasteDate, itemToAmountMap) {
  // const itemsRef = collection(db, 'goodsWasteRecords');

  const docRef = await addDoc(collection(db, 'goodsWasteRecords'), {
    date: wasteDate,
    itemToAmount: itemToAmountMap
  }).catch(alert);

  // updateDocumentById("goodsWasteRecords", docRef.id, { "id": docRef.id });
  return docRef.id;


}

export async function deleteDocumentById(collectionName, documentID) {
  await deleteDoc(doc(db, collectionName, documentID));
}



function generateName() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

/**
 * Uploads image to Firebase Storage. Returns image name and its download URL. (name is generated randomly)
 * @param {} uri URI of the image to upload
 * @returns JOSN object of format: {name : <image/file name> , URL : <image/file download URL>}
 */
export async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  let imgName = generateName();
  const fileRef = ref(storage, imgName);
  const result = await uploadBytes(fileRef, blob);
  // We're done with the blob, close and release it
  blob.close();
  let imgURL = await getDownloadURL(fileRef);
  console.log("Image URL: " + imgURL);
  return { name: imgName, URL : imgURL };

}

function deleteFileFromStorage(fileName) {
  let fileRef = ref(storage, '/' + fileName);
  deleteObject(fileRef)
    .then(() => {
      console.log(`${fileName}has been deleted successfully.`);
    })
    .catch((e) => console.log('error on file deletion => ', e));

}

/**
 * 
 * @returns Fetches current user's data from the database. Return object of format:
 * {name : <user's name> , email : <user's e-mail> , image : <user's image> }
 */
export async function fetchCurrentUserInfo() {
  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  let userName = docSnap.data()["name"];
  let userEmail = docSnap.data()["email"];
  let userImage = docSnap.data()["image"];

  return { "name": userName, "email": userEmail, "image" : userImage };
}