import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Items from "../components/Items";

import {
  fetchItemsSorted,
  updateItem,
  addNewItem,
  updateDocumentById,
  deleteItem,
} from "../config/database_interface";

import { getStatusBarHeight } from "react-native-status-bar-height";

import {
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";
import * as paper from "react-native-paper";
import { Colors } from "../config";
import { theme } from "../core/theme";
import OurActivityIndicator from "../components/OurActivityIndicator";


export default function ManageItems({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleItem, setModalVisibleItem] = useState(false);
  const [modalindex, setModalindex] = useState(null);
  const [modalEdit, setModalEdit] = useState(true);
  const [ShowAddimage, setShowAddimage] = useState(false);
  const [image, setImage] = useState(null);
  const [Name, setName] = useState("");
  const [Weight, setWeight] = useState("");
  const [WeightList, setWeightList] = useState([]);
  const [ItemsList, setItems] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [ShowText, setShowText] = useState(true);
  const [Showback, setShowBack] = useState(false);
  const [Items_id, setItems_id] = useState("");
  const [alertTitle, setAlertTitle] = useState("שגיאה");
  const [alertContent, setAlertContent] = useState("קרתה שגיאה");
  const [isAleretVisible, setIsAlertVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [List_id, setList_id] = useState([]);
  useEffect(() => {
    // write your code here, it's like componentWillMount
    fetchItemsSorted().then((result) => {
      CreateItemsCard(result);
      setIsLoading(false);
    });
  }, []);

  const CreateItemsCard = (itemsArray) => {
    setItems([]);
    setImageList([]);
    setWeightList([]);
    setList_id([]);
    console.log("featch.....");
    console.log(itemsArray);
    for (let item in itemsArray) {
      setItems((prev) => [...prev, itemsArray[item].name]);

      setImageList((prev) => [...prev, itemsArray[item].image]);
      setWeightList((prev) => [...prev, itemsArray[item].average_weight]);
      setList_id((prev) => [...prev, itemsArray[item].id]);
    }
  };
  const isValidInfo = () => {
    console.log(Name)
    console.log(Weight)
    console.log(image)

    let errorsString = "";

    if (Name === "") {

      errorsString += "* שם הפריט חובה\n";
    }

    if (Weight === "") {

      errorsString += "* משקל הפריט חובה\n";
    }
    if (isNaN(Weight)) {
      errorsString += "* משקל צריך להיות מספר\n";
    }
    if (image === null) {

      errorsString += "* תמונת הפריט חובה\n";
    }

    if (errorsString !== "") {

      setAlertTitle("שגיאות קלט");
      setAlertContent(errorsString);
      setIsAlertVisible(true);
      return false;
    }


    return true;
  }
  const handleAddItems = async () => {
    Keyboard.dismiss();
    setModalVisible(!modalVisible);
    if (!isValidInfo()) {
      // setAlertTitle("שגיאה בהעלאת הנתונים");
      // setAlertContent("* נא לבדוק שיש חיבור לאינטרנט או לנסות מאוחר יותר");
      setIsProcessing(false);
      setIsAlertVisible(true);
      return;
    }

    setIsProcessing(true)
    let x = await addNewItem(Name, image, parseFloat(Weight), 0);
    List_id.push(x);
    setItems_id(x);
    console.log("id: " + x);


    setItems([...ItemsList, Name]);
    setImageList([...imageList, image]);
    setWeightList([...WeightList, Weight]);

    console.log("list id: " + List_id);
    setName("");
    setImage(null);
    setWeight("");

    setItems_id(null);
    setIsProcessing(false)
  };

  const handleEditItems = (index) => {
    Keyboard.dismiss();
    setModalVisibleItem(!modalVisibleItem)
    if (!isValidInfo()) {
      // setAlertTitle("שגיאה בהעלאת הנתונים");
      // setAlertContent("* נא לבדוק שיש חיבור לאינטרנט או לנסות מאוחר יותר");
      setIsProcessing(false);
      setIsAlertVisible(true);
      return;
    }

    let editField = { name: Name, average_weight: parseFloat(Weight), image: image };
    updateItem(List_id[index], editField);
    // if (!Name.trim() || !Weight.trim()) {
    //   Alert.alert("שגיאה ", "תבדוק שהטקסט אינו רק !!", [{ text: "תמשיך" }]);
    //   return;
    // } else {
    setShowText(!ShowText) ||

      setShowBack(false) ||
      setModalEdit(!modalEdit) ||
      setShowAddimage(!ShowAddimage)
    // }
    ItemsList[index] = Name;
    WeightList[index] = Weight;

    imageList[index] = image;

  };
  const deleteItems = (index) => {

    Alert.alert(
      'האם אתה בטוח',
      'האם אתה בטוח שאתה רוצה למחוק את המשוב הזה?',
      [
        {
          text: 'כן', onPress: () => {

            setModalVisibleItem(!modalVisibleItem)

            deleteItem(List_id[index]);

            //  fetchAllDocuments("items").then((result) => {
            //   CreateItemsCard(result);
            // });
            let CopyItemsList = [...ItemsList];
            CopyItemsList.splice(index, 1);
            setItems(CopyItemsList);
            let CopyImageList = [...imageList];
            CopyImageList.splice(index, 1);
            setImageList(CopyImageList);

            let CopyWeightList = [...WeightList];
            CopyWeightList.splice(index, 1);
            setWeightList(CopyWeightList);

            let CopyIdList = [...List_id];
            CopyIdList.splice(index, 1);
            setList_id(CopyIdList);


          },
        },
        { text: 'לא', onPress: () => { }, style: 'cancel' },
      ]
    );


  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const showCard = ItemsList.map((Item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onLongPress={() =>
          setModalVisibleItem(true) ||
          setModalindex(index) ||
          setShowText(true) ||
          setModalEdit(true) ||
          setShowBack(false) ||
          setShowAddimage(false) ||
          setImage(imageList[index]) //fetchAllDocuments("items").then((result) => {CreateItemsCard(result);})
        }
      >
        <Items Name={Item} image={imageList[index]} />

        {/* <View> */}
        <Modal
          transparent={true}
          visible={modalVisibleItem}
          onRequestClose={() => {
            setModalVisibleItem(!modalVisibleItem);
          }}
        >

          <ImageBackground
            style={styles.ProfileScreen}
            source={require("../assets/background_dot.png")}
            resizeMode="repeat"
          >
            <TouchableOpacity
              style={styles.BackButton}
              onPress={() =>
                setModalVisibleItem(!modalVisibleItem) ||
                setShowText(true) ||
                setModalEdit(true) ||
                setShowBack(false) ||
                setShowAddimage(false) ||
                setImage(null)
              }
            >
              <Image
                style={styles.BackButton_Image}
                source={require("../assets/arrow_back.png")}
              />
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,

                // margin: 40,
                // padding: 10,

                alignItems: "center",
                alignContent: "center",
                justifyContent: "space-evenly",
              }}
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >
              {/* <View> */}
              {ShowText ? (
                <View>
                  <Text style={styles.modelText}>
                    {" "}
                    שם: {ItemsList[modalindex]}
                  </Text>
                  <Text style={styles.modelText}>
                    {" "}
                    משקל: {WeightList[modalindex]}
                  </Text>
                </View>
              ) : null}

              {!ShowText ? (
                // <KeyboardAvoidingWrapper>

                <View style={styles.InputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={ItemsList[modalindex]}
                    //  value={ItemsList[modalindex]}
                    onChangeText={(text) => setName(text)}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder={String(WeightList[modalindex])}
                    //  value={WeightList[modalindex]}
                    keyboardType="number-pad"
                    onChangeText={(text) => setWeight(text)}
                  />
                </View>
              ) : // </KeyboardAvoidingWrapper>
                null}

              <View style={styles.AddphotoContainer}>
                <TouchableOpacity onPress={pickImage}>
                  {ShowAddimage ? (
                    <Image
                      style={styles.addphoto}
                      source={require("../assets/editimage.png")}
                    />
                  ) : null}
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.Image} />}
              </View>

              <TouchableOpacity
                style={styles.DeletButton}
                onPress={
                  () =>
                    deleteItems(modalindex)


                }
              >
                <Text style={styles.appButtonText}>הוסיר</Text>
              </TouchableOpacity>
              {!modalEdit ? (
                <TouchableOpacity
                  style={styles.appButtonContainer}
                  onPress={() => handleEditItems(modalindex)}
                >
                  <Text style={styles.appButtonText}>אישור</Text>
                </TouchableOpacity>
              ) : null}

              {Showback ? (
                <TouchableOpacity
                  style={styles.appButtonContainer}
                  onPress={() =>
                    setShowText(true) ||
                    setModalEdit(true) ||
                    setShowBack(!Showback) ||
                    setShowAddimage(false) ||
                    setImage(imageList[modalindex])
                  }
                >
                  <Text style={styles.appButtonText}>לחזור</Text>
                </TouchableOpacity>
              ) : null}

              {modalEdit ? (
                <TouchableOpacity
                  style={styles.appButtonContainer}
                  onPress={() =>
                    setName(ItemsList[modalindex]) ||
                    setWeight(WeightList[modalindex]) ||
                    setShowText(!ShowText) ||
                    setModalEdit(!modalEdit) ||
                    setShowBack(!Showback) ||
                    setShowAddimage(!ShowAddimage)

                  }
                >
                  <Text style={styles.appButtonText}>עדכן</Text>
                </TouchableOpacity>
              ) : null}
              {/* <TouchableOpacity
              style={styles.BackButton}
              onPress={() =>
                setModalVisibleItem(!modalVisibleItem) ||
                setShowText(true) ||
                setModalEdit(true) ||
                setShowBack(false) ||
                setShowAddimage(false) ||
                setImage(null)
              }
            >
              <Image
                style={styles.BackButton_Image}
                source={require("../assets/arrow_back.png")}
              />
            </TouchableOpacity> */}


            </ScrollView>
          </ImageBackground>
          {/* </ScrollView> */}
        </Modal>

      </TouchableOpacity>
    );
  });
  return (
    <View style={styles.background}>
      <Background>
        {isLoading && <OurActivityIndicator />}
        <BackButton goBack={navigation.goBack} />
        {/*start your code here*/}
        <Text style={styles.Title}>ניהול פרטים</Text>
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          {/* <View style={styles.HeddinScreeen}> */}


          <ImageBackground
            style={styles.ProfileScreen}
            source={require("../assets/background_dot.png")}
            resizeMode="repeat"
          >
            <TouchableOpacity
              style={styles.BackButton}
              onPress={() => setModalVisible(!modalVisible) || setImage(null)}
            >
              <Image
                style={styles.BackButton_Image}
                source={require("../assets/arrow_back.png")}
              />
            </TouchableOpacity>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,

                // margin: 40,
                // padding: 10,

                alignItems: "center",
                alignContent: "center",
                justifyContent: "space-evenly",
              }}
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >

              <View style={styles.DetailsContainer}></View>
              <TextInput
                style={styles.input}
                placeholder={"שם..."}
                value={Name}
                onChangeText={(text) => setName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder={"משקל..."}
                value={Weight.toString()}
                keyboardType="number-pad"
                onChangeText={(text) => setWeight(text)}
              />
              {/* <TextInput style={styles.input} placeholder={"עוד..."} /> */}
              <View style={styles.AddphotoContainer}>
                <TouchableOpacity onPress={pickImage}>
                  <Image
                    style={styles.addphoto}
                    source={require("../assets/addphoto2.png")}
                  />
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.Image} />}
              </View>
              <TouchableOpacity
                style={styles.appButtonContainer}
                onPress={
                  () => handleAddItems()

                }
              >
                <Text style={styles.appButtonText}>אישור</Text>
              </TouchableOpacity>

            </ScrollView>
          </ImageBackground>
          {/* </View> */}
        </Modal>

        {/* <View style={styles.ScreenContainer}>  */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,

            flexDirection: "row",

            width: "100%",
            marginTop: 5,

            flexWrap: "wrap",
          }}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
        >
          {showCard}
        </ScrollView>

        <View style={styles.addButtonStyle}>
          <TouchableOpacity
            onPress={() => setImage(null) || setModalVisible(true)}
            style={styles.toucheableAddBStyle}
          >
            <Text style={styles.addButtonTextStyle}>+</Text>
          </TouchableOpacity>
        </View>
      </Background>
      <paper.Modal visible={isAleretVisible}>

        <View style={styles.alertContainer}>

          <View style={styles.alertContentContainer}>

            <Text style={styles.alertTitleTextStyle}>{alertTitle}</Text>

            <Text style={styles.alertContentText}>{alertContent}</Text>

            <TouchableOpacity style={styles.alertCloseButtonStyle} onPress={() => setIsAlertVisible(false)}><Text style={styles.alertButtonTextStyle}>סגור</Text></TouchableOpacity>

          </View>

        </View>

      </paper.Modal>

      <paper.Modal visible={isProcessing}>

        <View style={styles.processingAlertContainer}>

          <View style={styles.processingAlertContentContainer}>

            <Text style={styles.processingAlertTextStyle}>הפעולה מתבצעת ...</Text>

            <ActivityIndicator size="large" color={Colors.primary} />

          </View>

        </View>

      </paper.Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  ScreenContainer: {
    flex: 1,
    paddingTop: 50,
    marginTop: 20,
    backgroundColor: "red",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignContent: "space-around",
    flexWrap: "wrap",
  },
  Title: {
    // position: 'absolute',

    fontSize: 24,
    fontWeight: "bold",

    marginTop: 50,
  },

  AddButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    backgroundColor: "#1c6669",
    //"#1c6669"
    //#5AF142
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FFF",
    borderWidth: 2,
  },
  PlusIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  ScrollProfileScreen: {

  },
  ProfileScreen: {
    flex: 1,

    backgroundColor: "#ffffff",
    // margin: 40,
    // padding: 10,
    // borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-evenly",
    // borderWidth: 5,
    // borderColor: "#1c6669"
  },

  InputContainer: {
    //  flexGrow: 0.5,
    //  height:"40%",
    //  backgroundColor: 'black'
  },
  input: {
    width: 250,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1c6669",
    margin: 5
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#1c6669",
    borderRadius: 10,
    paddingVertical: 10,
    margin: 10,
    paddingHorizontal: 12,
    width: 200,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  DeletButton: {
    elevation: 8,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 200,
  },
  addphoto: {
    width: 80,
    height: 80,
  },
  Image: {
    width: 120,
    height: 120,
    borderWidth: 5,
    borderRadius: 10,

    borderColor: "#1c6669",
  },
  AddphotoContainer: {
    flexDirection: "row-reverse",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modelText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  Details1: {
    width: 100,
    height: 100,
    backgroundColor: "blue",
  },
  Details2: {
    width: 100,
    height: 100,
    backgroundColor: "red",
  },
  BackButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 0 : getStatusBarHeight() + 10,
    left: 4,
  },
  BackButton_Image: {
    width: 30,
    height: 30,
    marginLeft: 10
  },
  addButtonStyle: {
    position: "absolute",
    backgroundColor: "#02c39a",
    height: 65,
    width: 65,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    bottom: 15,
    left: 15,
    borderColor: "#006d77",
    borderWidth: 3,
    elevation: 3,
  },

  addButtonTextStyle: {
    color: "white",
    fontSize: 40,
  },

  toucheableAddBStyle: {
    height: 65,
    width: 65,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  alertContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  alertContentContainer: {

    width: "70%",
    backgroundColor: "white",
    borderColor: "#ff3333",
    borderWidth: 3,
    borderRadius: 7,
    padding: 10
  },

  alertTitleTextStyle: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#ff3333",

  },

  alertContentText: {

    textAlign: "right",
    fontSize: 16,
    marginBottom: 10,
    color: "#ff3333",
    paddingRight: 8
  },

  alertCloseButtonStyle: {

    width: "70%",
    height: 50,
    backgroundColor: "white",
    borderColor: "#ff3333",
    borderWidth: 2,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },

  alertButtonTextStyle: {

    fontSize: 18,
    color: "#ff3333",
  },

  processingAlertContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    // backgroundColor: "#000000aa"
  },

  processingAlertContentContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 3,
    borderColor: "#1c6669"
  },

  processingAlertTextStyle: {

    fontSize: 20,
    marginRight: 15
  },
  HiddenScreen: {
    flex: 1,
    backgroundColor: "#000000aa"
  },
  // upper: {
  //   zIndex: 10,
  // }
});
