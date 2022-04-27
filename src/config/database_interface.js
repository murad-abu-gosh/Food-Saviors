import { db } from "./firebase";

/**
 * Adds a new item entry to database
 * @param itemName
 * @param itemImg
 * @param itemAvgWeight
 */
function addNewItem(itemName, itemImg, itemAvgWeight) {
  //check if already exists
  // let exists = false;
  // db.ref("items").orderByChild("name").equalTo(itemName).once("value", snapshot => {
  //   if (snapshot.exists()) {
  //     exists = true;
  //     const userData = snapshot.val();
  //     console.log("Item already exists", userData);
  //   }
  // });
  // if (exists) return;

  db.collection("users").add({
    name: itemName,
    image: itemImg,
    average_weight: itemAvgWeight
  }).catch(alert);
}

export default addNewItem;