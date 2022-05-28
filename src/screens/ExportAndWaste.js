import React, { useState } from "react";
/// import * as React from 'react'
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import DatePicker from "react-native-datepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Button, List } from "react-native-paper";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { checkActionCode } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../config";
import {
  fetchDropAreasSorted,
  addNewExportRecord,
  addNewWasteRecord,
} from "../config/database_interface";

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
  let userId = auth.currentUser.uid;
  console.log("auth.currentUser.uid", userId);

  const showAlert = () => {
    Alert.alert("הנתונים הולכים להישמר");
    navigation.navigate("ManageGoods");
  };
  let data = [];
  const [ChangedData, SetChangedData] = useState([
    { label: "שם", value: "name" },
    { label: "קמות", value: "amount" },
    { label: "id", value: "id" },
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  React.useEffect(() => {
    if (route.params?.paramKey) {
      SetChangedData(route.params?.paramKey);
    }
    fetchDropAreasSorted().then((dropAreasInfo) => {
      console.log("dropAreasInfo", dropAreasInfo);
      let drops = [];
      dropAreasInfo.forEach((drop) => {
        drops.push({ label: drop.name, value: drop.id });
      });
      setItems(drops);
    });
  }, [route.params?.paramKey]);
  // console.log("wheeeeee3" + JSON.stringify(route.params?.paramKey));
  console.log(route.params?.paramKey);
  console.log("drops", fetchDropAreasSorted());
  data = route.params?.paramKey.data;
  let Export = route.params?.paramKey.export;
  // let date = "11-10-2001";

  if (Export) {
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
    } else
      return (
        <Background style={styles.backgroundEdit}>
          <BackButton goBack={navigation.goBack} />
          <View>
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
                        {item.amount} ארגזים לייצוא{"\n"}סך הכל במחסן ={" "}
                        {parseInt(item.previousAmount) - parseInt(item.amount)}
                      </Text>
                    </View>
                  );
              }}
            />
            <View>
              <Button title="Open" onPress={() => setOpen(true)} />
            </View>
            <View>
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
          </View>
          <Pressable
            style={styles.ButtonView}
            onPress={() => {
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
              addNewExportRecord(userId, value, today, AddToDB);
              Alert.alert("הנתונים הולכים להישמר");
              navigation.navigate("ManageGoods");
            }}
          >
            <Text style={styles.SavingButton}>שמור נתונים</Text>
          </Pressable>
        </Background>
      );
  } else {
    return (
      <Background style={styles.backgroundEdit}>
        <BackButton goBack={navigation.goBack} />
        <View>
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
                      {item.amount} ארגזים לעדכן בענן
                    </Text>
                  </View>
                );
            }}
          />
          <View>
            <Button title="Open" onPress={() => setOpen(true)} />
          </View>
          <View>
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
        </View>
        <Pressable
          style={styles.ButtonView}
          onPress={() => {
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
            // addNewExportRecord(userId, value, today, AddToDB);
            addNewWasteRecord(userId, value, new Date(), AddToDB);
            Alert.alert("הנתונים הולכים להישמר");
            navigation.navigate("ManageGoods");
          }}
        >
          <Text style={styles.SavingButton}>שמור נתונים</Text>
        </Pressable>
      </Background>
    );
  }
}
const styles = StyleSheet.create({
  backgroundEdit: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: "column",
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
    marginTop: 20,
    width: "75%",
    alignSelf: "center",
  },
  EveryItem: {
    alignSelf: "center",
    // alignItems:"center",
    width: "100%",
    borderWidth: 2,
    marginBottom: 8,
    paddingLeft: 35,
    paddingTop: 5,
    paddingRight: 35,
    paddingBottom: 5,
    borderRadius: 5,
    backgroundColor: "#f3f3f3",
  },
  ListStyle: {
    alignSelf: "center",
    marginTop: "20%",
    width: "100%",
    // height:"90%",
  },
  ItemTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ButtonView: {
    width: "100%",
    height: "10%",
    borderWidth: 2,
    color: "black",
    // marginBottom:2
  },
  SavingButton: {
    alignSelf: "center",
    // elevation: 8,
    backgroundColor: "#cdcccc",
    textAlign: "center",
    // borderRadius: 10,
    fontSize: 25,
    width: "100%",
    color: "black",
    // marginBottom:2
    // paddingVertical: 10,
    // paddingHorizontal: 12,
  },
});
