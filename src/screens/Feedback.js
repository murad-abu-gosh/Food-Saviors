import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { fetchAllDocuments, fetchDocumentById } from "../config/database_interface";



export default function Feedback({ navigation, route}) {

  let [feedbacksInfo, setFeedbacksInfo] = useState([{ 
    userID: "12345425",
    title: "אוכל לא טריא",
    date: "14-5-2022",
    content: "הירקות והפירות במצב לא טוב צריך לבדוק את הקירור"
  }, {
    userID: "21300",
    title: "איחור בהגעת ההזמנה",
    date: "11-12-2021",
    content: "ההזמנות מיגיעות מאוחר מידי"
  }]);

  // const namesMap = new Map();

  // const fetchAllFeedbacksDocuments = async () => {

  //   setFeedbacksInfo([]);

  //   const feedbacksList = await fetchAllDocuments("feedbacks");

  //   feedbacksList.forEach((feedbackObject) => {

  //     console.log(feedbackObject.userID);
      
  //     if(!namesMap.has(feedbackObject.userID)){

  //       let currUser = fetchDocumentById("users", feedbackObject.userID);

  //       namesMap.set(currUser.id, currUser.name);
  //     }
  //   });

  //   setFeedbacksInfo(() => [...feedbacksList]);
  // };

  // React.useEffect(() => {
  //   fetchAllFeedbacksDocuments();
  //   const willFocusSubscription = navigation.addListener('focus', () => {
  //     fetchAllFeedbacksDocuments();
  //   });

  //   return willFocusSubscription;
  // }, []);


  const getFeedbackItemIndex = (feedbackID) => {

    for(let currIndex = 0; currIndex < feedbacksInfo.length; currIndex++) {
      
      if(feedbacksInfo[currIndex].id === feedbackID){
          
        return currIndex;
      }
    }

    return -1;
  }

  const getListRenderItem = (item) => {

    return (
    <TouchableOpacity activeOpacity={0.8} style={styles.feedbackCardContainer} onPress={() => navigation.navigate({name: "AddFeedback", params: {tempFeedbackInfo: feedbacksInfo[getFeedbackItemIndex(item.id)], isForEdit: true}, merge: true})}>

      <View style={styles.feedbackHeaderInfoContainer}>

        <Text style={styles.TitleTextStyle}>{item.title}</Text>
        <Text style={styles.dateAndUserInfoTextStyle}>{item.date + " - " + "אבו גמל מעאד"}</Text>

      </View>

      <View style={styles.feedbackContentContainer}><Text style={styles.feedbackContentText}>{item.content}</Text></View>

    </TouchableOpacity>
    );
  }

  return (

    <Background styleEdit={styles.backgroundEdit}>

      <BackButton goBack={navigation.goBack} />

      <FlatList keyExtractor={(item, index) => index} showsVerticalScrollIndicator={false} style={styles.flatListStyle} data={feedbacksInfo} renderItem={({ item }) => { return getListRenderItem(item) }} />


      <View style={styles.addButtonStyle}><TouchableOpacity style={styles.toucheableAddBStyle} onPress={() => navigation.navigate({name: "AddFeedback", params: {isForEdit: false}, merge: true})}><Text style={styles.addButtonTextStyle}>+</Text></TouchableOpacity></View>


    </Background>
  );
}

const styles = StyleSheet.create({

  backgroundEdit: {

    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'column'
  },

  flatListStyle: {

    marginTop: getStatusBarHeight() + 24 + 10 + 10,
    width: "100%"
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
    width: "100%",
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: 'center',
    marginBottom: 5,
},

feedbackHeaderInfoContainer: {
    alignItems: "center",
    width: "90%",
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 3,
    borderBottomColor:  "#1c6669",
    // borderStyle: 'dotted'
},

feedbackContentContainer: {

    marginTop: 10,
    marginBottom: 10,
    width: "100%",
},

feedbackContentText: {

    textAlign: "center",
    fontSize: 18
},

dateAndUserInfoTextStyle: {
    fontSize: 18,
    direction: "rtl",
    textAlign: "left",
},

TitleTextStyle: {

    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left"
},



});




