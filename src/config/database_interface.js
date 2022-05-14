import { collection, setDoc, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db, auth } from "./firebase";
import { LogBox } from 'react-native';
import { async } from "@firebase/util";
import { createUserWithEmailAndPassword } from 'firebase/auth';

LogBox.ignoreLogs(['Setting a timer']);
/**
 * Adds a new item entry to database and adds document ID as a field
 * @param itemName
 * @param itemImgRef
 * @param itemAvgWeight
 * @param itemCurrentAmount
 */
export async function addNewItem(itemName, itemImgRef, itemAvgWeight, itemCurrentAmount) {
  // let itemsRef = await collection(db, 'items');
  const docRef = await addDoc(collection(db, 'items'), {
    name: itemName, 
    image: itemImgRef, 
    average_weight: itemAvgWeight,
    current_amount: itemCurrentAmount
  })
  .catch(alert);

  updateDocumentById("items", docRef.id, { "id": docRef.id });

  return docRef.id; 

}

function checkForId(item, itemName) {
 
  if (item.data()["name"] == itemName) {
    updateDocumentById("items", item.id, { "id": item.id });
  }
}

export async function getIdByName(collectionName, itemName) {
  itemsRef = await getDocs(collection(db, collectionName));
  for (const item in itemsRef) {  
    if (item.data()["name"] == itemName) return item.id;
  }
}

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
export async function fetchAllDocuments(collectionName) { // "items" "users" "dropAreas"
  let Mycollection = await getDocs(collection(db, collectionName));
  let arr = []; 
  Mycollection.forEach(element => {
    arr.push(element.data());
  });

  return arr;
}

export async function fetchDocumentById(collectionName, itemID) {
  const docRef = doc(db, collectionName, itemID); 
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

export async function addNewDropArea(areaName, areaAddress) {
  // const areasRef = collection(db, 'dropAreas'); 

  const docRef = await addDoc(collection(db, 'dropAreas'), {
    name: areaName,
    address: areaAddress
  }).catch(alert);

  updateDocumentById("dropAreas", docRef.id, { "id": docRef.id });
}

/**
 *
 * @param recordID
 * @param recordDate
 * @param recordMap
 */
export async function addNewImportRecord(recordID, recordUserID, recordDate, recordMap) {
  // const recordsRef = collection(db, 'importGoodsRecord');
 
  const docRef = await setDoc(collection(db, 'importGoodsRecord'), {
    userID: recordUserID,
    date: recordDate,
    itemsToAmounts: recordMap // <itemReference : int>
  }).catch(alert);
  updateDocumentById("importGoodsRecord", docRef.id, { "id": docRef.id });

}

/**
 * 
 * @param {*} userName 
 * @param {*} userEmail 
 * @param {*} userPhoneNumber 
 * @param {*} userDateCreated 
 * @param {*} userRank 
 */
export async function createNewUser(userEmail, password, displayName, userPersonalID, phoneNumber, userPhotoURL, userBirthDate, userRank) {
 
  await createUserWithEmailAndPassword(auth, userEmail, password)
    .then((userCredential) => {
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

  await addNewUser(userEmail, displayName, userPersonalID, phoneNumber, userPhotoURL, userBirthDate, userRank);
  
}

async function addNewUser(userEmail, displayName, userPersonalID, userPhoneNumber, userPhotoURL, userBirthDate, userRank) {
  // let usersRef = collection(db, 'users');
   
  const docRef = await addDoc(collection(db, 'users'), {
    name: displayName,
    email : userEmail,
    personalID : userPersonalID,
    image: userPhotoURL,
    phoneNumber : userPhoneNumber,
    birthDate : userBirthDate,
    rank : userRank
  }).catch(alert);

  updateDocumentById("users", docRef.id, { "id": docRef.id });

}

export async function addNewFeedback(feedbackUserID, feedbackTitle, feedbackDate, feedbackContent) {
  const docRef = await addDoc(collection(db, 'feedbacks'), {
    userID: feedbackUserID,
    title: feedbackTitle,
    date: feedbackDate,
    content: feedbackContent
  }).catch(alert);
  updateDocumentById("feedbacks", docRef.id, { "id": docRef.id });
}  

export async function addNewGoodWaste(wasteItemID, wasteAmount) {
  // const itemsRef = collection(db, 'goodsWastes');
   
  const docRef = await addDoc(collection(db, 'goodsWastes'), {
    itemID: wasteItemID,
    amount: wasteAmount
  }).catch(alert);

  updateDocumentById("goodsWastes", docRef.id, { "id": docRef.id });

}

export async function addNewExportRecord(exportUserID, exportDropAreaID, exportDate, itemToAmountMap) {
  // const itemsRef = collection(db, 'exportGoodsRecords');
   
  const docRef = await addDoc(collection(db, 'exportGoodsRecords'), {
    userID: exportUserID,
    dropAreaID: exportDropAreaID,
    date: exportDate,
    itemToAmount: itemToAmountMap
  }).catch(alert);

  updateDocumentById("exportGoodsRecords", docRef.id, { "id": docRef.id });

}

export async function addNewWasteRecord(wasteDate, itemToAmountMap) {
  // const itemsRef = collection(db, 'goodsWasteRecords');

  const docRef = await addDoc(collection(db, 'goodsWasteRecords'), {
    date: wasteDate,
    itemToAmount: itemToAmountMap
  }).catch(alert);

  updateDocumentById("goodsWasteRecords", docRef.id, { "id": docRef.id });

}

export async function deleteDocumentById(collectionName, documentID) {
  await deleteDoc(doc(db, collectionName, documentID));
}