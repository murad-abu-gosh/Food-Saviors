import React from "react";

import { Image, StyleSheet, Text, View } from "react-native";

export default function Items({ Name, image }) {
//     const [image, setImage] = useState(null);

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });


//     if (!result.cancelled) {
//       setImage(result.uri);
//     }
//   };

  return (


    <View style={styles.ItemsContainer}>

      {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}

      {image && <Image source={{ uri: image }} style={styles.Image} />}
      <Text style={styles.NameText}>{Name}</Text>


    </View>

  );
}
const styles = StyleSheet.create({
  ItemsContainer: {

    //  width: "90%",
     height: 180,
    // height: "28%",
   margin : 5,
    alignItems: "center",
   backgroundColor : 'white',
   borderWidth: 3,
   borderRadius: 10,
   borderColor: "#1c6669",
  // marginTop : "15%",
  // marginLeft : "5%"
  

  },
  NameText : {
   fontSize : 20,
  
  },
  Image: {
    width: 130,
    height: 130,
    
    margin : 7,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#1c6669"
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 100
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }

});