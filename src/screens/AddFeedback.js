import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native-paper";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BackButton from "../components/BackButton";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { auth, Colors } from "../config";
import { addNewFeedback, deleteDocumentById, updateDocumentById } from "../config/database_interface";
import { theme } from "../core/theme";


export default function AddFeedback({ navigation, route }) {

    // initializing the needed variables/useStates
    const [userID, setUserID] = useState(auth.currentUser.uid);
    const [feedbackID, setID] = useState("");
    const [feedbackTitle, setTitle] = useState("");
    const [feedbackContent, setContent] = useState("");
    const [isForEdit, setIsForEdit] = useState(route.params?.isForEdit);
    const [alertTitle, setAlertTitle] = useState("שגיאה");
    const [alertContent, setAlertContent] = useState("קרתה שגיאה");
    const [isAleretVisible, setIsAlertVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedbackDate, setDate] = useState();


    // This useEffect runs when the screen opens it filles the input fieldes with the feedback data in the case of edit
    // which means that there is a variable called tempFeedbackInfo and it fills the indecator isForEdit so we can decide which components to display
    useEffect(() => {

        if (route.params?.tempFeedbackInfo) {

            let currFeedbackInfo = route.params?.tempFeedbackInfo;

            setUserID(currFeedbackInfo.userID);
            setID(currFeedbackInfo.id);
            setTitle(currFeedbackInfo.title);
            setDate(currFeedbackInfo.date);
            setContent(currFeedbackInfo.content);
        }

        setIsForEdit(route.params?.isForEdit);

    }, [route.params?.tempFeedbackInfo]);



    // This function runs when the user clicks on the save button 
    // it takes care about the update and create cases
    // also it checks the validity of the information using the function isValidInfo
    const onSaveButtonPressed = () => {

        if (!isValidInfo()) {
            return;
        } else {

            setIsProcessing(true);
        }

        let updatedFeedbackJSON = {
            "userID": isForEdit ? userID : auth.currentUser.uid,
            "title": feedbackTitle.trim(),
            "date": isForEdit ? feedbackDate : new Date(),
            "content": feedbackContent.trim()
        }

        if (isForEdit) {

            console.log(userID + " " + feedbackID + " " + feedbackTitle + " " + updatedFeedbackJSON.date + " " + feedbackContent);

            updateDocumentById("feedbacks", feedbackID, updatedFeedbackJSON).then(() => {


                updatedFeedbackJSON["id"] = feedbackID;
                navigation.navigate({ name: 'Feedback', params: { tempFeedbackInfo: updatedFeedbackJSON, status: "updated" } });
            }).catch(() => {

                setAlertTitle("שגיאה בהעלאת הנתונים");
                setAlertContent("* נא לבדוק שיש חיבור לאינטרנט או לנסות מאוחר יותר");
                setIsProcessing(false);
                setIsAlertVisible(true);

                console.log("update failed");
            });

        } else {

            console.log(userID + " " + feedbackTitle + " " + updatedFeedbackJSON.date + " " + feedbackContent);

            addNewFeedback(auth.currentUser.uid, feedbackTitle, updatedFeedbackJSON.date, feedbackContent).then((newFeedbackID) => {


                updatedFeedbackJSON["id"] = newFeedbackID;
                navigation.navigate({ name: 'Feedback', params: { tempFeedbackInfo: updatedFeedbackJSON, status: "created" } });
            }).catch(() => {

                setAlertTitle("שגיאה בהעלאת הנתונים");
                setAlertContent("* נא לבדוק שיש חיבור לאינטרנט או לנסות מאוחר יותר");
                setIsProcessing(false);
                setIsAlertVisible(true);

                console.log("create failed");
            });
        }

    };

    // This function runs when the user clicks the delete button it shoes the user an alert if the user clicks yes
    // the function calls the porper database function to delete the item from the firebase 
    const onDeleteButtonPressed = () => {

        Alert.alert(
            'האם אתה בטוח',
            'האם אתה בטוח שאתה רוצה למחוק את המשוב הזה?',
            [
                {
                    text: 'כן', onPress: () => {

                        setIsProcessing(true);

                        deleteDocumentById("feedbacks", feedbackID).then(() => {


                            navigation.navigate({ name: 'Feedback', params: { feedbackID: feedbackID, status: "deleted" } });

                        }).catch(() => {

                            setAlertTitle("שגיאה במחיקת הנתונים");
                            setAlertContent("* נא לבדוק שיש חיבור לאינטרנט או לנסות מאוחר יותר");
                            setIsProcessing(false);
                            setIsAlertVisible(true);

                            console.log("delete failed");
                        });

                    },
                },
                { text: 'לא', onPress: () => { }, style: 'cancel' },
            ]
        );
    }

    // This function checks if the inputs are valid and all th required fieldes are filled 
    // if there is an error the function displays an error message with the proper instructions
    const isValidInfo = () => {


        let errorsString = "";

        if (feedbackTitle === "") {

            errorsString += "* כותרת המשוב חובה\n";
        }

        if (feedbackContent === "") {

            errorsString += "* תוכן המשוב חובה\n";
        }

        if (errorsString !== "") {

            setAlertTitle("שגיאות קלט");
            setAlertContent(errorsString);
            setIsAlertVisible(true);
            return false;
        }

        return true;
    }



    return (


        <View style={styles.background}>
            <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>

                <BackButton goBack={navigation.goBack}></BackButton>


                <KeyboardAvoidingWrapper>

                    <View style={styles.volunteerInfoInputContainer}>

                        <TextInput style={styles.infoTextInputStyle} value={feedbackTitle} onChangeText={(value) => setTitle(value)} placeholder="כותרת המשוב" keyboardType="name-phone-pad"></TextInput>
                        <TextInput maxHeight={200} numberOfLines={4} style={styles.infoTextInputStyle} value={feedbackContent} onChangeText={(value) => setContent(value)} placeholder="תוכן המשוב" keyboardType="name-phone-pad" multiline={true}></TextInput>

                    </View>

                </KeyboardAvoidingWrapper>



                <TouchableOpacity style={styles.saveButtonStyle} onPress={onSaveButtonPressed}><Text style={styles.saveButtonTextStyle}>שמור</Text></TouchableOpacity>

                <TouchableOpacity style={[styles.deleteButtonStyle, { display: isForEdit ? "flex" : "none" }]} onPress={onDeleteButtonPressed}><Text style={styles.deleteButtonTextStyle}>הוסיר</Text></TouchableOpacity>

            </ImageBackground>

            <Modal visible={isAleretVisible}>

                <View style={styles.alertContainer}>

                    <View style={styles.alertContentContainer}>

                        <Text style={styles.alertTitleTextStyle}>{alertTitle}</Text>

                        <Text style={styles.alertContentText}>{alertContent}</Text>

                        <TouchableOpacity style={styles.alertCloseButtonStyle} onPress={() => setIsAlertVisible(false)}><Text style={styles.alertButtonTextStyle}>סגור</Text></TouchableOpacity>

                    </View>

                </View>

            </Modal>

            <Modal visible={isProcessing}>

                <View style={styles.processingAlertContainer}>

                    <View style={styles.processingAlertContentContainer}>

                        <Text style={styles.processingAlertTextStyle}>הפעולה מתבצעת ...</Text>

                        <ActivityIndicator size="large" color={Colors.primary} />

                    </View>

                </View>

            </Modal>

        </View>

    );

}

// styling the screen and the components
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
    },


    alertContainer: {
        flexDirection: "column",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },

    alertContentContainer: {

        width: "70%",
        backgroundColor: "white",
        borderColor: "#ff3333",
        borderWidth: 3,
        borderRadius: 7,
        padding: 10
    },

    alertTitleTextStyle: {
        fontSize: 25,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 15,
        color: "#ff3333",

    },

    alertContentText: {

        textAlign: "right",
        fontSize: 16,
        marginBottom: 10,
        color: "#ff3333",
        paddingRight: 8
    },

    alertCloseButtonStyle: {

        width: "70%",
        height: 50,
        backgroundColor: "white",
        borderColor: "#ff3333",
        borderWidth: 2,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center",
    },

    alertButtonTextStyle: {

        fontSize: 18,
        color: "#ff3333",
    },

    processingAlertContainer: {
        flexDirection: "column",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },

    processingAlertContentContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        padding: 20,
        borderWidth: 3,
        borderColor: "#1c6669"
    },

    processingAlertTextStyle: {

        fontSize: 20,
        marginRight: 15
    }

});


