import React, { useState } from "react";
import { fetchItemsSorted } from "../config/database_interface";
/// import * as React from 'react'
import Background from "../components/Background";

import {
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  TextInput,
  View,
  Text,
  FlatList,
  Pressable,
  Keyboard,
  ImageBackground,
  Alert,
} from "react-native";
import { Button, Card, List, Modal } from "react-native-paper";
import BackButton from "../components/BackButton";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../core/theme";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
const Goods = [
  {
    Name: "פלפל",
    Storage: 4,
    BoxWeight: "3",
    Pic: require("../assets/peper.png"),
    id: "1",
  },
  {
    Name: "עגבניה",
    Storage: 9,
    BoxWeight: "2",
    Pic: require("../assets/tomato.png"),
    id: "2",
  },
  {
    Name: "מלפפון",
    Storage: 7,
    BoxWeight: "3",
    Pic: require("../assets/cucumber.png"),
    id: "3",
  },
  {
    Name: "בצל",
    Storage: 2,
    BoxWeight: "2",
    Pic: require("../assets/onion.png"),
    id: "4",
  },
  {
    Name: "Watermelon",
    Storage: 4,
    BoxWeight: "2",
    Pic: require("../assets/watermelon.png"),
    id: "5",
  },
  {
    Name: "Potato",
    Storage: 5,
    BoxWeight: "3",
    Pic: require("../assets/potato.png"),
    id: "6",
  },
  {
    Name: "Grapes",
    Storage: 3,
    BoxWeight: "2",
    Pic: require("../assets/grapes.png"),
    id: "7",
  },
  {
    Name: "Peper",
    Storage: 4,
    BoxWeight: "3",
    Pic: require("../assets/peper.png"),
    id: "8",
  },
  {
    Name: "Tomato",
    Storage: 9,
    BoxWeight: "2",
    Pic: require("../assets/tomato.png"),
    id: "9",
  },
  {
    Name: "Cucamber",
    Storage: 7,
    BoxWeight: "3",
    Pic: require("../assets/cucumber.png"),
    id: "10",
  },
  {
    Name: "Onion",
    Storage: 2,
    BoxWeight: "2",
    Pic: require("../assets/onion.png"),
    id: "11",
  },
  {
    Name: "Watermelon",
    Storage: 4,
    BoxWeight: "2",
    Pic: require("../assets/watermelon.png"),
    id: "12",
  },
  {
    Name: "Potato",
    Storage: 5,
    BoxWeight: "3",
    Pic: require("../assets/potato.png"),
    id: "13",
  },
];
// const [ChangedData, SetChangedData] = useState([]);
// let tempText = "";
function checkingReceivedData(ChangedData, checkMinus) {
  console.log("inside checking received data!");
  let result = true;
  if (checkMinus) {
    ChangedData.forEach((item) => {
      // console.log("if () > ()", parseInt(item.amount), parseInt(item.Storage));
      if (parseInt(item.amount) > parseInt(item.Storage)) {
        result = false;
      }
    });
  }
  ChangedData.forEach((item) => {
    if (isNaN(parseInt(item.amount))) {
      result = false;
    }
  });
  return result;
}
export default function ManageGoods({ navigation }) {
  const [alertTitle, setAlertTitle] = useState("שגיאה");
  const [alertContent, setAlertContent] = useState("קרתה שגיאה");
  const [isAleretVisible, setIsAlertVisible] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  let itemsArray;
  // console.log("itemsArray =====!!!!!!======", itemsArray);
  const [ChangedData, SetChangedData] = React.useState([]);
  let tmp = [];
  let firstTime = true;
  const updateChangedData = () => {
    SetChangedData([]);
    // console.log("IMINSIDE updateChangedData FUNCTION");
    let counter = 0;
    itemsArray.forEach((item) => {
      counter++;
      let data = {};
      data.Pic = item.image;
      data.id = item.id;
      data.amount = 0;
      data.Name = item.name;
      data.Storage = item.current_amount;
      data.previousAmount = item.current_amount;
      data.BoxWeight = item.average_weight;
      tmp[tmp.length] = data;
    });
    SetChangedData(() => [...tmp]);
    firstTime = false;
    console.log("changedData =======updateChangedData======", ChangedData);
  };
  const updateChangedDataByAmount = (items) => {
    console.log(
      "changedData ======updateChangedDataByAmount======",
      ChangedData,
      "items ======updateChangedDataByAmount======",
      items
    );
    // console.log("items updateChangedDataByAmount", items);
    ChangedData.forEach((x) => {
      items.forEach((y) => {
        if (x.id === y.id) {
          x.amount = y.amount;
        }
      });
    });
    SetChangedData(() => ChangedData);
  };
  React.useEffect(() => {
    const willFocusSubscription = navigation.addListener("focus", () => {
      fetchItemsSorted().then((items) => {
        itemsArray = items;
        if (firstTime) updateChangedData();
        else {
          console.log(" inside else", items);
          updateChangedDataByAmount(itemsArray);
        }
        console.log(
          "changedData ======Inside useEffectLisener======",
          ChangedData
        );
      });
    });
    return willFocusSubscription;
  });
  const Cards = ChangedData.map((item) => {
    // ChangedData.forEach((item) => renderItem(item))
    return (
      // <View style={styles.Every3Card}>
      <View style={styles.EveryCard} key={item.id}>
        <Image style={styles.avatar} source={{ uri: item.Pic }} />
        <View style={styles.AllText}>
          <Text style={styles.cardTitle}>{item.Name}</Text>
          <Text style={styles.cardSubTitle}>
            {item.Storage} ארגזים במחסן {"\n"} משקל {item.BoxWeight} ק"ג
          </Text>
        </View>
        <TextInput
          style={styles.input}
          // onChangeText={(text) => SetChangedData(ChangedData => ChangedData.filter(id == item.id) => value= text)}
          onChangeText={(text) => {
            item.amount = text;
          }}
          keyboardType="numeric"
          placeholder={"0"}
        />
      </View>
    );
  });
  console.log("changed data before rendering!", ChangedData);
  return (
    <View style={styles.background}>
      <ImageBackground
        source={require("../assets/background_dot.png")}
        resizeMode="repeat"
        style={styles.background}
      >
        <BackButton goBack={navigation.goBack} />
        <SafeAreaView>
          <Text style={styles.ScreenTitle}>ניהול סחורות</Text>
        </SafeAreaView>
        <View style={styles.Container} keyboardShouldPersistTaps="handled">
          <ScrollView>
            {Cards}
            {/* {ChangedData.map((item) => {
              // ChangedData.forEach((item) => renderItem(item))
              return (
                // <View style={styles.Every3Card}>
                <View style={styles.EveryCard} key={item.id}>
                  <Image style={styles.avatar} source={{ uri: item.Pic }} />
                  <View style={styles.AllText}>
                    <Text style={styles.cardTitle}>{item.Name}</Text>
                    <Text style={styles.cardSubTitle}>
                      {item.Storage} ארגזים במחסן {"\n"} משקל {item.BoxWeight}{" "}
                      ק"ג
                    </Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    // onChangeText={(text) => SetChangedData(ChangedData => ChangedData.filter(id == item.id) => value= text)}
                    onChangeText={(text) => {
                      item.amount = text;
                    }}
                    keyboardType="numeric"
                    placeholder={"0"}
                  />
                </View>
              );
            })} */}
          </ScrollView>
        </View>
        <View style={styles.BottomButtons}>
          <Pressable
            style={styles.bottomView}
            onPress={() => {
              if (checkingReceivedData(ChangedData, false)) {
                navigation.navigate("UpdateGoods", {
                  paramKey: { data: ChangedData, add: true },
                });
              } else {
                setIsAlertVisible(true);
              }
            }}
          >
            <Text style={styles.bottomText2}>+</Text>
          </Pressable>
          <Pressable
            style={styles.bottomView}
            onPress={() => {
              if (checkingReceivedData(ChangedData, true)) {
                navigation.navigate("UpdateGoods", {
                  paramKey: { data: ChangedData, add: false },
                });
              } else {
                setIsAlertVisible(true);
              }
            }}
          >
            <Text style={styles.bottomText2}>-</Text>
          </Pressable>
          <Pressable style={styles.bottomView}>
            <Text
              style={styles.bottomText}
              onPress={() => {
                if (checkingReceivedData(ChangedData, true)) {
                  navigation.navigate("ExportAndWaste", {
                    paramKey: { data: ChangedData, export: true },
                  });
                } else setIsAlertVisible(true);
              }}
            >
              יצוא
            </Text>
          </Pressable>
          <Pressable style={styles.bottomView}>
            <Text
              style={styles.bottomText}
              onPress={() =>
                navigation.navigate("ExportAndWaste", {
                  paramKey: { data: ChangedData, export: false },
                })
              }
            >
              בזבוז
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
      <Modal visible={isAleretVisible}>
        <View style={styles.alertContainer}>
          <View style={styles.alertContentContainer}>
            <Text style={styles.alertTitleTextStyle}>{alertTitle}</Text>

            <Text style={styles.alertContentText}>{alertContent}</Text>

            <TouchableOpacity
              style={styles.alertCloseButtonStyle}
              onPress={() => setIsAlertVisible(false)}
            >
              <Text style={styles.alertButtonTextStyle}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface,
  },
  // background: {
  //   flex: 1,
  //   width: "100%",
  //   // backgroundColor: "#277650",
  // },

  backgroundEdit: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: "column",
  },
  avatar: {
    marginLeft: 12,
    alignSelf: "center",
    flex: 1,
    justifyContent: "flex-start",
    resizeMode: "contain",
    // width: "10%",
    // height: "10%",
    aspectRatio: 1,
  },
  input: {
    flex: 1.25,
    // width: 50,
    height: 25,
    backgroundColor: "#b6ffbf",
    marginRight: 7,
    marginLeft: 7,
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    textAlign: "center",
    // bottom : 0,
  },
  Container: {
    // marginTop: "25%",
    flex: 1,
    // // justifyContent: "space-between",
    // backgroundColor: "#fff",
    padding: 5,
    paddingBottom: 0,
    margin: 0,
    width: "100%",
  },
  BottomButtons: {
    backgroundColor: "#a4dbc3",
    borderTopWidth: 5,
    // borderTopLeftRadius: 3,
    // borderTopRightRadius: 3,
    // borderBottomLeftRadius: 3,
    // borderBottomRightRadius: 3,
    padding: 0,
    marginTop: 0,
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    bottom: 0,
  },
  bottomView: {
    // borderRightWidth:1,
    // borderLeftWidth:1,
    // height: "100%",
    alignSelf: "center",
    alignItems: "center",
    fontSize: 16,
    width: "23%",
    // marginTop: 10,
    color: "green",
  },
  bottomText: {
    alignSelf: "center",
    fontSize: 16,
    // width:"30%",
    color: "green",
    fontWeight: "bold",
  },
  bottomText2: {
    alignSelf: "center",
    fontSize: 24,
    // width:"30%",
    color: "green",
    fontWeight: "bold",
  },
  FlatListStyle: {
    width: "100%",
    // padding:0,
  },
  EveryCard: {
    backgroundColor: "#a4dbc3",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#5A7F6F",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 5,
    width: "100%",
  },
  AllText: {
    alignSelf: "center",
    alignContent: "center",
    textAlign: "center",
    flex: 7,
    marginLeft: 8,
    marginRight: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  cardSubTitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#444444",
  },
  ScreenTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
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
    padding: 10,
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
    paddingRight: 8,
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
  },

  processingAlertContentContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 3,
    borderColor: "#1c6669",
  },

  processingAlertTextStyle: {
    fontSize: 20,
    marginRight: 15,
  },
});
