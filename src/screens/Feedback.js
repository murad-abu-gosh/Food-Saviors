import React, { useState } from "react";
import { FlatList, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BackButton from "../components/BackButton";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { fetchAllDocuments, fetchDocumentById, fetchFeedbacksSorted } from "../config/database_interface";
import { theme } from "../core/theme";
import OurActivityIndicator from "../components/OurActivityIndicator";
import { auth } from "../config";



export default function Feedback({ navigation, route }) {

  // initializing the needed variables/useStates
  const [isLoading, setIsLoading] = useState(true);

  const [fullFeedbacksInfo, setFullFeedbacksInfo] = useState([]);

  const [feedbacksInfo, setFeedbacksInfo] = useState([]);

  const [currUserInfo, setCurrUserInfo] = useState();

  const [IDsNamesMap, setIDsNamesMap] = useState(new Map());

  // This function receives a searcing string and it fills the display list with the suitable items from the fullItemslist
  const updateListBySearch = (searchString) => {

    searchString = searchString.toLowerCase().trim();

    setFeedbacksInfo([]);

    if (searchString === "") {
      setFeedbacksInfo(() => [...fullFeedbacksInfo]);
      return;
    }

    let searcheableFileds = ["title", "content"];
    let newFeedbacksList = [];
    let isSuitable = false;

    fullFeedbacksInfo.forEach((currFeedbackInfoObj) => {
      isSuitable = false;

      for (let i = 0; i < searcheableFileds.length; i++) {

        if ((currFeedbackInfoObj[searcheableFileds[i]]).toLowerCase().includes(searchString)) {

          newFeedbacksList.push(currFeedbackInfoObj);
          isSuitable = true;
          break; 
        }
      }


      if (!isSuitable && (IDsNamesMap.get(currFeedbackInfoObj.userID).toLowerCase().includes(searchString) || getDateStr(currFeedbackInfoObj["date"]).includes(searchString))) {
        newFeedbacksList.push(currFeedbackInfoObj);
      }

    });

    setFeedbacksInfo(() => newFeedbacksList);

  };

  // This function fetches all the feedbacks data from the firebase and it stores them in the full and display lists
  const fetchAllFeedbacksDocuments = async () => {

    setFullFeedbacksInfo([]);
    setFeedbacksInfo([]);

    const feedbacksList = await fetchFeedbacksSorted();

    console.log(feedbacksList);

    setFullFeedbacksInfo(() => [...feedbacksList]);
    setFeedbacksInfo(() => [...feedbacksList]);
  };

  // This useEffect runs just once when the screen opens 
  // it fetches the data of the feedbacks from the firebase using the function fetchAllFeedbacksDocuments
  // also it fetches the current volunter info so we can decide which actions the current user can apply according to his rank/permessions
  React.useEffect(() => {

    console.log(auth.currentUser.uid);

    fetchDocumentById("users", auth.currentUser.uid).then((currUserInfo) => {

      setCurrUserInfo(currUserInfo);

      console.log(currUserInfo);
    });


    buildUsersIDsNamesMap().then(() => {

      fetchAllFeedbacksDocuments().then(() => {

        setIsLoading(() => false);

      });
    });

  }, []);

  // This useEffect runs each time the variable status from the route changes so we acn make the proper action
  // acording to the status value (update/create/delete)
  // the actions is to modify the data (lists) according to the action that happend in the AddFeedback screen
  React.useEffect(() => {
    if (route.params?.status) {

      console.log(route.params);

      let status = route.params?.status;

      switch (status) {

        case "updated":
          let updatedFeedbackInfo = route.params?.tempFeedbackInfo;;
          fullFeedbacksInfo.splice(getFeedbackItemIndex(updatedFeedbackInfo.id), 1, updatedFeedbackInfo);
          setFullFeedbacksInfo(() => fullFeedbacksInfo);
          console.log("Updated");
          updateListBySearch("");
          navigation.setParams({ status: "none" });
          break;

        case "created":
          let newFeedbackInfo = route.params?.tempFeedbackInfo;
          fullFeedbacksInfo.push(newFeedbackInfo);
          setFullFeedbacksInfo(() => fullFeedbacksInfo);
          updateListBySearch("");
          console.log("Created");
          navigation.setParams({ status: "none" });
          break;

        case "deleted":
          fullFeedbacksInfo.splice(getFeedbackItemIndex(route.params?.feedbackID), 1);
          setFullFeedbacksInfo(() => fullFeedbacksInfo);
          console.log("deleted");
          navigation.setParams({ status: "none" });
          updateListBySearch("");
          break;

        case "none":
          break;
      }

    }

  }, [route.params?.status]);

  // This funtion returns a date string with the format dd-mm-yyyy using the given date object
  const getDateStr = (dateObj) => {

    let dateString;

    let dd = String(dateObj.getDate()).padStart(2, '0');
    let mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    let yyyy = dateObj.getFullYear();

    dateString = dd + '-' + mm + '-' + yyyy;

    return dateString;
  };

  // This function buildes an (IDs, Names) Map so we can get the name of the feedback writer and display it 
  const buildUsersIDsNamesMap = async () => {

    const usersList = await fetchAllDocuments("users");

    usersList.forEach((userInfoObject) => {

      setIDsNamesMap(IDsNamesMap.set(userInfoObject.id, userInfoObject.name));

    });
  };

  // This function returns the index of the feedback item in the list accoeding to the feedbackID
  const getFeedbackItemIndex = (feedbackID) => {

    for (let currIndex = 0; currIndex < fullFeedbacksInfo.length; currIndex++) {

      if (fullFeedbacksInfo[currIndex].id === feedbackID) {

        return currIndex;
      }
    }

    return -1;
  }

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {

    console.log("Refreshing");

    setIsRefreshing(true);

    fetchAllFeedbacksDocuments().then(() => {

      setIsRefreshing(false);
    });
  }

  // This function returns the render item / the card of the dropArea info after filling it with the dropArea info from
  // the received item argumnet so we can display it in the flatlist
  const getListRenderItem = (item) => {

    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.feedbackCardContainer} onLongPress={() => {

        console.log(currUserInfo.id);
        console.log(currUserInfo.rank === 0);

        if (currUserInfo.id === item.userID || currUserInfo.rank === 0) {
          navigation.navigate({ name: "AddFeedback", params: { tempFeedbackInfo: fullFeedbacksInfo[getFeedbackItemIndex(item.id)], isForEdit: true }, merge: true })
        }


      }}>

        <View style={styles.feedbackHeaderInfoContainer}>

          <Text style={styles.TitleTextStyle}>{item.title}</Text>
          <Text style={styles.dateAndUserInfoTextStyle}>{getDateStr(item.date) + " - " + IDsNamesMap.get(item.userID)}</Text>

        </View>

        <View style={styles.feedbackContentContainer}><Text style={styles.feedbackContentText}>{item.content}</Text></View>

      </TouchableOpacity>
    );
  }

  return (

    <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>

      {isLoading && <OurActivityIndicator />}

      <BackButton goBack={navigation.goBack} />

      <View style={styles.searchAndListContainer}>

        <TextInput style={styles.infoTextInputStyle} onChangeText={(searchString) => { updateListBySearch(searchString) }} placeholder="חיפוש"></TextInput>

        <FlatList onRefresh={onRefresh} refreshing={isRefreshing} extraData={IDsNamesMap} keyExtractor={(item, index) => index} showsVerticalScrollIndicator={false} style={styles.flatListStyle} data={feedbacksInfo} renderItem={({ item }) => { return getListRenderItem(item) }} />

      </View>

      <View style={styles.addButtonStyle}><TouchableOpacity style={styles.toucheableAddBStyle} onPress={() => navigation.navigate({ name: "AddFeedback", params: { isForEdit: false }, merge: true })}><Text style={styles.addButtonTextStyle}>+</Text></TouchableOpacity></View>


    </ImageBackground>
  );
}

// These are the styles of the screen and the feedbacks cards
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

  feedbackCardContainer: {

    flexDirection: "column",
    borderColor: "#1c6669",
    borderWidth: 3,
    padding: 5,
    minWidth: "100%",
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: 'center',
    marginBottom: 5,
  },

  feedbackHeaderInfoContainer: {
    alignItems: "center",
    width: "73%",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#1c6669",
    // borderStyle: 'dotted'
  },

  feedbackContentContainer: {

    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    width: "100%",
  },

  feedbackContentText: {

    textAlign: "center",
    fontSize: 18
    // textAlign: "right",
    // paddingRight: 10,
  },

  dateAndUserInfoTextStyle: {
    fontSize: 16,
    direction: "rtl",
    textAlign: "left",
    color: "#353535"
  },

  TitleTextStyle: {

    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
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




