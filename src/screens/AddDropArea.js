import React, { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BackButton from "../components/BackButton";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { theme } from "../core/theme";




export default function AddDropArea({ navigation, route }) {

    const [dropAreaID, setID] = useState();
    const [dropAreaName, setName] = useState();
    const [dropAreaAddress, setAddress] = useState();

    const [isForEdit, setIsForEdit] = useState(route.params?.isForEdit);

    useEffect(() => {

        if (route.params?.tempDropAreaInfo) {

            let currDropAreaInfo = route.params?.tempDropAreaInfo;

            setID(currDropAreaInfo.dropAreaID);
            setName(currDropAreaInfo.dropAreaName);
            setAddress(currDropAreaInfo.dropAreaAddress);
        }

        setIsForEdit(route.params?.isForEdit);

        if (isForEdit === false) {
           
            setID((parseInt((Math.random() * Math.pow(10, 9)), 10)).toString())

        }
    }, [route.params?.tempDropAreaInfo]);
    

    

    const onSaveButtonPressed = () => {

        let dropAreaInfo = { dropAreaID: dropAreaID, dropAreaName: dropAreaName, dropAreaAddress: dropAreaAddress };

        navigation.navigate({ name: 'ManageDropArea', params: { tempDropAreaInfo: dropAreaInfo, isForEdit: isForEdit}, merge: true });

    };

    const onDeleteButtonPressed = () => {


    }

    const isValidInfo = () => {



    }



    return (



        <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>

            <BackButton goBack={navigation.goBack}></BackButton>


            <KeyboardAvoidingWrapper>

                <View style={styles.volunteerInfoInputContainer}>

                    <TextInput style={styles.infoTextInputStyle} value={dropAreaName} onChangeText={(value) => setName(value)} placeholder="שם נקודת הפיזור" keyboardType="name-phone-pad"></TextInput>
                    <TextInput style={styles.infoTextInputStyle} value={dropAreaAddress} onChangeText={(value) => setAddress(value)} placeholder="כתובת נקודת הפיזור" keyboardType="name-phone-pad"></TextInput>

                </View>

            </KeyboardAvoidingWrapper>



            <TouchableOpacity style={styles.saveButtonStyle} onPress={onSaveButtonPressed}><Text style={styles.saveButtonTextStyle}>שמור</Text></TouchableOpacity>

            <TouchableOpacity style={[styles.deleteButtonStyle, { display: isForEdit ? "flex" : "none" }]}><Text style={styles.deleteButtonTextStyle}>הוסיר</Text></TouchableOpacity>

        </ImageBackground>

    );

}

const styles = StyleSheet.create({

    background: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.surface,
    },

    volunteerInfoInputContainer: {
        width: "100%",
        height: "100%",
        marginTop: getStatusBarHeight() + 24 + 10 + 10 + 20,
        alignItems: "center",

    },

    infoTextInputStyle: {

        fontSize: 20,
        textAlign: "center",
        width: "75%",
        marginTop: 20,
        borderColor: "#1c6669",
        borderBottomWidth: 2,
        padding: 7
    },

    saveButtonStyle: {

        marginTop: 30,
        width: "75%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1c6669",
        padding: 13,
        borderRadius: 10

    },

    saveButtonTextStyle: {

        color: "white",
        fontSize: 25
    },

    deleteButtonStyle: {

        marginTop: 30,
        width: "75%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#c92323",
        padding: 13,
        borderRadius: 10
    },

    deleteButtonTextStyle: {

        color: "white",
        fontSize: 25
    }

});


