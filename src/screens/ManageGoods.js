import React from "react";
import Background from "../components/Background";

import { Image, StyleSheet, TextInput, View } from "react-native";
import { Card } from "react-native-paper";
import BackButton from "../components/BackButton";

function content(Goods) {
  let result = [];
  for (let i = 0; i < Goods.length; i++) {
    let good = (
      <Card.Title
        title={Goods[i].Name}
        subtitle={Goods[i].Storage + " Boxes is storage\r\nWeight " + Goods[i].BoxWeight}
        left={(props) => <Image style={styles.avatar} source={Goods[i].Pic} />}
        right={(props) => <TextInput
          style={styles.input}
          // onChangeText={onChangeText}
          // value={text}
        />}

      />
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

export default function ManageGoods({ navigation }) {
  const Goods = [{
    Name: "Peper",
    Storage: 4,
    BoxWeight: "3kg",
    Pic: require("../assets/peper.png")
  },
    {
      Name: "Tomato",
      Storage: 9,
      BoxWeight: "2kg",
      Pic: require("../assets/tomato.png")
    }, {
      Name: "Cucamber",
      Storage: 7,
      BoxWeight: "3kg",
      Pic: require("../assets/cucumber.png")
    },
    {
      Name: "Onion",
      Storage: 2,
      BoxWeight: "2kg",
      Pic: require("../assets/onion.png")
    },
    {
      Name: "Watermelon",
      Storage: 4,
      BoxWeight: "2kg",
      Pic: require("../assets/watermelon.png")
    }, {
      Name: "Potato",
      Storage: 5,
      BoxWeight: "3kg",
      Pic: require("../assets/potato.png")
    },
    {
      Name: "Grapes",
      Storage: 3,
      BoxWeight: "2kg",
      Pic: require("../assets/grapes.png")
    }];
  // let res = "";
  // for(let i = 0; i<Goods.length; i++){
  //   res += '<Card.Title title= '+Goods[i].Name + 'subtitle=' + Goods[i].Storage + ' boxes in storage left={(props) => <Image style={styles.avatar} source={require(' + Goods[i].Pic + ')}/>}right={(props) => <TextInput style={styles.input} />}/>'
  // }
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <View>
        {content(Goods)}
      </View>
      {/* {res} */}
      {/* <Card.Title
    title="Cucumber"
    subtitle="5 boxes in storage"
    left={(props) => <Image style={styles.avatar} source={require('../assets/cucumber.png')}/>}
    right={(props) => <TextInput
      style={styles.input}
      // onChangeText={onChangeText}
      // value={text}
    />}

  />
  <Card.Title
    title="Tomato"
    subtitle="3 boxes in storage"
    left={(props) => <Image style={styles.avatar} source={require('../assets/tomato.png')}/>}
    right={(props) => <TextInput
      style={styles.input}
      // onChangeText={onChangeText}
      // value={text}
    />}

  />
  <Card.Title
    title="Potato"
    subtitle="10 boxes in storage"
    left={(props) => <Image style={styles.avatar} source={require('../assets/potato.png')}/>}
    right={(props) => <TextInput
      style={styles.input}
      // onChangeText={onChangeText}
      // value={text}
    />}

  />
  <Card.Title
    title="Onion"
    subtitle="5 boxes in storage"
    left={(props) => <Image style={styles.avatar} source={require('../assets/onion.png')}/>}
    right={(props) => <TextInput
      style={styles.input}
      // onChangeText={onChangeText}
      // value={text}
    />}

  />
  <Card.Title
    title="Grapes"
    subtitle="7 boxes in storage"
    left={(props) => <Image style={styles.avatar} source={require('../assets/grapes.png')}/>}
    right={(props) => <TextInput
      style={styles.input}
      // onChangeText={onChangeText}
      // value={text}
    />}

  />
  <Card.Title
    title="Watermelon"
    subtitle="4 boxes in storage"
    left={(props) => <Image style={styles.avatar} source={require('../assets/watermelon.png')}/>}
    right={(props) => <TextInput
      style={styles.input}
      // onChangeText={onChangeText}
      // value={text}
    />}

  />
  <Card.Title
    title="Peper"
    subtitle="2 boxes in storage"
    left={(props) => <Image style={styles.avatar} source={require('../assets/peper.png')}/>}
    right={(props) => <TextInput
      style={styles.input}
      // onChangeText={onChangeText}
      // value={text}
    />}

  /> */}

    </Background>
  );
}
const styles = StyleSheet.create({
  avatar: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
    aspectRatio: 1
  },
  input: {
    width: 25,
    height: 25,
    backgroundColor: "#b6ffbf"
  }

});