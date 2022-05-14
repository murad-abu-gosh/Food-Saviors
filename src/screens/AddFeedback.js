import React, { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BackButton from "../components/BackButton";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { auth } from "../config";
import { addNewFeedback } from "../config/database_interface";
import { theme } from "../core/theme";




export default function AddFeedback({ navigation, route }) {
 
    const [userID, setUserID] =  useState(auth.currentUser.uid);
    const [feedbackID, setID] = useState();
    const [feedbackTitle, setTitle] = useState();   
    const [feedbackUserInfo, setUserInfo] = useState();
    const [feedbackContent, setContent] = useState();
    const [isForEdit, setIsForEdit] = useState(route.params?.isForEdit);


    const getTodayDateStr = () => {

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = dd + '-' + mm + '-' + yyyy;

        return today;
    };

    const [feedbackDate, setDate] = useState(getTodayDateStr());

    
    useEffect(() => {

        if (route.params?.tempFeedbackInfo) {

            let currFeedbackInfo = route.params?.tempFeedbackInfo;

            setTitle(currFeedbackInfo.title);
            setUserInfo(route.params?.userInfo);
            setContent(currFeedbackInfo.content);
        }

        setIsForEdit(route.params?.isForEdit);

    }, [route.params?.tempFeedbackInfo]);
    

    

    const onSaveButtonPressed = () => {

        if(isForEdit){

            let updatedFeedbackJSON = {
                "userID": userID,
                "title": feedbackTitle,
                "date": feedbackDate,
                "content": feedbackContent
              }

            updateDocumentById("feedbacks", feedbackID, updatedFeedbackJSON).then(() => {

                navigation.navigate({ name: 'Feedback' });
            });
        } else {

            console.log(userID + " " + feedbackTitle + " " + feedbackDate + " " + feedbackContent);
            
            addNewFeedback(userID, feedbackTitle, feedbackDate, feedbackContent).then(() => {

                navigation.navigate({ name: 'Feedback' });
            });
        }

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

                    <TextInput style={styles.infoTextInputStyle} value={feedbackTitle} onChangeText={(value) => setTitle(value)} placeholder="כותרת המשוב" keyboardType="name-phone-pad"></TextInput>
                    <TextInput style={styles.infoTextInputStyle} value={feedbackContent} onChangeText={(value) => setContent(value)} placeholder="תוכן המשוב" keyboardType="name-phone-pad" multiline={true}></TextInput>

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


