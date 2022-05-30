import React, { useState } from "react";
/// import * as React from 'react'
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Button, List, Modal } from "react-native-paper";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { checkActionCode } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, Colors } from "../config";
import { theme } from "../core/theme";

import {
  addNewImportRecord,
  addNewDeleteRecord,
} from "../config/database_interface";
function isEmpty(data) {
  let result = true;
  data.forEach((item) => {
    console.log("itemamount = ", item.amount);
    if (parseInt(item.amount) != 0) result = false;
  });
  return result;
}

export default function UpdateGoods({ navigation, route }) {
  const [isProcessing, setIsProcessing] = useState(false);
  // const showAlert = () => {
  //   Alert.alert("הנתונים הולכים להישמר");
  //   navigation.navigate("ManageGoods");
  // };
  let data = [];
  const [ChangedData, SetChangedData] = useState([
    { label: "שם", value: "name" },
    { label: "קמות", value: "amount" },
    { label: "id", value: "id" },
  ]);
  React.useEffect(() => {
    console.log("\n---------\nhellowowwowowow\n---------");
    if (route.params?.paramKey) {
      SetChangedData(route.params?.paramKey);
      // console.log("\nwheeeeee5" + JSON.stringify(route.params?.paramKey));
    }
  }, [route.params?.paramKey]);
  // console.log("\nwheeee32ee3" + JSON.stringify(route.params?.paramKey));
  data = route.params?.paramKey.data;
  let add = route.params?.paramKey.add;
  if (isEmpty(data)) {
    return (
      <ImageBackground style={styles.backgroundEdit}>
        <SafeAreaView>
          <Text style={styles.ScreenTitle}>עדכון מחסן</Text>
        </SafeAreaView>
        <BackButton goBack={navigation.goBack} />
        <View>
          <Text
            style={{
              fontSize: 20,
            }}
          >
            אין נתונים!
          </Text>
        </View>
      </ImageBackground>
    );
  } else if (add) {
    return (
      <View style={styles.background}>
        <ImageBackground style={styles.backgroundEdit}>
          <SafeAreaView>
            <Text style={styles.ScreenTitle}>עדכון מחסן</Text>
          </SafeAreaView>
          <BackButton goBack={navigation.goBack} />
          <View style={styles.Container}>
            {/* <Text>{ListItems(route.params?.paramKey)}</Text> */}
            <FlatList
              style={styles.ListStyle}
              data={data}
              renderItem={({ item }) => {
                if (item.amount != 0)
                  return (
                    <View style={styles.EveryItem}>
                      <Text style={styles.ItemTitle}>{item.Name}</Text>
                      <Text style={styles.ItemSub}>
                        {parseInt(item.amount)} ארגזים להוסיף למחסן
                      </Text>
                      <Text style={styles.ItemSub}>
                        סך הכל ={" "}
                        {parseInt(item.amount) + parseInt(item.previousAmount)}
                      </Text>
                    </View>
                  );
              }}
            />
          </View>
          <Pressable
            style={styles.ButtonView}
            onPress={() => {
              setIsProcessing(() => true);
              console.log("\n\n\ninsideRun\n\n\n");
              console.log(isProcessing);
              let AddToDB = [];
              let today = new Date();
              data.forEach((item) => {
                if (item.amount != 0) {
                  let Veg = {};
                  Veg.id = item.id;
                  Veg.amount = parseInt(item.amount);
                  AddToDB.push(Veg);
                }
              });
              console.log("AddToDB", AddToDB);
              let userId = auth.currentUser.uid;
              console.log("auth.currentUser.uid", userId);
              console.log("today", today);
              addNewImportRecord(userId, today, AddToDB).then(() => {
                navigation.navigate("ManageGoods");
              });
              // Alert.alert("הנתונים הולכים להישמר");
            }}
          >
            <Text style={styles.SavingButton}>שמור נתונים</Text>
          </Pressable>
        </ImageBackground>
        <Modal visible={isProcessing}>
          <View style={styles.processingAlertContainer}>
            <View style={styles.processingAlertContentContainer}>
              <Text style={styles.processingAlertTextStyle}>
                הפעולה מתבצעת ...
              </Text>

              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (
      <View style={styles.background}>
        <ImageBackground style={styles.backgroundEdit}>
          <SafeAreaView>
            <Text style={styles.ScreenTitle}>עדכון מחסן</Text>
          </SafeAreaView>
          <BackButton goBack={navigation.goBack} />
          <View style={styles.Container}>
            {/* <Text>{ListItems(route.params?.paramKey)}</Text> */}
            <FlatList
              style={styles.ListStyle}
              data={data}
              renderItem={({ item }) => {
                if (item.amount != 0)
                  return (
                    <View style={styles.EveryItem}>
                      <Text style={styles.ItemTitle}>{item.Name}</Text>
                      <Text style={styles.ItemSub}>
                        {parseInt(item.amount)} ארגזים להוסיר ממחסן
                        {"\n"}סך הכל ={" "}
                        {parseInt(item.previousAmount) - parseInt(item.amount)}
                      </Text>
                    </View>
                  );
              }}
            />
          </View>
          <Pressable
            style={styles.ButtonView}
            onPress={() => {
              setIsProcessing(true);
              console.log("\n\n\ninsideRun2 removing from Storage \n\n\n");
              let SubToDB = [];
              let today = new Date();
              data.forEach((item) => {
                if (item.amount != 0) {
                  let Veg = {};
                  Veg.id = item.id;
                  Veg.amount = parseInt(item.amount);
                  SubToDB.push(Veg);
                }
              });
              console.log("SubToDB", SubToDB);
              let userId = auth.currentUser.uid;
              console.log("auth.currentUser.uid", userId);
              console.log("today", today);
              addNewDeleteRecord(userId, today, SubToDB).then(() => {
                navigation.navigate("ManageGoods");
              });
            }}
          >
            <Text style={styles.SavingButton}>שמור נתונים</Text>
          </Pressable>
        </ImageBackground>
        <Modal visible={isProcessing}>
          <View style={styles.processingAlertContainer}>
            <View style={styles.processingAlertContentContainer}>
              <Text style={styles.processingAlertTextStyle}>
                הפעולה מתבצעת ...
              </Text>

              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface,
  },
  backgroundEdit: {
    height: "100%",
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: "column",
  },
  ListStyle: {
    height: 100,
  },
  Container: {
    // marginTop: "25%",
    flex: 20,
    // // justifyContent: "space-between",
    // backgroundColor: "#fff",
    padding: 5,
    paddingBottom: 0,
    margin: 0,
    width: "100%",
    height: "100%",
  },
  EveryItem: {
    flex: 1,
    // backgroundColor: "#a4dbc3",
    alignItems: "center",
    alignSelf: "center",
    // justifyContent: "center",
    justifyContent: "space-between",
    // flexDirection: "row",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#006d77",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginTop: 5,
    width: "100%",
    height: "10%",
  },
  // ListStyle: {
  //   alignSelf: "center",
  //   marginTop: "20%",
  //   width: "100%",
  //   // height: "90%",
  // },
  ItemTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ButtonView: {
    marginTop: 5,
    width: "100%",
    height: "8%",
    borderColor: "black",
    borderTopWidth: 2,
    color: "black",
    // marginBottom:2
  },
  SavingButton: {
    textAlignVertical: "center",
    alignSelf: "center",
    // elevation: 8,
    backgroundColor: "#006d77",
    textAlign: "center",
    // borderRadius: 10,
    fontSize: 25,
    width: "100%",
    height: "100%",
    color: "white",
    // marginBottom:2
    // paddingVertical: 10,
    // paddingHorizontal: 12,
  },
  ScreenTitle: {
    // borderWidth: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
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
