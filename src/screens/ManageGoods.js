import React from "react";
/// import * as React from 'react'
import Background from "../components/Background";

import {KeyboardAvoidingView, Image, StyleSheet, TextInput, View ,Text ,FlatList, Pressable, Keyboard, ImageBackground} from "react-native";
import {  Button, Card ,List} from "react-native-paper";
import BackButton from "../components/BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { theme } from "../core/theme";
let ChangedData = [];
function content(Goods) {
  let result = [];
  for (let i = 0; i < Goods.length; i++) {
    let good = (
      <View style = {styles.cards}>
      <Card.Title
      key={i}
        title={<Text style = {styles.cardTitle}>{Goods[i].Name}</Text>}
        subtitleNumberOfLines = {2}
        subtitle={<Text style = {styles.cardTitle}>{Goods[i].Storage} Boxes is storage{"\n"}
        Weight {Goods[i].BoxWeight}</Text>}
        left={(props) => <Image style={styles.avatar} source={Goods[i].Pic} />}
        right={(props) => <TextInput
          style={styles.input}
          // onChangeText={onChangeText}
          // value={text}
        />}

      />
      </View>
    );
    result[i] = (good);
  }

  return (
    result
    //   <Card.Title
    //   title="shoooot"
    //   subtitle="3 boxes in storage"
    //   left={(props) => <Image style={styles.avatar} source={require('../assets/tomato.png')}/>}
    //   right={(props) => <TextInput
    //     style={styles.input}
    //     // onChangeText={onChangeText}
    //     // value={text}
    //   />}

    // />
  );

}
function receiveData(id, value, name,previousAmount){
  let remove = 0;
  if (value == "")
    remove = 1;
  let data = {};
  data.id = id;
  data.amount = value;
  data.Name = name;
  data.previousAmount = previousAmount;
  for(let i = 0; i< ChangedData.length; i++){
    if(id == ChangedData[i].id){
      if(remove == 1){
        ChangedData.splice(i, i+1);
        return;
      }
      ChangedData[i].amount = value
        return;
    }
  }
  let tempLength = ChangedData.length
  console.log(ChangedData);
  ChangedData[tempLength] = data;
}
export default function ManageGoods({ navigation }) {

  // Keyboard.dismiss();

  const Goods = [{
    Name: "Peper",
    Storage: 4,
    BoxWeight: "3kg",
    Pic: require("../assets/peper.png"),
    id: "1"
  },
    {
      Name: "Tomato",
      Storage: 9,
      BoxWeight: "2kg",
      Pic: require("../assets/tomato.png"),
      id: "2"
    }, 
    {
      Name: "Cucamber",
      Storage: 7,
      BoxWeight: "3kg",
      Pic: require("../assets/cucumber.png"),
      id: "3"
    },
    {
      Name: "Onion",
      Storage: 2,
      BoxWeight: "2kg",
      Pic: require("../assets/onion.png"),
      id: "4"
    },
    {
      Name: "Watermelon",
      Storage: 4,
      BoxWeight: "2kg",
      Pic: require("../assets/watermelon.png"),
      id: "5"
    }, {
      Name: "Potato",
      Storage: 5,
      BoxWeight: "3kg",
      Pic: require("../assets/potato.png"),
      id: "6"
    },
     {
       Name: "Grapes",
       Storage: 3,
       BoxWeight: "2kg",
       Pic: require("../assets/grapes.png"),
       id: "7"
     },
     {
      Name: "Peper",
      Storage: 4,
      BoxWeight: "3kg",
      Pic: require("../assets/peper.png"),
      id: "8"
    },
      {
        Name: "Tomato",
        Storage: 9,
        BoxWeight: "2kg",
        Pic: require("../assets/tomato.png"),
        id: "9"
      }, 
      {
        Name: "Cucamber",
        Storage: 7,
        BoxWeight: "3kg",
        Pic: require("../assets/cucumber.png"),
        id: "10"
      },
      {
        Name: "Onion",
        Storage: 2,
        BoxWeight: "2kg",
        Pic: require("../assets/onion.png"),
        id: "11"
      },
      {
        Name: "Watermelon",
        Storage: 4,
        BoxWeight: "2kg",
        Pic: require("../assets/watermelon.png"),
        id: "12"
      }, 
      {
        Name: "Potato",
        Storage: 5,
        BoxWeight: "3kg",
        Pic: require("../assets/potato.png"),
        id: "13"
      },
       
  ];
  // let res = "";
  // for(let i = 0; i<Goods.length; i++){
  //   res += '<Card.Title title= '+Goods[i].Name + 'subtitle=' + Goods[i].Storage + ' boxes in storage left={(props) => <Image style={styles.avatar} source={require(' + Goods[i].Pic + ')}/>}right={(props) => <TextInput style={styles.input} />}/>'
  // }
  const MyComponent = () => content(Goods);
  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  const renderItem = ({ item }) => (
    // <View style={styles.Every3Card}>
      <Card.Title style={styles.EveryCard}
      key={item.id}
      title={<Text style = {styles.cardTitle}>{item.Name}</Text>}
      subtitle={<Text style = {styles.cardTitle}>{item.Storage} Boxes is storage{"\n"} Weight {item.BoxWeight}</Text>} 
      left={(props) => <Image style={styles.avatar} source={item.Pic} />}
      right={(props) => <TextInput
      style={styles.input}
    
          onChangeText={ text => receiveData(item.id,text, item.Name,item.Storage)}
          // value={text}
    />}
   />
  //  </View>
  );
  return (
    <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>
      
      <BackButton goBack={navigation.goBack} />
      <View style={styles.Container} keyboardShouldPersistTaps='handled'>
        {/* <MyComponent style = {styles.GoodsCards}></MyComponent> */}
          {/* {content(Goods)} */}
      <FlatList showsVerticalScrollIndicator={false} style={styles.FlatListStyle}
      data={Goods} inverted={false}
      renderItem={renderItem}
      ></FlatList>
      </View>
      {/* <TextInput style={styles.input}></TextInput> */}
      {/* {content2(Goods)} */}
      {/* {res} */}
      <View style={styles.BottomButtons}>
      <Pressable style={styles.bottomView} onPress={() => navigation.navigate("UpdateGoods", {
      paramKey: {data: ChangedData, add:true}})}>
      <Text style={styles.bottomText}>+</Text>
      </Pressable>
      <Pressable style={styles.bottomView} onPress={() => navigation.navigate("UpdateGoods", {
      paramKey: {data: ChangedData, add:false}})}>
      <Text style={styles.bottomText}>ــ</Text>
      </Pressable>
      <Pressable style={styles.bottomView}>
      <Text style={styles.bottomText}onPress={() => navigation.navigate("ExportAndWaste", {
      paramKey: {data: ChangedData, export:true}})} >Export</Text>
      </Pressable>
      <Pressable style={styles.bottomView} >
      <Text style={styles.bottomText}onPress={() => navigation.navigate("ExportAndWaste", {
      paramKey: {data: ChangedData, export:false}})}>Waste</Text>
      </Pressable>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({

  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
},


  backgroundEdit: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'column'
  },
  avatar: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
    aspectRatio: 1,
  },
  input: {
  width: 25,
  height: 25,
  backgroundColor: "#b6ffbf",
  marginRight: 7,
  borderWidth: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  // bottom : 0,
  },
  Container:{
    marginTop : "25%",
   flex: 1,
    // // justifyContent: "space-between",
    // backgroundColor: "#fff",
    padding: 5,
    margin: 0,
    width: "100%",
  },
  BottomButtons:{
  backgroundColor: '#F5FCFF',
   borderTopWidth: 5,
  // borderTopLeftRadius: 3,
  // borderTopRightRadius: 3,
  // borderBottomLeftRadius: 3,
  // borderBottomRightRadius: 3,
  padding: 0,
  marginTop: 0,
  width: "100%",
  height:50,
  flexDirection:'row',
  alignItems:'center',
  alignSelf:"center",
  justifyContent:'center',
  bottom:0
  },
  bottomView:{
    // borderRightWidth:1,
    // borderLeftWidth:1,
    // height: "100%",
    alignSelf:"center",
    alignItems:"center",
    fontSize: 16,
    width:"23%",
    // marginTop: 10,
    color:"green"
    
  },
  bottomText:{
    alignSelf:"center",
    fontSize: 16,
    // width:"30%",
    color:"green"
  },
  FlatListStyle:{
    width:"100%",
    // padding:0,
  },
  EveryCard:{
    alignSelf :"center",
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop :5,
  }
});