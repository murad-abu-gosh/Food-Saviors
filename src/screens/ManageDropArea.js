import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useIsFocused } from "@react-navigation/native";


export default function ManageDropArea({ navigation, route}) {

    const isFocused = useIsFocused();

  let [dropAreasInfo, setDropAreasInfo] = useState([{dropAreaID: "123456789", dropAreaName: "חנות סאמר", dropAreaAddress: "ירושלים - גבל אלבוכבר - חי אל-מדארס בניין מספר 14"}])

  React.useEffect(() => {
    if (route.params?.tempDropAreaInfo) {
      
      let newDropAreaInfo = route.params?.tempDropAreaInfo;

      if(route.params?.isForEdit === true){

        dropAreasInfo[getDropAreaItemIndex(newDropAreaInfo.dropAreaID)] = newDropAreaInfo;

        

        setDropAreasInfo(dropAreasInfo);

      } else {

        const newDropAreasList = [...dropAreasInfo, newDropAreaInfo];
        
        setDropAreasInfo(newDropAreasList);
      }
      
    }
  }, [route.params?.tempDropAreaInfo]);

  const getDropAreaItemIndex = (dropAreaID) => {

    for(let currIndex = 0; currIndex < dropAreasInfo.length; currIndex++) {
      
      if(dropAreasInfo[currIndex].dropAreaID === dropAreaID){
          
        return currIndex;
      }
    }

    return -1;
  }

  const getListRenderItem = (item) => {

    return (
    <TouchableOpacity activeOpacity={0.8} style={styles.dropAreaCardContainer} onPress={() => navigation.navigate({name: "AddDropArea", params: {tempDropAreaInfo: dropAreasInfo[getDropAreaItemIndex(item.dropAreaID)], isForEdit: true}, merge: true})}>

      <View style={styles.dropAreaInfoContainer}>

        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>שם הנקודה: </Text>{item.dropAreaName}</Text>
        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>כתובת הנקודה: </Text>{item.dropAreaAddress}</Text>

      </View>

    </TouchableOpacity>
    );
  }

  return (

    <Background styleEdit={styles.backgroundEdit}>

      <BackButton goBack={navigation.goBack} />

      <FlatList keyExtractor={(item, index) => index} showsVerticalScrollIndicator={false} style={styles.flatListStyle} data={dropAreasInfo} renderItem={({ item }) => { return getListRenderItem(item) }} />


      <View style={styles.addButtonStyle}><TouchableOpacity style={styles.toucheableAddBStyle} onPress={() => navigation.navigate({name: "AddDropArea", params: {isForEdit: false, updated: false}, merge: true})}><Text style={styles.addButtonTextStyle}>+</Text></TouchableOpacity></View>


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
}

});




