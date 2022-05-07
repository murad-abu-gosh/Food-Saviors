import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useIsFocused } from "@react-navigation/native";



export default function Feedback({ navigation, route}) {

  let [feedbacksInfo, setFeedbacksInfo] = useState([{feedbackID: "123456789", feedbackTitle: "חנות סאמר", feedbackDate: "15-4-2020", feedbackUserInfo: "Muath Abu Jamal", feedbackContent: "Today we are visiting to discuss the Top 5 best text editors for web development in 2022. These text editors have plenty of features and might increase your productivity."}])

  React.useEffect(() => {
    if (route.params?.tempFeedbackInfo) {
      
      let newFeedbackInfo = route.params?.tempFeedbackInfo;

      if(route.params?.isForEdit === true){

        feedbacksInfo[getFeedbackItemIndex(newFeedbackInfo.feedbackID)] = newFeedbackInfo;

        setFeedbacksInfo(feedbacksInfo);

      } else {

        const newFeedbackList = [...feedbacksInfo, newFeedbackInfo];
        
        setFeedbacksInfo(newFeedbackList);
      }
      
    }
  }, [route.params?.tempFeedbackInfo]);

  const getFeedbackItemIndex = (feedbackID) => {

    for(let currIndex = 0; currIndex < feedbacksInfo.length; currIndex++) {
      
      if(feedbacksInfo[currIndex].feedbackID === feedbackID){
          
        return currIndex;
      }
    }

    return -1;
  }

  const getListRenderItem = (item) => {

    return (
    <TouchableOpacity activeOpacity={0.8} style={styles.feedbackCardContainer} onPress={() => navigation.navigate({name: "AddFeedback", params: {tempFeedbackInfo: feedbacksInfo[getFeedbackItemIndex(item.feedbackID)], isForEdit: true}, merge: true})}>

      <View style={styles.feedbackHeaderInfoContainer}>

        <Text style={styles.TitleTextStyle}>{item.feedbackTitle}</Text>
        <Text style={styles.dateAndUserInfoTextStyle}>{item.feedbackUserInfo + " - " + item.feedbackDate}</Text>

      </View>

      <View style={styles.feedbackContentContainer}><Text style={styles.feedbackContentText}>{item.feedbackContent}</Text></View>

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
    width: "103%",
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 3,
    borderBottomColor:  "#1c6669"
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




