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
  RefreshControl,
  ScrollView,
} from "react-native";
import { Button, Card, List, Modal } from "react-native-paper";
import BackButton from "../components/BackButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../core/theme";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getStatusBarHeight } from "react-native-status-bar-height";
import OurActivityIndicator from "../components/OurActivityIndicator";
export default function ManageGoods({ navigation }) {
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  // const App = () => {
  //   const [refreshing, setRefreshing] = React.useState(false);
  //   const onRefresh = React.useCallback(() => {
  //     setRefreshing(true);
  //     wait(2000).then(() => setRefreshing(false));
  //   }, []);
  // };
  const [refreshing, setRefreshing] = React.useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait().then(() => {
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
        setRefreshing(false);
        setIsLoading(false);
      });
    }, []);
  });
  const [alertTitle, setAlertTitle] = useState("שגיאה");
  const [alertContent, setAlertContent] = useState("קרתה שגיאה");
  const [isAleretVisible, setIsAlertVisible] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const isEmpty = (data) => {
    let result = true;
    data.forEach((item) => {
      if (parseInt(item.amount) != 0) result = false;
    });
    if (result == true) setAlertContent(() => "אין נתונים");
    return result;
  };
  const checkingReceivedData2 = (ChangedData, checkMinus) => {
    console.log("inside checking received data!");
    let result = true;
    result = !isEmpty(ChangedData);

    if (checkMinus) {
      ChangedData.forEach((item) => {
        // console.log("if () > ()", parseInt(item.amount), parseInt(item.Storage));
        if (parseInt(item.amount) > parseInt(item.Storage)) {
          setAlertContent(() => "* אין מספיק סחורות");
          result = false;
        }
      });
    }
    ChangedData.forEach((item) => {
      if (isNaN(parseInt(item.amount)) || parseInt(item.amount) < 0) {
        setAlertContent(() => "* נא לכתוב רק מספרים חיוביים");
        result = false;
      }
    });
    return result;
  };
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
      setIsLoading(true);
      wait(600).then(() => {
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
          setRefreshing(false);
          setIsLoading(false);
        });
      });
    });
    return willFocusSubscription;
  });
  const Cards = ChangedData.map((item) => {
    // ChangedData.forEach((item) => renderItem(item))
    return (
      // <View style={styles.Every3Card}>
      <View style={styles.EveryCard} key={item.id}>
        <Image  style={styles.avatar} source={{ uri: item.Pic }} />
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

        {isLoading && <OurActivityIndicator/>}

        <Text style={styles.ScreenTitle}>ניהול סחורות</Text>

        <View style={styles.Container} keyboardShouldPersistTaps="handled">
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {Cards}
          </ScrollView>
        </View>
        <View style={styles.BottomButtons}>
          <Pressable
            style={styles.bottomView}
            onPress={() => {
              if (checkingReceivedData2(ChangedData, false)) {
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
              if (checkingReceivedData2(ChangedData, true)) {
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
                if (checkingReceivedData2(ChangedData, true)) {
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
              onPress={() => {
                if (checkingReceivedData2(ChangedData, false)) {
                  navigation.navigate("ExportAndWaste", {
                    paramKey: { data: ChangedData, export: false },
                  });
                } else setIsAlertVisible(true);
              }}
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
    borderColor: "#006d77",
    borderWidth: 1,
    padding: 0,
    marginLeft: 12,
    alignSelf: "center",
    // flex: 3,
    // justifyContent: "flex-start",
   
    width: 80,
    height: 70,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 3,
    // aspectRatio: 1,
  },
  input: {
    flex: 1.25,
    // width: 50,
    height: 30,
    backgroundColor: "#efefef",
    marginRight: 12,
    marginLeft: 12,
    borderWidth: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    textAlign: "center",
    borderColor: "#006d77",
    // bottom : 0,
  },
  Container: {
    // marginTop: "25%",
    flex: 1,
    // // justifyContent: "space-between",
    // backgroundColor: "#fff",
    padding: 5,
    paddingBottom: 0,
    marginBottom: 0,
    width: "100%",
  },
  BottomButtons: {
    backgroundColor: "white",
    borderTopWidth: 4,
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
    borderColor: "#006d77",
  },
  bottomView: {
    // display: "flex",
    justifyContent: "center",
    // borderRightWidth:1,
    // borderLeftWidth:1,
    // height: "100%",
    alignSelf: "center",
    alignItems: "center",
    fontSize: 16,
    width: "23%",
    // marginTop: 10,
    // color: "green",
    borderColor: "#006d77",
    // borderLeftWidth: 3,
    // borderRightWidth: 3,
    // borderEndWidth: 5,
    // borderStartWidth: 5,
    height: "100%",
  },
  bottomText: {
    alignSelf: "center",
    fontSize: 33,
    color: "#006d77",
    // textShadowColor: "rgba(0, 0, 0, 0.2)",
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 10,
    // width:"30%",
    // color: "green",
    // borderColor: "#006d77",
    // borderWidth: 2,
    fontWeight: "bold",
    fontSize: 20,
  },
  bottomText2: {
    alignSelf: "center",
    fontSize: 33,
    color: "#006d77",
    // textShadowColor: "rgba(0, 0, 0, 0.2)",
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 10,
    // width:"30%",
    // color: "green",
    // borderColor: "#006d77",
    // borderWidth: 2,
    fontWeight: "bold",
  },
  FlatListStyle: {
    width: "100%",
    // padding:0,
  },
  EveryCard: {
    backgroundColor: "white",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#006d77",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
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
    marginTop: getStatusBarHeight() + 10,
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
  dropAreaInfoContainer: {
    alignItems: "flex-end",
    width: "100%",
    padding: 10,
  },

  infoTitleTextStyle: {
    fontSize: 20,
    fontWeight: "bold",
    direction: "rtl",
    textAlign: "right",
  },

  infoTextStyle: {
    fontSize: 18,
    direction: "rtl",
    textAlign: "right",
  },
});
