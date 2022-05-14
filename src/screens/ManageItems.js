import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Items from "../components/Items";
import {
  fetchAllDocuments,
  addNewItem,
  deleteDocumentById,
  updateDocumentById,
} from "../config/database_interface";

import { getStatusBarHeight } from "react-native-status-bar-height";

import {
  Alert,
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

export default function ManageItems({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleItem, setModalVisibleItem] = useState(false);
  const [modalindex, setModalindex] = useState(null);
  const [modalEdit, setModalEdit] = useState(true);
  const [ShowAddimage, setShowAddimage] = useState(false);
  const [image, setImage] = useState();
  const [Name, setName] = useState();
  const [Weight, setWeight] = useState();
  const [WeightList, setWeightList] = useState([]);
  const [ItemsList, setItems] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [ShowText, setShowText] = useState(true);
  const [Showback, setShowBack] = useState(false);
  const [Items_id, setItems_id] = useState();
  const [tmp_id, settmp_id] = useState();
  const [List_id, setList_id] = useState([]);
  useEffect(() => {
    // write your code here, it's like componentWillMount
    fetchAllDocuments("items").then((result) => {
      CreateItemsCard(result);
    });
  }, []);

  const CreateItemsCard = (itemsArray) => {
    setItems([]);
    setImageList([]);
    setWeightList([]);
    setList_id([]);

    for (let item in itemsArray) {
      setItems((prev) => [...prev, itemsArray[item].name]);
      setImageList((prev) => [...prev, itemsArray[item].image]);
      setWeightList((prev) => [...prev, itemsArray[item].average_weight]);
      setList_id((prev) => [...prev, itemsArray[item].id]);
    }
  };
  const handleAddItems = () => {
    Keyboard.dismiss();
    addNewItem(Name, image, Weight, 0);

    if (!Name.trim() || !Weight.trim() || Name == null || Weight == null) {
      Alert.alert("שגיאה ", "תבדוק שהטקסט אינו רק !!", [{ text: "תמשיך" }]);
      return;
    } else {
      setModalVisible(!modalVisible);
    }
    setItems([...ItemsList, Name]);
    setImageList([...imageList, image]);
    setWeightList([...WeightList, Weight]);
    // setList_id([...List_id, New_id]);
    setName(null);
    setImage(null);
    setWeight(null);
    setItems_id(null);
  };

  const handleEditItems = (index) => {
    Keyboard.dismiss();
    let editField = { name: Name, average_weight: Weight, image: image };
    updateDocumentById("items", List_id[index], editField);
    if (!Name.trim() || !Weight.trim()) {
      Alert.alert("שגיאה ", "תבדוק שהטקסט אינו רק !!", [{ text: "תמשיך" }]);
      return;
    } else {
      setShowText(!ShowText) ||
        setModalEdit(!modalEdit) ||
        setShowBack(false) ||
        setShowAddimage(!ShowAddimage);
    }
    ItemsList[index] = Name;
    WeightList[index] = Weight;

    imageList[index] = image;
  };
  const deleteItems = (index) => {
    deleteDocumentById("items", List_id[index]);
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
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const showCard = ItemsList.map((Item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          setModalVisibleItem(true) ||
          setModalindex(index) ||
          setImage(imageList[index])
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
                  placeholder={WeightList[modalindex]}
                  //  value={WeightList[modalindex]}
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
              onPress={() =>
                deleteItems(modalindex) ||
                setModalVisibleItem(!modalVisibleItem) ||
                fetchAllDocuments("items").then((result) => {
                  CreateItemsCard(result);
                })
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

            {/* </View> */}
          </ImageBackground>
        </Modal>
        {/* </View> */}
      </TouchableOpacity>
    );
  });
  return (
    <Background>
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
            value={Weight}
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
            onPress={() =>
              handleAddItems() ||
              fetchAllDocuments("items").then((result) => {
                CreateItemsCard(result);
              })
            }
          >
            <Text style={styles.appButtonText}>אישור</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.BackButton}
            onPress={() => setModalVisible(!modalVisible) || setImage(null)}
          >
            <Image
              style={styles.BackButton_Image}
              source={require("../assets/arrow_back.png")}
            />
          </TouchableOpacity>
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
  );
}
const styles = StyleSheet.create({
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
  // InputContainer: {
  //   flex: 0.5,
  //   justifyContent: 'space-evenly'
  // },
  input: {
    width: 250,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1c6669",
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#1c6669",
    borderRadius: 10,
    paddingVertical: 10,
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
    width: 24,
    height: 24,
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
});
