import React, { useState } from "react";
/// import * as React from 'react'
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import DatePicker from "react-native-datepicker";
import DropDownPicker from "react-native-dropdown-picker";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ImageBackground,
} from "react-native";
import { ActivityIndicator, Button, List, Modal } from "react-native-paper";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { checkActionCode } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, Colors } from "../config";
import {
  fetchDropAreasSorted,
  addNewExportRecord,
  addNewWasteRecord,
} from "../config/database_interface";
import { theme } from "../core/theme";
import { getStatusBarHeight } from "react-native-status-bar-height";

// const SecondPage = ({route}) => {
//     return (
//         <View>

//         <Text>UpdateGoods{"\n"} page!!</Text>
//             <Text>{JSON.stringify(route.params.paramKey)}</Text>
//         </View>
//     )
// }
// navigationOptions = ({ navigation }) => ({
//     title: 'User: ${navigation.state.params}',
//   });
function ListItems(Data) {
  // <View style={styles.Every3Card}>
  let result = [];
  let counter = 0;
  for (let i = 0; i < Data.length; i++) {
    counter++;
    let good = (
      <View style={styles.EveryItem}>
        {/* key={Data[i].id} */}
        <Text style={styles.ItemTitle}>{Data[i].Name}</Text>
        <Text style={styles.ItemSub}>{Data[i].amount} Boxes to be added</Text>
      </View>
    );
    result[counter - 1] = good;
  }

  return result;
  //  </View>
}
function checkingReceivedData(ChangedData) {
  let result = true;
  console.log("inside checking received data!");
  ChangedData.forEach((item) => {
    console.log("if () > ()", parseInt(item.amount), parseInt(item.Storage));
    if (parseInt(item.amount) > parseInt(item.Storage)) {
      result = false;
    }
  });
  return result;
}
function isEmpty(data) {
  let result = true;
  data.forEach((item) => {
    if (parseInt(item.amount) != 0) result = false;
  });
  return result;
}
function checkMainStorage(DropsArray, Id) {
  let result = false;
  DropsArray.forEach((drop) => {
    if (drop.id == Id) {
      if (drop.isMainStorage) {
        result = true;
      }
    }
  });
  return result;
}
export default function ExportAndWaste({ navigation, route }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertTitle, setAlertTitle] = useState("שגיאה");
  const [alertContent, setAlertContent] = useState("לבחור נקודה פיזור");
  const [isAleretVisible, setIsAlertVisible] = useState(false);
  let userId = auth.currentUser.uid;
  console.log("auth.currentUser.uid", userId);

  let data = [];
  const [ChangedData, SetChangedData] = useState([
    { label: "שם", value: "name" },
    { label: "קמות", value: "amount" },
    { label: "id", value: "id" },
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const BeforeStorage = (data) => {
    console.log("BeforeStorage data", data);
    let result = false;
    data.forEach((item) => {
      // console.log("if () > ()", parseInt(item.amount), parseInt(item.Storage));
      if (parseInt(item.amount) > parseInt(item.Storage)) {
        result = true;
      }
    });
    return result;
  };

  const [mainStorageID, setMainStorageID] = useState("");
  React.useEffect(() => {
    if (route.params?.paramKey) {
      SetChangedData(route.params?.paramKey);
    }
    fetchDropAreasSorted().then((dropAreasInfo) => {
      console.log(
        "dropAreasInfo",
        dropAreasInfo,
        "route.params?.paramKey.export",
        route.params?.paramKey.export
      );
      if (BeforeStorage(route.params?.paramKey.data)) {
        setItems([{ label: "לפני הכניסה למחסן", value: "null" }]);
      } else {
        let drops = [];
        dropAreasInfo.forEach((drop) => {
          if (drop.isMainStorage === true) {
            setMainStorageID(drop.id);
          }
          if (!(route.params?.paramKey.export && drop.isMainStorage)) {

            drops.push({ label: drop.name, value: drop.id });
          }

        });  
        if (!route.params?.paramKey.export)
          drops.push({ label: "לפני הכניסה למחסן", value: "null" });
        setItems(drops);
      }
    });
  }, [route.params?.paramKey]);


  // console.log("wheeeeee3" + JSON.stringify(route.params?.paramKey));
  console.log(route.params?.paramKey);
  console.log("drops", fetchDropAreasSorted());
  data = route.params?.paramKey.data;
  let Export = route.params?.paramKey.export;
  // let date = "11-10-2001";
  if (isEmpty(data)) {
    return (
      <Background style={styles.backgroundEdit}>
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
      </Background>
    );
  } else if (Export) {
    return (
      <View style={styles.background}>
        <ImageBackground style={styles.backgroundEdit}>

          <Text style={styles.ScreenTitle}>מסך יצוא</Text>

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
                        {item.amount} ארגזים לייצוא</Text>
                      <Text style={styles.ItemSub}>סך הכל במחסן ={" "}
                        {parseInt(item.previousAmount) - parseInt(item.amount)}
                      </Text>
                    </View>
                  );
              }}
            />

          </View>
          {/* <View>
              <Button title="Open" onPress={() => setOpen(true)} />
            </View> */}
          <View style={styles.DropContainer}>
            <DropDownPicker
              style={{
                borderColor: "#1c6669",
                borderBottomWidth: 2,
              }}
              textStyle={{
                fontSize: 15,
              }}
              showTickIcon={false}
              placeholder="נקודת פיזור"
              containerStyle={styles.dropDownStyle}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
          </View>

          <Pressable
            style={styles.ButtonView}
            onPress={() => {
              console.log("value = ", value);
              if (value == null) {
                setIsAlertVisible(true);
              } else {
                setIsProcessing(() => true);
                console.log("\n\n\ninsideRun3\n\n\n");
                let AddToDB = [];
                data.forEach((item) => {
                  if (item.amount != 0) {
                    let Veg = {};
                    Veg.id = item.id;
                    Veg.amount = parseInt(item.amount);
                    AddToDB.push(Veg);
                  }
                });

                let today = new Date();
                console.log("AddToDB", AddToDB);
                let userId = auth.currentUser.uid;
                console.log("auth.currentUser.uid", userId);
                // let date = date().getDate();
                console.log("today", today);
                console.log("value", value);
                addNewExportRecord(userId, value, today, AddToDB).then(() => {
                  navigation.navigate("ManageGoods");
                });
              }
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
  } else {
    // let newDrops = [...items];
    // newDrops.push({ label: "לפני כניסה למחסן", value: null });
    // setItems(newDrops);
    return (
      <View style={styles.background}>
        <ImageBackground style={styles.backgroundEdit}>

          <Text style={styles.ScreenTitle}>מסך בזבוז</Text>

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
                        {item.amount} ארגזים
                      </Text>
                    </View>
                  );
              }}
            />
            {/* <View>
            <Button title="Open" onPress={() => setOpen(true)} />
          </View> */}
          </View>
          <View style={styles.DropContainer}>
            <DropDownPicker
              // placeholder={dropDownPlaceholder}
              style={{
                borderColor: "#1c6669",
                borderBottomWidth: 2,
              }}
              textStyle={{
                fontSize: 15,
              }}
              showTickIcon={false}
              placeholder="נקודת פיזור"
              containerStyle={styles.dropDownStyle}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
          </View>

          <Pressable
            style={styles.ButtonView}
            onPress={() => {
              if (value === null) {
                setIsAlertVisible(true);
              } else {
                setIsProcessing(() => true);
                console.log("\n\n\ninsideRun4 == waste\n\n\n");
                let AddToDB = [];
                data.forEach((item) => {
                  if (item.amount != 0) {
                    let Veg = {};
                    Veg.id = item.id;
                    Veg.amount = parseInt(item.amount);
                    AddToDB.push(Veg);
                  }
                });
                // let update = {};
                let today = new Date();
                console.log("AddToDB", AddToDB);
                let userId = auth.currentUser.uid;
                console.log("auth.currentUser.uid", userId);
                // let date = date().getDate();
                console.log("today", today);
                console.log("value", value);
                console.log("value === mainStorageID", value === mainStorageID, value, mainStorageID);
                // addNewExportRecord(userId, value, today, AddToDB);

                addNewWasteRecord(userId, value, new Date(), AddToDB, value === mainStorageID ? true : false).then(
                  () => {
                    navigation.navigate("ManageGoods");
                  }
                );
              }
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
    // borderBottomWidth: 2,
  },
  datePickerStyle: {
    alignSelf: "center",
    width: "75%",
    // marginTop: 10,
    // borderColor: "black",
    borderColor: "#575757",
    borderBottomWidth: 2,
  },
  dropDownStyle: {
    // borderTopWidth: 2,
    marginTop: 4,
    width: "95%",
    alignSelf: "center",
  },
  DropContainer: {
    width: "100%",
    borderTopWidth: 2,
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
  //   // marginTop: "20%",
  //   width: "100%",
  //   // height:"90%",
  // },
  ItemTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ItemSub: {
    marginBottom: 0,
  },
  ButtonView: {
    marginTop: 5,
    width: "100%",
    height: "8%",
    borderColor: "#006d77",
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
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: getStatusBarHeight() + 10,
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
});
