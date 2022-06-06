import React, { useState } from "react";
import {Image, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import BackButton from "../components/BackButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { setStatusBarStyle } from "expo-status-bar";
import { fetchDocumentById, fetchUsersSorted } from "../config/database_interface";
import { auth } from "../config";
import { theme } from "../core/theme";
import OurActivityIndicator from "../components/OurActivityIndicator";


export default function ManageVolunteers({ navigation, route }) {

  setStatusBarStyle("dark");

  // initializing the needed variables/useStates
  const profileDefaultImageUri = Image.resolveAssetSource(require("../assets/profile_default_image.png")).uri;

  const [isLoading, setIsLoading] = useState(true);

  const [fullVolunteersInfo, setFullVolunteersInfo] = useState([]);

  let [volunteeresInfo, setVolunteeresInfo] = useState([{ volunteerFullName: "אבו גמל מעאד", volunteerID: "207535311", volunteerEmail: "Muathsoftware@gmail.com", volunteerPhoneNumber: "0585333193", volunteerType: "מתנדב", volunteerImageUri: Image.resolveAssetSource(require("../assets/avatar.png")).uri }])

  const [currUserInfo, setCurrUserInfo] = useState();

  // This function receives a searcing string and it fills the display list with the suitable items from the fullItemslist
  const updateListBySearch = (searchString) => {

    searchString = searchString.toLowerCase().trim();

    setVolunteeresInfo(() => []);

    if (searchString === "") {
      setVolunteeresInfo(() => [...fullVolunteersInfo]);
      return;
    }

    let searcheableFileds = ["name", "personalID", "phoneNumber", "email"];
    let newVolunteersList = [];

    fullVolunteersInfo.forEach((currVolunterInfoObj) => {

      for (let i = 0; i < searcheableFileds.length; i++) {

        if ((currVolunterInfoObj[searcheableFileds[i]]).toLowerCase().includes(searchString)) {

          newVolunteersList.push(currVolunterInfoObj);
          break;
        }
      }

      if(getUserRankString(currVolunterInfoObj.rank).toLowerCase().includes(searchString)){
        newVolunteersList.push(currVolunterInfoObj);
      }

    });

    setVolunteeresInfo(() => [...newVolunteersList]);

  };

  // This function fetches all the volunters data from the firebase and it stores them in the full and display lists
  const fetchAllVolunteersDocuments = async () => {

    setFullVolunteersInfo([]);
    setVolunteeresInfo([]);

    const volunteersList = await fetchUsersSorted(true);

    console.log(volunteersList);

    setFullVolunteersInfo(() => [...volunteersList]);
    setVolunteeresInfo(() => [...volunteersList]);
  };

  // This useEffect runs just once when the screen opens 
  // it fetches the data of the volunters from the firebase using the function fetchAllVolunteersDocuments
  // also it fetches the current volunter info so we can decide which actions the current user can apply according to his rank/permessions
  React.useEffect(() => {

    console.log(auth.currentUser.uid);

    fetchDocumentById("users", auth.currentUser.uid).then((currUserInfo) => {

      setCurrUserInfo(currUserInfo);
    });


    fetchAllVolunteersDocuments().then(() => {

      setIsLoading(() => false);
    });

  }, []);



  // This useEffect runs each time the variable status from the route changes so we acn make the proper action
  // acording to the status value (update/create/delete)
  // the actions is to modify the data (lists) according to the action that happend in the AddVolunter screen
  React.useEffect(() => {
    if (route.params?.status) {

      console.log(route.params);

      let status = route.params?.status;

      switch (status) {

        case "updated":
          let updatedVolunterInfo = route.params?.tempVolunteerInfo;;
          fullVolunteersInfo.splice(getVolunteerItemIndex(updatedVolunterInfo.id), 1, updatedVolunterInfo);
          setFullVolunteersInfo(() => fullVolunteersInfo);
          updateListBySearch("");
          console.log("Updated");
          navigation.setParams({ status: "none" })
          break;

        case "created":
          let newVolunteerInfo = route.params?.tempVolunteerInfo;
          fullVolunteersInfo.push(newVolunteerInfo);
          setFullVolunteersInfo(() => fullVolunteersInfo);
          updateListBySearch("");
          console.log("Created");
          navigation.setParams({ status: "none" })
          break;

        case "deleted":
          fullVolunteersInfo.splice(getVolunteerItemIndex(route.params?.volunteerID), 1);
          setFullVolunteersInfo(() => fullVolunteersInfo);
          updateListBySearch("");
          console.log("deleted");
          navigation.setParams({ status: "none" })
          break;

        case "none":
          break;
      }

    }
  }, [route.params?.status]);

  // This function returns the index of the volunteer item in the list accoeding to the volunteerID
  const getVolunteerItemIndex = (volunteerID) => {

    for (let currIndex = 0; currIndex < fullVolunteersInfo.length; currIndex++) {

      if (fullVolunteersInfo[currIndex].id === volunteerID) {
        return currIndex;
      }
    }

    return -1;
  }

  // This function return the name of the user rank according to its number (from number rank => the rank name)
  const getUserRankString = (userRank) => {

    switch (userRank) {

      case 0:
        return "אחראי/ת המערכת";

        case 1:
          return "אדמין/ת";

      case 2:
          return "מתנדב/ת";

      default:
        return "No Type";

    }
  }

  // This function returns the render item / the card of the volunteer info after filling it with the volunteer info from
  // the received item argumnet so we can display it in the flatlist
  const getListRenderItem = (item) => {

    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.volunteerCardContainer} onLongPress={() => {

        if ((currUserInfo.rank === 0) || (currUserInfo.rank === 1 && item.rank === 2) || (currUserInfo.id === item.id && currUserInfo.rank === 1)) {
          navigation.navigate({ name: "AddVolunteer", params: { tempVolunteerInfo: fullVolunteersInfo[getVolunteerItemIndex(item.id)], isForEdit: true, status: "none" }, merge: true });

        } else {

          return;
        }
      }
      }>

        <Image resizeMode={"cover"} style={styles.volunteerImageStyle} source={{ uri: item.image === null? profileDefaultImageUri :  item.image}} />



        <View style={styles.volunteerInfoContainer}>

          <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>שם: </Text>{item.name}</Text>
          <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>ת.ז: </Text>{item.personalID}</Text>
          <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>טל״ס: </Text>{item.phoneNumber}</Text>
          <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>דוא״ל: </Text>{item.email}</Text>
          <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>סוג משתמש/ת: </Text>{getUserRankString(item.rank)}</Text>


        </View>

      </TouchableOpacity >
    );
  }

  return (

    <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>

      {isLoading && <OurActivityIndicator/>}

      <BackButton goBack={navigation.goBack} />

      <View style={styles.searchAndListContainer}>
        <TextInput style={styles.infoTextInputStyle} onChangeText={(searchString) => { updateListBySearch(searchString) }} placeholder="חיפוש"></TextInput>

        <FlatList keyExtractor={(item, index) => index} showsVerticalScrollIndicator={false} style={styles.flatListStyle} data={volunteeresInfo} renderItem={({ item }) => { return getListRenderItem(item) }} />
      </View>

      <View style={styles.addButtonStyle}><TouchableOpacity style={styles.toucheableAddBStyle} onPress={() => navigation.navigate({ name: "AddVolunteer", params: { isForEdit: false, status: "none" }, merge: true })}><Text style={styles.addButtonTextStyle}>+</Text></TouchableOpacity></View>


    </ImageBackground>
  );
}

// These are the styles of the screen and the volunteers cards
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

  volunteerCardContainer: {

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

  volunteerImageStyle: {
    borderRadius: 10,
    borderColor: "#1c6669",
    borderWidth: 2,
    width: "30%",
    height: 100,
    marginLeft: "3%"
  },

  volunteerInfoContainer: {
    alignItems: "flex-end",
    width: "67%",

  },

  infoTitleTextStyle: {

    fontSize: 14,
    fontWeight: "bold"
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




