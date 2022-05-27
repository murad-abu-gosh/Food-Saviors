import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Modal } from "react-native-paper";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BackButton from "../components/BackButton";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { Colors } from "../config";
import { addNewDropArea, deleteDocumentById, updateDocumentById } from "../config/database_interface";
import { theme } from "../core/theme";




export default function AddDropArea({ navigation, route }) {

    const [dropAreaID, setID] = useState("");
    const [dropAreaName, setName] = useState("");
    const [dropAreaAddress, setAddress] = useState("");
    const [dropAreaHoodName, setHoodName] = useState("");
    const [isRemovable, setIsRemovable] = useState(true);

    const [alertTitle, setAlertTitle] = useState("שגיאה");
    const [alertContent, setAlertContent] = useState("קרתה שגיאה");
    const [isAleretVisible, setIsAlertVisible] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    const [isForEdit, setIsForEdit] = useState(route.params?.isForEdit);

    useEffect(() => {

        if (route.params?.tempDropAreaInfo) {

            let currDropAreaInfo = route.params?.tempDropAreaInfo;

            setID(currDropAreaInfo.id);
            setName(currDropAreaInfo.name);
            setHoodName(currDropAreaInfo.hoodName);
            setAddress(currDropAreaInfo.address);

            if(currDropAreaInfo.isRemovable !== undefined){

                

                if (currDropAreaInfo.isRemovable === false){

                    setIsRemovable(() => false);
                } else {

                }
            }
        }

        setIsForEdit(route.params?.isForEdit);


    }, [route.params?.tempDropAreaInfo]);




    const onSaveButtonPressed = () => {

        if (!isValidInfo()) {
            return;
        } else {

            setIsProcessing(true);
        }

        let updatedDropAreaJSON = {
            "name": dropAreaName.trim(),
            "hoodName": dropAreaHoodName.trim(),
            "address": dropAreaAddress.toLowerCase().trim(),
        };

        if (isForEdit) {

            if(!isRemovable){
                updatedDropAreaJSON["isRemovable"] = false;
            }

            updateDocumentById("dropAreas", dropAreaID, updatedDropAreaJSON).then(() => {

                updatedDropAreaJSON["id"] = dropAreaID;

                navigation.navigate({ name: 'ManageDropArea', params: { tempDropAreaInfo: updatedDropAreaJSON, status: "updated" } });
            }).catch(() => {

                setAlertTitle("שגיאה בהעלאת הנתונים");
                setAlertContent("* נא לבדוק שיש חיבור לאינטרנט או לנסות מאוחר יותר");
                setIsProcessing(false);
                setIsAlertVisible(true);

                console.log("update failed");
            });

        } else {

            addNewDropArea(dropAreaName, dropAreaHoodName, dropAreaAddress).then((newDropAreaID) => {

                console.log("Hello: " + newDropAreaID);
                updatedDropAreaJSON["id"] = newDropAreaID;
                navigation.navigate({ name: 'ManageDropArea', params: { tempDropAreaInfo: updatedDropAreaJSON, status: "created" } });
            }).catch(() => {

                setAlertTitle("שגיאה בהעלאת הנתונים");
                setAlertContent("* נא לבדוק שיש חיבור לאינטרנט או לנסות מאוחר יותר");
                setIsProcessing(false);
                setIsAlertVisible(true);

                console.log("create failed");
            });
        }


    };

    const onDeleteButtonPressed = () => {

        Alert.alert(
            'האם אתה בטוח',
            'האם אתה בטוח שאתה רוצה למחוק את נקודת הפיזור הזאת?',
            [
                {
                    text: 'כן', onPress: () => {

                        setIsProcessing(true);

                        deleteDocumentById("dropAreas", dropAreaID).then(() => {

                            navigation.navigate({ name: 'ManageDropArea', params: { dropAreaID: dropAreaID, status: "deleted" } });

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

    const isValidInfo = () => {

        let errorsString = "";
       

        if (dropAreaName === "") {

            errorsString += "* שם נקודת הפיזור חובה\n";
        }

        if (dropAreaHoodName === "") {

            errorsString += "* שם השכונה חובה\n";
        }

        if (errorsString !== ""){

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

                        <TextInput style={styles.infoTextInputStyle} value={dropAreaName} onChangeText={(value) => setName(value)} placeholder="שם נקודת הפיזור" keyboardType="name-phone-pad"></TextInput>
                        <TextInput style={styles.infoTextInputStyle} value={dropAreaHoodName} onChangeText={(value) => setHoodName(value)} placeholder="שם השכונה" keyboardType="name-phone-pad"></TextInput>
                        <TextInput style={styles.infoTextInputStyle} value={dropAreaAddress} onChangeText={(value) => setAddress(value)} placeholder="כתובת נקודת הפיזור" keyboardType="name-phone-pad"></TextInput>

                    </View>

                </KeyboardAvoidingWrapper>



                <TouchableOpacity style={styles.saveButtonStyle} onPress={onSaveButtonPressed}><Text style={styles.saveButtonTextStyle}>שמור</Text></TouchableOpacity>

                <TouchableOpacity style={[styles.deleteButtonStyle, { display: isForEdit && isRemovable? "flex" : "none" }]} onPress={onDeleteButtonPressed}><Text style={styles.deleteButtonTextStyle}>הוסיר</Text></TouchableOpacity>

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

        </View >
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


