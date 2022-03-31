import React from 'react';

import Background from '../components/Background';
import BackButton from '../components/BackButton';
import { StyleSheet, Text,ImageBackground,Image , View,SafeAreaView,TouchableOpacity, KeyboardAvoidingView,Platform,StatusBar, Button } from 'react-native';
export default function ManageVolunteers({ navigation }) {
    return (
        <Background >
        <BackButton goBack={navigation.goBack} />
         {/*start your code here*/}
        <Text>its ManageVolunteers page start your code here</Text>
        </Background>
    );
}

