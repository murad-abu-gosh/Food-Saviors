import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Background from "../components/Background";

import BackButton from "../components/BackButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { setStatusBarStyle } from "expo-status-bar";
import { fetchAllDocuments } from "../config/database_interface";


export default function ManageVolunteers({ navigation, route }) {

  setStatusBarStyle("dark");

  let [volunteeresInfo, setVolunteeresInfo] = useState([{volunteerFullName: "אבו גמל מעאד", volunteerID: "207535311", volunteerEmail: "Muathsoftware@gmail.com", volunteerPhoneNumber: "0585333193", volunteerBirthdayDate: "3/4/2000", volunteerType: "מתנדב", volunteerImageUri: Image.resolveAssetSource(require("../assets/avatar.png")).uri }])

  const fetchAllVolunteersDocuments = async () => {

    setVolunteeresInfo([]);

    const volunteersList = await fetchAllDocuments("users");

    console.log(volunteersList);

    setVolunteeresInfo(() => [...volunteersList]);
  };

  React.useEffect(() => {
    fetchAllVolunteersDocuments();
    const willFocusSubscription = navigation.addListener('focus', () => {
      fetchAllVolunteersDocuments();
    });

    return willFocusSubscription;
  }, []);


  // React.useEffect(() => {
  //   if (route.params?.tempVolunteerInfo) {
      
  //     let newVolunteerInfo = route.params?.tempVolunteerInfo;

  //     if(route.params?.isForEdit){

  //       volunteeresInfo[getVolunteerItemIndex(newVolunteerInfo.volunteerID)] = newVolunteerInfo;

  //     } else {
  //       setVolunteeresInfo([...volunteeresInfo, newVolunteerInfo]);
  //     }
      
  //   }
  // }, [route.params?.tempVolunteerInfo]);

  const getVolunteerItemIndex = (volunterID) => {

    for(let currIndex = 0; currIndex < volunteeresInfo.length; currIndex++) {
      
      if(volunteeresInfo[currIndex].id === volunterID){
        return currIndex;
      }
    }

    return -1;
  }

  const getUserRankString = (userRank) => {

    switch(userRank){

      case 0:
        return "Head Admin";

      case 1:
        return "Admin";

      case 2:
        return "volunteer";

      default:
        return "No Type";

    }    
  }

  const getListRenderItem = (item) => {

    return (
    <TouchableOpacity activeOpacity={0.8} style={styles.volunteerCardContainer} onPress={() => navigation.navigate({name: "AddVolunteer", params: {tempVolunteerInfo: volunteeresInfo[getVolunteerItemIndex(item.id)], isForEdit: true}, merge: true})}>

      <Image style={styles.volunteerImageStyle} source={{ uri: item.image }} />



      <View style={styles.volunteerInfoContainer}> 

        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>שם: </Text>{item.name}</Text>
        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>ת.ז: </Text>{item.personalID}</Text>
        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>תל״מ: </Text>{item.birthDate}</Text>
        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>טל״ס: </Text>{item.phoneNumber}</Text>
        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>דוא״ל: </Text>{item.email}</Text>
        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>סוג משתמש: </Text>{getUserRankString(item.rank)}</Text>


      </View>

    </TouchableOpacity>
    );
  }

  return (

    <Background styleEdit={styles.backgroundEdit}>

      <BackButton goBack={navigation.goBack} />

      <FlatList keyExtractor={(item, index) => index} showsVerticalScrollIndicator={false} style={styles.flatListStyle} data={volunteeresInfo} renderItem={({ item }) => { return getListRenderItem(item) }} />


      <View style={styles.addButtonStyle}><TouchableOpacity style={styles.toucheableAddBStyle} onPress={() => navigation.navigate({name: "AddVolunteer", params: {isForEdit: false}, merge: true})}><Text style={styles.addButtonTextStyle}>+</Text></TouchableOpacity></View>


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

    fontSize: 12,
    fontWeight: "bold"
}

});




