import React, { useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useIsFocused } from "@react-navigation/native";
import { fetchAllDocuments, fetchDropAreasSorted } from "../config/database_interface";
import OurActivityIndicator from "../components/OurActivityIndicator";
import { theme } from "../core/theme";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export default function ManageDropArea({ navigation, route }) {

  const [isLoading, setIsLoading] = useState(true);

  const [fullDropAreasInfo, setFullDropAreasInfo] = useState([]);

  const [dropAreasInfo, setDropAreasInfo] = useState([]);

  const updateListBySearch = (searchString) => {

    searchString = searchString.toLowerCase().trim();

    setDropAreasInfo([]);

    if (searchString === "") {
      setDropAreasInfo(() => [...fullDropAreasInfo]);
      return;
    }

    let searcheableFileds = ["name", "hoodName", "address"];
    let newDropAresList = [];

    fullDropAreasInfo.forEach((currDropAreaInfoObj) => {

      for (let i = 0; i < searcheableFileds.length; i++) {

        if ((currDropAreaInfoObj[searcheableFileds[i]]).toLowerCase().includes(searchString)) {

          newDropAresList.push(currDropAreaInfoObj);
          break;
        }
      }

    });

    setDropAreasInfo(() => newDropAresList);

  };


  const fetchAllDropAreasDocuments = async () => {

    setFullDropAreasInfo([]);
    setDropAreasInfo([]);

    const dropAreasList = await fetchDropAreasSorted();

    let dropAreasWithoutMainStorage = [];

    dropAreasList.forEach((currDropArea) => {

      if(!currDropArea.isMainStorage){
        dropAreasWithoutMainStorage.push(currDropArea);
      }
    });

    setFullDropAreasInfo(() => [...dropAreasWithoutMainStorage]);
    setDropAreasInfo(() => [...dropAreasWithoutMainStorage]);
  };

  React.useEffect(() => {
    fetchAllDropAreasDocuments().then(() => {

      setIsLoading(() => false);

    });
  }, []);

  React.useEffect(() => {
    if (route.params?.status) {

      console.log(route.params);

      let status = route.params?.status;

      switch (status) {

        case "updated":
          let updatedDropAreaInfo = route.params?.tempDropAreaInfo;;
          fullDropAreasInfo.splice(getDropAreaItemIndex(updatedDropAreaInfo.id), 1, updatedDropAreaInfo);
          setFullDropAreasInfo(() => fullDropAreasInfo);
          console.log("Updated");
          updateListBySearch("");
          navigation.setParams({ status: "none" });
          break;

        case "created":
          let newDropAreaInfo = route.params?.tempDropAreaInfo;
          fullDropAreasInfo.push(newDropAreaInfo);
          setFullDropAreasInfo(() => fullDropAreasInfo);
          updateListBySearch("");
          console.log("Created");
          navigation.setParams({ status: "none" });
          break;

        case "deleted":
          fullDropAreasInfo.splice(getDropAreaItemIndex(route.params?.dropAreaID), 1);
          setFullDropAreasInfo(() => fullDropAreasInfo);
          console.log("deleted");
          navigation.setParams({ status: "none" });
          updateListBySearch("");
          break;

        case "none":
          break;
      }

    }

  }, [route.params?.status]);


  const getDropAreaItemIndex = (dropAreaID) => {

    for (let currIndex = 0; currIndex < fullDropAreasInfo.length; currIndex++) {

      if (fullDropAreasInfo[currIndex].id === dropAreaID) {

        return currIndex;
      }
    }

    return -1;
  }

  const getListRenderItem = (item) => {

    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.dropAreaCardContainer} onLongPress={() => navigation.navigate({ name: "AddDropArea", params: { tempDropAreaInfo: fullDropAreasInfo[getDropAreaItemIndex(item.id)], isForEdit: true }, merge: true })}>

        <View style={styles.dropAreaInfoContainer}>

          <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>שם הנקודה: </Text>{item.name}</Text>
          <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>שם השכונה: </Text>{item.hoodName}</Text>
          { item.address !== "" && <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>כתובת הנקודה: </Text>{item.address}</Text>}

        </View>

      </TouchableOpacity>
    );
  }

  return (

    <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>

      {isLoading && <OurActivityIndicator />}

      <BackButton goBack={navigation.goBack} />

      <View style={styles.searchAndListContainer}>

        <TextInput style={styles.infoTextInputStyle} onChangeText={(searchString) => { updateListBySearch(searchString) }} placeholder="חיפוש"></TextInput>

        <FlatList keyExtractor={(item, index) => index} showsVerticalScrollIndicator={false} style={styles.flatListStyle} data={dropAreasInfo} renderItem={({ item }) => { return getListRenderItem(item) }} />

      </View>

      <View style={styles.addButtonStyle}><TouchableOpacity style={styles.toucheableAddBStyle} onPress={() => navigation.navigate({ name: "AddDropArea", params: { isForEdit: false }, merge: true })}><Text style={styles.addButtonTextStyle}>+</Text></TouchableOpacity></View>


    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
    flex: 1,
    paddingLeft: 7,
    paddingRight: 7,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flatListStyle: {

    width: "100%",
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

  dropAreaCardContainer: {

    flexDirection: "row-reverse",
    borderColor: "#1c6669",
    borderWidth: 3,
    padding: 5,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: 'center',
    marginBottom: 5,
  },

  dropAreaInfoContainer: {
    alignItems: "flex-end",
    width: "100%",
    padding: 10
  },

  infoTitleTextStyle: {

    fontSize: 20,
    fontWeight: "bold",
    direction: "rtl",
    textAlign: "right"
  },

  infoTextStyle: {
    fontSize: 18,
    direction: "rtl",
    textAlign: "right"
  },

  searchAndListContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: getStatusBarHeight() + 24,
  },

  infoTextInputStyle: {
    marginBottom: 10,
    fontSize: 20,
    textAlign: "center",
    minWidth: "75%",
    borderColor: "#1c6669",
    borderBottomWidth: 2,
    padding: 7
  },

});




