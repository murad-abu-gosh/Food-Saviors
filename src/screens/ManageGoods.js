import React from 'react'
import Background from '../components/Background'

import { StyleSheet, Text,ImageBackground,Image , View,SafeAreaView,TouchableOpacity, KeyboardAvoidingView,Platform,StatusBar, Button } from 'react-native';
import BackButton from '../components/BackButton'
export default function ManageGoods({ navigation }) { 
    return ( 
        <Background > 
            
         <BackButton goBack={navigation.goBack} />
        {/*start your code here*/}
       <Text>its ManageGoods page start your code here</Text>
       </Background>
    );
}
const styles = StyleSheet.create({
  
    
  });
