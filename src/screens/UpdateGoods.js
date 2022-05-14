import React, { useState } from "react";
/// import * as React from 'react'
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Button, List } from "react-native-paper";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { checkActionCode } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

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
export default function UpdateGoods({ navigation, route }) {
  // const AlertRemoving= () => {
  //   const showAlert = () =>{
  //      Alert.alert(
  //         'You need to...'
  //      )
  //   }
  // let addingAlert = "Are you sure you want to add goods to storage?"
  // let aremovingAlert = "Are you sure you want to remove goods from storage?"
  const showAlert = () => {
    Alert.alert(
      "Data has seccusfully updated!"
      //  <View>
      //   <Text>Are you sure you want to Add goods to storage ?</Text>
      //   <Button>Yes Add please</Button>
      //   </View>
    );
  };
  let data = [];
  const [ChangedData, SetChangedData] = useState([
    { label: "שם", value: "name" },
    { label: "קמות", value: "amount" },
    { label: "id", value: "id" },
  ]);
  React.useEffect(() => {
    if (route.params?.paramKey) {
      //   ChangedData = JSON.stringify(route.params?.paramKey);
      //     console.log("newww " + ChangedData);

      SetChangedData(route.params?.paramKey);
      console.log("wheeeeee5" + JSON.stringify(route.params?.paramKey));
    }
  }, [route.params?.paramKey]);
  console.log("wheeeeee3" + JSON.stringify(route.params?.paramKey));
  console.log(route.params?.paramKey);
  // console.log("wheeeeee" + ChangedData);
  // data = ChangedData;
  // if(ChangedData){
  data = route.params?.paramKey.data;
  let add = route.params?.paramKey.add;
  if (add) {
    return (
      <Background style={styles.backgroundEdit}>
        <BackButton goBack={navigation.goBack} />
        <View>
          {/* <Text>{ListItems(route.params?.paramKey)}</Text> */}
          <FlatList
            style={styles.ListStyle}
            data={data}
            renderItem={({ item }) => (
              <View style={styles.EveryItem}>
                <Text style={styles.ItemTitle}>{item.Name}</Text>
                <Text style={styles.ItemSub}>
                  {item.amount} Boxes to be added to storage{"\n"}Total ={" "}
                  {parseInt(item.amount) + parseInt(item.previousAmount)}
                </Text>
              </View>
            )}
          />
        </View>
        <Pressable style={styles.ButtonView} onPress={showAlert}>
          <Text style={styles.SavingButton}>Save updates</Text>
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
            renderItem={({ item }) => (
              <View style={styles.EveryItem}>
                <Text style={styles.ItemTitle}>{item.Name}</Text>
                <Text style={styles.ItemSub}>
                  {item.amount} Boxes to be removed from storage{"\n"}Total ={" "}
                  {parseInt(item.previousAmount) - parseInt(item.amount)}
                </Text>
              </View>
            )}
          />
        </View>
        <Pressable style={styles.ButtonView} onPress={showAlert}>
          <Text style={styles.SavingButton}>Save updates</Text>
        </Pressable>
      </Background>
    );
  }
  // }
  // else
  // {
  // return(
  // <Background>
  //   <BackButton goBack={navigation.goBack} />
  //     <ScrollView>
  //       {ListItems(JSON.parse(ChangedData))}
  //     </ScrollView>
  // </Background>
  // )
  // }
}
const styles = StyleSheet.create({
  backgroundEdit: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: "column",
  },
  EveryItem: {
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
    height: "90%",
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
