import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import { StyleSheet, Text,ImageBackground,Image , View,SafeAreaView,TouchableOpacity, KeyboardAvoidingView,Platform,StatusBar, Button } from 'react-native';
import BackButton from '../components/BackButton'
export default function HomeScreen({ navigation }) {
  return (
       
    <Background >
       <BackButton goBack={navigation.goBack} />
       
        <Image source={require('../assets/profile.png')} style = {styles.profileIcon}/>
      <View style={styles.buttonContainer}>
      <SafeAreaView style={styles.LogoTextContainer}> 
      
      <Text style={styles.Text}>ניצול מזון : 79879</Text> {/*add number here from database*/}
      
        <Logo /> 
      </SafeAreaView>
     <TouchableOpacity  onPress={ () => navigation.navigate('ManageGoods')} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>ניהול סחורות</Text>
  </TouchableOpacity>
  <TouchableOpacity  onPress={() =>navigation.navigate('ManageItems')} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>ניהול פריטים</Text>
  </TouchableOpacity>
  <TouchableOpacity  onPress={() =>navigation.navigate('SeeStatistics')} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>צפו בסטטיסטיקה</Text>
  </TouchableOpacity>
  <TouchableOpacity  onPress={() =>navigation.navigate('AddVolunteer')} style={styles.appButtonContainer}>
    <Text  style={styles.appButtonText}> הוספת מתנדב</Text>
   
  </TouchableOpacity>
    </View>
    </Background>
  )
}
const styles = StyleSheet.create({
  
  ScreenContainer: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    justifyContent: 'center',
    backgroundColor: "blue",
   
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
     alignItems:"center",
    justifyContent: "space-evenly",
    padding: 16,
    borderRadius: 100,
   
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#1c6669",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 200,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
    Text: {
    
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  LogoTextContainer : {
    alignItems:"center",
    justifyContent: 'center',
    flexDirection: 'column',
  },
  profileIcon : {
    position: 'absolute',
    top: 65,
    right: 4,
    width: 50 , 
    height: 50
  }
  
});
