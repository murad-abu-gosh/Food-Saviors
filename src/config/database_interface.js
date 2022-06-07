import { collection, setDoc, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, increment, query, orderBy, where, Timestamp } from "firebase/firestore"
import { ref, getDownloadURL, uploadBytesResumable, uploadBytes, getStorage, deleteObject } from "firebase/storage";
import { db, auth, storage } from "./firebase";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { async } from "@firebase/util";
import { createUserWithEmailAndPassword, signOut, updateCurrentUser } from 'firebase/auth';
import { useState } from "react";
import { Alert } from "react-native";
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

function timestampToDate(timestamp) {
  return timestamp.toDate();
}



export async function deleteItem(documentID) {
  let docRef = doc(db, "items", documentID);
  const docSnap = await getDoc(docRef);
  let itemImgName = docSnap.data()["imageName"];
  deleteFileFromStorage(itemImgName);
  deleteDoc(doc(db, "items", documentID));

}

/**
 * Updates item info.
 * @param {*} itemID 
 * @param {*} updated_fields 
 */
export async function updateItem(itemID, updated_fields) {
  const itemRef = doc(db, 'items', itemID);
  const docSnap = await getDoc(itemRef);
  if (updated_fields.image === docSnap.data()['image']) { // no new image
    updateDoc(itemRef, updated_fields).catch(alert);
    return;
  }

  if (docSnap.data()["imageName"] !== null) {
    deleteFileFromStorage(docSnap.data()["imageName"]); //delete old image
  }

  const imageRef = await uploadImageAsync(updated_fields.image);
  updated_fields.image = imageRef.URL;
  updated_fields.imageName = imageRef.name;

  updateDoc(itemRef, updated_fields).catch(alert);

}

/**
 * Updates items current amount that are in the recordMap to the database.
 * @param {*} recordMap Object in the form of (itemID : addAmount). For example:
 * {"gHGHN34d2" : 12 , "bfSYHIKJ83" : -20 , ....}
 * @param {*} recordMode 1 for incrementing. else, decrement
 */
async function updateItemsAmountsFromRecord(recordMap, recordMode) {
  let coeff = 1;
  if (recordMode !== 1) { //export mode
    coeff = -1;
  }
  let itemsCollection = await getDocs(collection(db, 'items'));
  // console.log(recordMap);
  let oldAmount = 0;
  let value = 0;
  for (let itemID in recordMap) {
    value = recordMap[itemID] * coeff;
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
export async function fetchItemsSorted() {
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
  await updateDoc(itemRef, updated_fields).catch((error) => {

    console.log("UpdateDoc error: ", error);
  });
}

/**
 * Fetch all documents in a collection and returns them as array
 * @param collectionName String value of collection name
 * @returns array containing all documents
 */
export async function fetchAllDocuments(collectionName) { // "items" "users" "dropAreas"
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
    let elementWithID = docSnap.data();
    elementWithID["id"] = docSnap.id;
    return elementWithID;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

/**
 * Adds new Drop Area entry to database. Returns the document's ID
 * @returns 
 */

/**
 * Adds new Drop Area entry to database. Returns the document's ID
 * @returns drop area ID
 */
export async function addNewDropArea(areaName, areaHoodName, areaAddress, isMainStorageValue = false) {
  // const areasRef = collection(db, 'dropAreas');

  const docRef = await addDoc(collection(db, 'dropAreas'), {
    name: areaName,
    address: areaAddress,
    hoodName: areaHoodName,
    isMainStorage: isMainStorageValue
  }).catch(alert);

  return docRef.id;

  // updateDocumentById("dropAreas", docRef.id, { "id": docRef.id });
}

export async function fetchDropAreasSorted(params) {
  const qry = query(collection(db, 'dropAreas'), orderBy('name'));

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
 *
 * @param recordID
 * @param recordDate
 * @param recordMap
 */
export async function addNewImportRecord(recordUserID, recordDate, recordArray) {
  let recordMap = convertJsonArrayToMap(recordArray);
  // const recordsRef = collection(db, 'importGoodsRecord');

  const docRef = await addDoc(collection(db, 'importGoodsRecords'), {
    userID: recordUserID,
    date: recordDate,
    itemsToAmounts: recordMap // <itemReference : int>
  }).catch(alert);
  // updateDocumentById("importGoodsRecord", docRef.id, { "id": docRef.id });

  console.log("Added new import record: ", recordMap);

  await updateItemsAmountsFromRecord(recordMap, 1);
  return docRef.id;

}
function getQueryFromDates(fromDate, toDate, collectionName) {
<<<<<<< HEAD
  if (!fromDate && !toDate){
    return query(collection(db, collectionName), orderBy('date', "desc"));
  }
  if (fromDate && toDate){
    return query(collection(db, collectionName),where('date','>=', Timestamp.fromDate(fromDate)), 
    where('date','<=', Timestamp.fromDate(toDate)), orderBy('date', "desc"));
  }
  if (fromDate && !toDate){
    return query(collection(db, collectionName),where('date','>=', Timestamp.fromDate(fromDate)), orderBy('date', "desc"));
  }
  if (!fromDate && toDate){
    return query(collection(db, collectionName), 
    where('date','<=', Timestamp.fromDate(toDate)), orderBy('date', "desc"));
=======
  if (!fromDate && !toDate) {
    return query(collection(db, collectionName), orderBy('date', "desc"));
  }
  if (fromDate && toDate) {
    return query(collection(db, collectionName), where('date', '>=', Timestamp.fromDate(fromDate)),
      where('date', '<=', Timestamp.fromDate(toDate)), orderBy('date', "desc"));
  }
  if (fromDate && !toDate) {
    return query(collection(db, collectionName), where('date', '>=', Timestamp.fromDate(fromDate)), orderBy('date', "desc"));
  }
  if (!fromDate && toDate) {
    return query(collection(db, collectionName),
      where('date', '<=', Timestamp.fromDate(toDate)), orderBy('date', "desc"));
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
  }
}

function getQueryFromDatesAndArea(fromDate, toDate, areaID, collectionName) {
<<<<<<< HEAD
  if (!fromDate && !toDate){
    return query(collection(db, collectionName), where('dropAreaID', '==', areaID), orderBy('date', "desc"));
  }
  if (fromDate && toDate){
    return query(collection(db, collectionName), where('dropAreaID', '==', areaID), where('date','>=', Timestamp.fromDate(fromDate)), 
    where('date','<=', Timestamp.fromDate(toDate)), orderBy('date', "desc"));
  }
  if (fromDate && !toDate){
    return query(collection(db, collectionName), where('dropAreaID', '==', areaID), where('date','>=', Timestamp.fromDate(fromDate)), orderBy('date', "desc"));
  }
  if (!fromDate && toDate){
    return query(collection(db, collectionName), where('dropAreaID', '==', areaID), 
    where('date','<=', Timestamp.fromDate(toDate)), orderBy('date', "desc"));
=======
  if (!fromDate && !toDate) {
    return query(collection(db, collectionName), where('dropAreaID', '==', areaID), orderBy('date', "desc"));
  }
  if (fromDate && toDate) {
    return query(collection(db, collectionName), where('dropAreaID', '==', areaID), where('date', '>=', Timestamp.fromDate(fromDate)),
      where('date', '<=', Timestamp.fromDate(toDate)), orderBy('date', "desc"));
  }
  if (fromDate && !toDate) {
    return query(collection(db, collectionName), where('dropAreaID', '==', areaID), where('date', '>=', Timestamp.fromDate(fromDate)), orderBy('date', "desc"));
  }
  if (!fromDate && toDate) {
    return query(collection(db, collectionName), where('dropAreaID', '==', areaID),
      where('date', '<=', Timestamp.fromDate(toDate)), orderBy('date', "desc"));
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
  }
}


export async function fetchImportRecordsSorted(fromDate = null, toDate = null) {
  let qry = getQueryFromDates(fromDate, toDate, 'importGoodsRecords');

  let Mycollection = await getDocs(qry);
  let arr = [];
  Mycollection.forEach(element => {
    let elementWithID = element.data();
    elementWithID["id"] = element.id //add ID to JSON
    //convert Timestamp to Date:
    // element.data().date = timestampToDate(element.data().date);
    arr.push(elementWithID);
  });

  return arr;

}

function convertJsonArrayToMap(jsonArray) {
  let recordsMap = {};
  let currObj = {}
  jsonArray.forEach((obj) => {
    recordsMap[obj.id] = obj.amount;
  });
  return recordsMap;
}

//=============================================================================================


// export async function getUserByEmail(userEmail) {
//   let qry = null;
//   qry = query(collection(db, 'users'), where('email','==', userEmail));
//   let Mycollection = await getDocs(qry);

//   let currentUser;

//   Mycollection.forEach(element => {

//     currentUser = element.data();
//   });

//   return currentUser;
// }

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
  let newUserID = null;
  await createUserWithEmailAndPassword(auth, userEmail, password).then((userCredential) => {
    newUserID = userCredential.user.uid;
    // ...
    console.log("Hello world");
  })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  console.log("new user created: " + newUserID);
  await updateCurrentUser(auth, originalUser);
  console.log("current user: " + auth.currentUser.uid);


  const docRefID = await addNewUser(newUserID, userEmail, displayName, userPersonalID, phoneNumber, userPhotoURL, userRank);
  return docRefID;
}


async function addNewUser(userID, userEmail, displayName, userPersonalID, userPhoneNumber, userPhotoURI, userRank) {
  let imageRef = {};
  if (!userPhotoURI) {
    imageRef.name = null;
    imageRef.URL = null;

  } else {
    imageRef = await uploadImageAsync(userPhotoURI);
  }


  await setDoc(doc(db, "users", userID), {
    name: displayName,
    email: userEmail,
    personalID: userPersonalID,
    image: imageRef.URL,
    imageName: imageRef.name,
    phoneNumber: userPhoneNumber,
    rank: userRank,
    isActive: true
  }).catch(alert);

  return userID;
}

/**
 * Function does not delete user from records (as it is needed for other info). Instead, sets "isActive" to false.
 * @param {*} userID user ID to be deleted
 */
export async function deleteUser(userID) {
  const userRef = doc(db, "users", userID);

  const docSnap = await getDoc(userRef);
  let userImgName = docSnap.data()["imageName"];
  deleteFileFromStorage(userImgName);

  updateDoc(userRef, { isActive: false }).catch(alert);
  if (userID === auth.currentUser.uid) {
    console.log("signing out current user...");

    auth.signOut();
  }

}

/**
 * 
 * @param {*} userID 
 * @param {*} imageURI put null if no image change
 * @param {*} updated_fields 
 * @returns 
 */
export async function updateUser(userID, updated_fields) {
  const userDocRef = doc(db, 'users', userID);
  const docSnap = await getDoc(userDocRef);
  if (updated_fields.image === docSnap.data()['image']) { // no new image
    updateDoc(userDocRef, updated_fields).catch(alert);
    return;
  }


  if (docSnap.data()["imageName"] !== null) {
    deleteFileFromStorage(docSnap.data()["imageName"]); //delete old image
  }

  const imageRef = await uploadImageAsync(updated_fields.image);
  updated_fields.image = imageRef.URL;
  updated_fields.imageName = imageRef.name;

  updateDoc(userDocRef, updated_fields).catch(alert);

}


// export async function fetchDropAreasSorted() {
//   const qry = query(collection(db, 'dropAreas'), orderBy('name'));

//   let Mycollection = await getDocs(qry);
//   let arr = [];
//   Mycollection.forEach(element => {
//     let elementWithID = element.data();
//     elementWithID["id"] = element.id //add ID to JSON
//     arr.push(elementWithID);
//   });

//   return arr;

// }

/**
 * Fetches users data sorted by name in an array. Attaches userID as a field.
 * if onlyActive=true , fetches only active users. else, fetches all users.
 * @param {*} onlyActive Boolean value
 * @returns array of JSON users data.
 */
export async function fetchUsersSorted(onlyActive) {
  let qry = null;
  if (onlyActive) {
    qry = query(collection(db, 'users'), where("isActive", "==", true), orderBy('name'));
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

export async function getUserByEmail(userEmail) {
  let qry = null;
  qry = query(collection(db, 'users'), where('email', '==', userEmail));
  let Mycollection = await getDocs(qry);

  console.log(userEmail);

  let currentUser;

  Mycollection.forEach(element => {


    currentUser = element.data();

    console.log(currentUser);
  });

  return currentUser;

}



export async function addNewFeedback(feedbackUserID, feedbackTitle, feedbackDate, feedbackContent) {
  let feedbackTimestamp = Timestamp.fromDate(feedbackDate);
  const docRef = await addDoc(collection(db, 'feedbacks'), {
    userID: feedbackUserID,
    title: feedbackTitle,
    date: feedbackTimestamp,
    content: feedbackContent
  }).catch(alert);
  // updateDocumentById("feedbacks", docRef.id, { "id": docRef.id });

  return docRef.id;
}

export async function fetchFeedbacksSorted() {
  const qry = query(collection(db, 'feedbacks'), orderBy('date', 'desc'));


  let Mycollection = await getDocs(qry);
  let arr = [];
  Mycollection.forEach(element => {
    let elementWithID = element.data();
    elementWithID["id"] = element.id //add ID to JSON
    //convert Timestamp to Date:

    elementWithID["date"] = elementWithID["date"].toDate();
    arr.push(elementWithID);
  });

  return arr;
}

export async function addNewGoodWaste(wasteItemID, wasteAmount, wasteDate) {
  // const itemsRef = collection(db, 'goodsWastes');

  const docRef = await addDoc(collection(db, 'goodsWastes'), {
    itemID: wasteItemID,
    amount: wasteAmount,
    date: wasteDate
  }).catch(alert);
  // updateDocumentById("goodsWastes", docRef.id, { "id": docRef.id });
  return docRef.id;

}


async function isValidItemsAmounts(recordArray) {

  console.log("Inside isValid");

  let errorFound = false;


  fetchItemsSorted().then((items) => {


    for (const mainItem of items) {

      for (const recordItem of recordArray) {

        if (mainItem.id === recordItem.id) {

          console.log("recordItem.amount > mainItem.current_amount: ", recordItem.amount > mainItem.current_amount);
          if (recordItem.amount > mainItem.current_amount) {

            Alert.alert(
              "שגיאה",
              "כמויות הסחורות השתנו כך שלא תוכלו להמשיך את הפעולה. נסו שוב.",
              [
                {
                  text: "סגור",
                  onPress: () => console.log("Close Pressed"),
                  style: "cancel"
                }
              ]
            );
            return false;
          }
        }
      }
    }

  });


  return true;
}

export async function addNewExportRecord(exportUserID, exportDropAreaID, exportDate, recordArray) {

  let isValid = await isValidItemsAmounts(recordArray);

  if (!isValid) {
    console.log("Not Valid");
    return;
  }

  let itemToAmountMap = convertJsonArrayToMap(recordArray);
  // const itemsRef = collection(db, 'exportGoodsRecords');

  const docRef = await addDoc(collection(db, 'exportGoodsRecords'), {
    userID: exportUserID,
    dropAreaID: exportDropAreaID,
    date: exportDate,
    itemsToAmounts: itemToAmountMap
  }).catch(alert);

  await updateItemsAmountsFromRecord(itemToAmountMap, 2);

  // updateDocumentById("exportGoodsRecords", docRef.id, { "id": docRef.id });
  return docRef.id;

}

export async function addNewDeleteRecord(recordUserID, recordDate, recordArray) {

  let isValid = await isValidItemsAmounts(recordArray);

  if (!isValid) {
    console.log("Not Valid");
    return;
  }


  let recordMap = convertJsonArrayToMap(recordArray);
  // const recordsRef = collection(db, 'importGoodsRecord');

  const docRef = await addDoc(collection(db, 'deleteRecords'), {
    userID: recordUserID,
    date: recordDate,
    itemsToAmounts: recordMap // <itemReference : int>
  }).catch(alert);
  // updateDocumentById("importGoodsRecord", docRef.id, { "id": docRef.id });

  await updateItemsAmountsFromRecord(recordMap, -1);
  return docRef.id;
}


export async function addNewWasteRecord(recordUserID, wasteDropAreaID, wasteDate, recordArray, isMainStorage = false) {

  if (isMainStorage) {

    let isValid = await isValidItemsAmounts(recordArray);

    if (!isValid) {
      console.log("Not Valid");
      return;
    }
  }

  let recordMap = convertJsonArrayToMap(recordArray);
  // const recordsRef = collection(db, 'importGoodsRecord');

  const docRef = await addDoc(collection(db, 'goodsWasteRecords'), {
    userID: recordUserID,
    date: wasteDate,
    dropAreaID: wasteDropAreaID,
    itemsToAmounts: recordMap // <itemReference : int>
  }).catch(alert);
  // updateDocumentById("importGoodsRecord", docRef.id, { "id": docRef.id });
  console.log("Added new waste record: ", recordMap);

  if (isMainStorage) {
    await updateItemsAmountsFromRecord(recordMap, -1);
  }

  return docRef.id;


}

export async function fetchWasteRecordsSorted(fromDate = null, toDate = null) {
  let qry = getQueryFromDates(fromDate, toDate, 'goodsWasteRecords');

  let Mycollection = await getDocs(qry);
  let arr = [];
  // console.log('Printing waste records:');

  Mycollection.forEach(element => {
    let elementWithID = element.data();
    // console.log(elementWithID);
    elementWithID["id"] = element.id //add ID to JSON
    arr.push(elementWithID);
  });

  return arr;

}

export async function fetchAreaWasteRecordsSorted(fromDate = null, toDate = null, areaID) {
<<<<<<< HEAD
  let qry = getQueryFromDatesAndArea(fromDate, toDate, areaID, 'exportGoodsRecords');
=======
  let qry = getQueryFromDatesAndArea(fromDate, toDate, areaID, 'goodsWasteRecords');
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270

  let Mycollection = await getDocs(qry);
  let arr = [];
  Mycollection.forEach(element => {
    let elementWithID = element.data();
    elementWithID["id"] = element.id //add ID to JSON
    //convert Timestamp to Date:
    element.data().date = timestampToDate(element.data().date);
    arr.push(elementWithID);
  });

  return arr;

}


export async function deleteDocumentById(collectionName, documentID) {
  await deleteDoc(doc(db, collectionName, documentID));
}



function generateName() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

async function compressImage(imageURI) {
  console.log("compressing image...");
  const resizedPhoto = await manipulateAsync(
    imageURI,
    [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio 
    { compress: 0.7, format: "jpeg" },
  );
  return resizedPhoto.uri;
}

/**
 * Uploads image to Firebase Storage. Returns image name and its download URL. (name is generated randomly)
 * @param {} imageURI URI of the image to upload
 * @returns JOSN object of format: {name : <image/file name> , URL : <image/file download URL>}
 */
export async function uploadImageAsync(imageURI) {
  imageURI = await compressImage(imageURI);
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
    xhr.open("GET", imageURI, true);
    xhr.send(null);
  });
  let imgName = generateName();
  const fileRef = ref(storage, imgName);
  const result = await uploadBytes(fileRef, blob);
  // We're done with the blob, close and release it
  blob.close();
  let imgURL = await getDownloadURL(fileRef);
  console.log("Image URL: " + imgURL);
  return { name: imgName, URL: imgURL };

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

  return { "name": userName, "email": userEmail, "image": userImage };
}

//================================================================STATISTICS==============================================================
export async function fetchExportRecordsSorted(fromDate = null, toDate = null) {
  let qry = getQueryFromDates(fromDate, toDate, 'exportGoodsRecords');

  let Mycollection = await getDocs(qry);
  let arr = [];
  Mycollection.forEach(element => {
    let elementWithID = element.data();
    elementWithID["id"] = element.id //add ID to JSON
    //convert Timestamp to Date:
    element.data().date = timestampToDate(element.data().date);
    arr.push(elementWithID);
  });

  return arr;

}
export async function fetchAreaExportRecordsSorted(fromDate = null, toDate = null, areaID) {
  let qry = getQueryFromDatesAndArea(fromDate, toDate, areaID, 'exportGoodsRecords');

  let Mycollection = await getDocs(qry);
  let arr = [];
  Mycollection.forEach(element => {
    let elementWithID = element.data();
    elementWithID["id"] = element.id //add ID to JSON
    //convert Timestamp to Date:
    element.data().date = timestampToDate(element.data().date);
    arr.push(elementWithID);
  });

  return arr;

}

export async function fetchDeleteRecordsSorted(fromDate = null, toDate = null) {
  let qry = getQueryFromDates(fromDate, toDate, 'deleteRecords');

  let Mycollection = await getDocs(qry);
  let arr = [];
  Mycollection.forEach(element => {
    let elementWithID = element.data();
    elementWithID["id"] = element.id //add ID to JSON
    //convert Timestamp to Date:
    element.data().date = timestampToDate(element.data().date);
    arr.push(elementWithID);
  });

  return arr;

}

function calculateImportRecord(record, dictionary) {
  let recordMap = record.itemsToAmounts;
  const itemsIDs = Object.keys(dictionary);
  if (!recordMap) return;
  itemsIDs.forEach((key, index) => {
    if (key in recordMap) {
      dictionary[key] = (recordMap[key]) + dictionary[key];
<<<<<<< HEAD
    }  })
=======
    }
  })
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
}

function calculateDeleteRecord(record, dictionary) {
  let recordMap = record.itemsToAmounts;
  const itemsIDs = Object.keys(dictionary);
  if (!recordMap) return;
  itemsIDs.forEach((key, index) => {
    if (key in recordMap) {
      dictionary[key] = (recordMap[key]) + dictionary[key];
<<<<<<< HEAD
    }  })
}

function calculateExportRecord(record, dictionary) {
  let recordMap = record.itemToAmount;
=======
    }
  })
}

function calculateExportRecord(record, dictionary) {
  let recordMap = record.itemsToAmounts;
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
  // console.log("record map: ",recordMap);
  const itemsIDs = Object.keys(dictionary);
  if (!recordMap) return;
  itemsIDs.forEach((key, index) => {
    if (key in recordMap) {
      dictionary[key] = (recordMap[key]) + dictionary[key];
    }
  })
}

function calculateWasteRecord(record, dictionary) {
<<<<<<< HEAD
=======
  console.log("record: ", record);
  console.log("dictionary: ", dictionary);

>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
  let recordMap = record.itemsToAmounts;
  const itemsIDs = Object.keys(dictionary);
  if (!recordMap) return;
  itemsIDs.forEach((key, index) => {
    if (key in recordMap) {
      dictionary[key] = (recordMap[key]) + dictionary[key];
    }
    // wastesDictionary[key] = (recordMap[key] || 0) + wastesDictionary[key];
  })
}

<<<<<<< HEAD
function createItemInfoJSON(itemID, itemName, itemImage, itemBoxAvgWeight, itemReceivedAmount, itemExportAmount, itemWasteAmount, itemSavedAmount){
  return {id : itemID, name: itemName, image: itemImage, boxWeight: itemBoxAvgWeight, receivedAmount : itemReceivedAmount, exportAmount : itemExportAmount,
     wasteAmount : itemWasteAmount, savedAmount : itemSavedAmount};
}

function createItemInfoJSONArea(itemID, itemName, itemImage, itemBoxAvgWeight, itemExportAmount, itemWasteAmount, itemSavedAmount){
  return {id : itemID, name: itemName, image: itemImage, boxWeight: itemBoxAvgWeight, exportAmount : itemExportAmount,
     wasteAmount : itemWasteAmount, savedAmount : itemSavedAmount};
=======
function createItemInfoJSON(itemID, itemName, itemImage, itemBoxAvgWeight, itemReceivedAmount, itemExportAmount, itemWasteAmount, itemSavedAmount) {
  return {
    id: itemID, name: itemName, image: itemImage, boxWeight: itemBoxAvgWeight, receivedAmount: itemReceivedAmount, exportAmount: itemExportAmount,
    wasteAmount: itemWasteAmount, savedAmount: itemSavedAmount
  };
}

function createItemInfoJSONArea(itemID, itemName, itemImage, itemBoxAvgWeight, itemExportAmount, itemWasteAmount, itemSavedAmount) {
  return {
    id: itemID, name: itemName, image: itemImage, boxWeight: itemBoxAvgWeight, receivedAmount: itemExportAmount,
    wasteAmount: itemWasteAmount, savedAmount: itemSavedAmount
  };
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
}

/**
 * 
 * @param {*} fromDate 
 * @param {*} toDate 
 * @returns Array of JSONs
 */
export async function getGeneralStatisticsArray(fromDate = null, toDate = null) {
<<<<<<< HEAD
  if (fromDate){
    fromDate.setHours(0,0,0,0);
  }
  if (toDate){
    toDate.setHours(0,0,0,0);
=======
  if (fromDate) {
    fromDate.setHours(0, 0, 0, 0);
  }
  if (toDate) {
    toDate.setHours(23, 59, 59, 0);
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
  }
  console.log("Fetching statistics from date: ", fromDate, ", to date: ", toDate);
  let importRecords = await fetchImportRecordsSorted(fromDate, toDate);
  let deleteRecords = await fetchDeleteRecordsSorted(fromDate, toDate);
  let exportRecords = await fetchExportRecordsSorted(fromDate, toDate);
  let wasteRecords = await fetchWasteRecordsSorted(fromDate, toDate);
  let items = await fetchItemsSorted();
  let itemsIDs = Object.keys(items);
  let importsDictionary = {};
  let deletesDictionary = {};
  let exportsDictionary = {};
  let wastesDictionary = {};

  items.forEach((item) => {
    // console.log("adding " + item.id);
    importsDictionary[item.id] = 0;
<<<<<<< HEAD
    exportsDictionary[item.id] = 0;
    deletesDictionary[item.id] = 0;
=======
    deletesDictionary[item.id] = 0;
    exportsDictionary[item.id] = 0;
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
    wastesDictionary[item.id] = 0;
  });

  importRecords.forEach((record) => calculateImportRecord(record, importsDictionary));
  // console.log("importRecords: ", importsDictionary);

  deleteRecords.forEach((record) => calculateDeleteRecord(record, deletesDictionary));
  // console.log("deleteRecords: ", deletesDictionary);

  wasteRecords.forEach((record) => calculateWasteRecord(record, wastesDictionary));
  // console.log("wasteRecords: ", wastesDictionary);

  exportRecords.forEach((record) => calculateExportRecord(record, exportsDictionary));
  // console.log("exportRecords: ", exportsDictionary);

  let itemsFinalArray = [];
  let currentItemJSON = null;
<<<<<<< HEAD
  items.forEach( (item) => {
    itemsFinalArray.push(createItemInfoJSON(item.id , item.name, item.image, item.average_weight, (importsDictionary[item.id] - deletesDictionary[item.id]),
     exportsDictionary[item.id], wastesDictionary[item.id], (importsDictionary[item.id] - deletesDictionary[item.id]) - wastesDictionary[item.id]));
  }) 
=======
  items.forEach((item) => {
    itemsFinalArray.push(createItemInfoJSON(item.id, item.name, item.image, item.average_weight, (importsDictionary[item.id] - deletesDictionary[item.id]),
      exportsDictionary[item.id], wastesDictionary[item.id], (importsDictionary[item.id] - deletesDictionary[item.id]) - wastesDictionary[item.id]));
  })
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270

  return itemsFinalArray;
}

<<<<<<< HEAD
export async function getDropAreaStatistics(fromDate = null, toDate = null, dropAreaID) {
  if (fromDate){
    fromDate.setHours(0,0,0,0);
  }
  if (toDate){
    toDate.setHours(0,0,0,0);
  }
  console.log("Fetching statistics of areaID ",dropAreaID ," from date: ", fromDate, ", to date: ", toDate);
=======
export async function getDropAreaStatistics(fromDate = null, toDate = null, dropAreaID, isMainStorage = false) {

  if (fromDate) {
    fromDate.setHours(0, 0, 0, 0);
  }
  if (toDate) {
    toDate.setHours(23, 59, 59, 0);
  }
  console.log("Fetching statistics of areaID ", dropAreaID, " from date: ", fromDate, ", to date: ", toDate);

  let importRecords;
  let deleteRecords;

  if (isMainStorage) {
    importRecords = await fetchImportRecordsSorted(fromDate, toDate);
    deleteRecords = await fetchDeleteRecordsSorted(fromDate, toDate);
  }

>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
  let exportRecords = await fetchAreaExportRecordsSorted(fromDate, toDate, dropAreaID);
  let wasteRecords = await fetchAreaWasteRecordsSorted(fromDate, toDate, dropAreaID);
  let items = await fetchItemsSorted();
  let itemsIDs = Object.keys(items);

<<<<<<< HEAD
=======
  let importsDictionary = {};
  let deletesDictionary = {};
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
  let exportsDictionary = {};
  let wastesDictionary = {};

  items.forEach((item) => {
    // console.log("adding " + item.id);
<<<<<<< HEAD
=======
    if (isMainStorage) {
      importsDictionary[item.id] = 0;
      deletesDictionary[item.id] = 0;
    }

>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
    exportsDictionary[item.id] = 0;
    wastesDictionary[item.id] = 0;
  });

<<<<<<< HEAD
  wasteRecords.forEach((record) => calculateWasteRecord(record, wastesDictionary));
  // console.log("wasteRecords: ", wasteRecords);
=======
  if(isMainStorage){
    importRecords.forEach((record) => calculateImportRecord(record, importsDictionary));
    // console.log("importRecords: ", importsDictionary);
  
    deleteRecords.forEach((record) => calculateDeleteRecord(record, deletesDictionary));
    // console.log("deleteRecords: ", deletesDictionary);
  }

  wasteRecords.forEach((record) => calculateWasteRecord(record, wastesDictionary));
   console.log("wasteRecords: ", wasteRecords);
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270

  exportRecords.forEach((record) => calculateExportRecord(record, exportsDictionary));
  // console.log("exportRecords: ", exportRecords);

  let itemsFinalArray = [];
<<<<<<< HEAD
  let currentItemJSON = null;
  items.forEach( (item) => {
    itemsFinalArray.push(createItemInfoJSONArea(item.id , item.name, item.image, item.average_weight, exportsDictionary[item.id],
       wastesDictionary[item.id], exportsDictionary[item.id] - wastesDictionary[item.id]));
  }) 

  return itemsFinalArray;
}
=======

  if(isMainStorage){

    items.forEach((item) => {
      itemsFinalArray.push(createItemInfoJSON(item.id, item.name, item.image, item.average_weight, (importsDictionary[item.id] - deletesDictionary[item.id]),
        exportsDictionary[item.id], wastesDictionary[item.id], (importsDictionary[item.id] - deletesDictionary[item.id]) - wastesDictionary[item.id]));
    })

  } else {

    items.forEach((item) => {
      itemsFinalArray.push(createItemInfoJSONArea(item.id, item.name, item.image, item.average_weight, exportsDictionary[item.id],
        wastesDictionary[item.id], exportsDictionary[item.id] - wastesDictionary[item.id]));
    })
  }

  return itemsFinalArray;
}
>>>>>>> b2e22705ffbc7c1e3150a57ca4fd304a3d74c270
