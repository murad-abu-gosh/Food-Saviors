import React, { useState } from "react";
import { Alert, Image, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BackButton from "../components/BackButton";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { theme } from "../core/theme";
import * as ImagePicker from "expo-image-picker";
import { createNewUser, deleteDocumentById, deleteUser, fetchDocumentById, updateDocumentById, updateUser } from "../config/database_interface";
import { auth, Colors } from "../config";
import { ActivityIndicator, Modal } from "react-native-paper";

export default function AddVolunteer({ navigation, route }) {

    const addPicImageURI = Image.resolveAssetSource(require("../assets/addImagePic2.png")).uri;

    const [volunterID, setID] = useState("");
    const [volunteerPersonalID, setPersonalID] = useState("");
    const [volunteerImageUri, setImage] = useState(addPicImageURI);
    const [volunteerFullName, setFullName] = useState("");
    const [volunteerEmail, setEmail] = useState("");
    const [volunteerPhoneNumber, setPhoneNumber] = useState("");
    const [volunteerPassword, setPassword] = useState("");
    const [volunteerRank, setRank] = useState(2);


    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        // { label: 'Head Admin', value: 0 },
        { label: 'אדמינ/ת', value: 1 },
        { label: 'מתנדב/ת', value: 2 }
    ]);

    const [dropDownPlaceholder, setDropDownPlaceholder] = useState("סוג משתמש");

    const [isForEdit, setIsForEdit] = useState(false);

    const [isHeadAdmin, setIsHeadAdmin] = useState(false);

    const [alertTitle, setAlertTitle] = useState("שגיאה");
    const [alertContent, setAlertContent] = useState("קרתה שגיאה");
    const [isAleretVisible, setIsAlertVisible] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    React.useEffect(() => {

        fetchDocumentById("users", auth.currentUser.uid).then((currUserInfo) => {
            console.log(currUserInfo);
            setIsHeadAdmin(() => (currUserInfo.rank === 0));

            console.log(isHeadAdmin);
        });
    }, []);

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const onSaveButtonPressed = () => {

        if (!isValidInfo()) {
            return;
        } else {

            setIsProcessing(true);
        }

        let updatedUserJSON = {
            "name": volunteerFullName.trim(),
            "email": volunteerEmail.toLowerCase().trim(),
            "personalID": volunteerPersonalID.trim(),
            "image": volunteerImageUri.trim() !== addPicImageURI ? volunteerImageUri.trim() : null,
            "phoneNumber": volunteerPhoneNumber.trim(),
            "rank": volunteerRank
        };

        console.log("Image URi Local: " + updatedUserJSON.image);

        if (isForEdit) {



            updateUser(volunterID, updatedUserJSON).then(() => {

                updatedUserJSON["id"] = volunterID;

                navigation.navigate({ name: 'ManageVolunteers', params: { tempVolunteerInfo: updatedUserJSON, status: "updated" } });
            }).catch(() => {

                setAlertTitle("שגיאה בהעלאת הנתונים");
                setAlertContent("* נא לבדוק שיש חיבור לאינטרנט או לנסות מאוחר יותר");
                setIsProcessing(false);
                setIsAlertVisible(true);

                console.log("update failed");
            });

        } else {

            console.log("***********************");
            console.log(updatedUserJSON);

            createNewUser(updatedUserJSON.email, volunteerPassword, volunteerFullName, volunteerPersonalID, volunteerPhoneNumber, updatedUserJSON.image, volunteerRank).then((newVolunteerID) => {

                console.log("Hello: " + newVolunteerID);
                updatedUserJSON["id"] = newVolunteerID;
                navigation.navigate({ name: 'ManageVolunteers', params: { tempVolunteerInfo: updatedUserJSON, status: "created" } });
            }).catch((E) => {

                console.log(E);

                setAlertTitle("שגיאה בהעלאת הנתונים");
                setAlertContent("* נא לבדוק שיש חיבור לאינטרנט או לנסות מאוחר יותר");
                setIsProcessing(false);
                setIsAlertVisible(true);

                console.log("create failed");
            });
        }

    };

    const getUserRankString = (userRank) => {

        switch (userRank) {

            case 0:
                return "אחראי/ת המערכת";

            case 1:
                return "אדמין/ת";

            case 2:
                return "מתנדב/ת";

            default:
                return "No Type";

        }
    }

    const onDeleteButtonPressed = () => {
        /// T-Shirt

        console.log("UserId: " + volunterID);

        Alert.alert(
            'האם אתה בטוח',
            'האם אתה בטוח שאתה רוצה למחוק את המשתמש הזה?',
            [
                {
                    text: 'כן', onPress: () => {

                        setIsProcessing(true);

                        deleteUser(volunterID).then(() => {

                            navigation.navigate({ name: 'ManageVolunteers', params: { volunteerID: volunterID, status: "deleted" } });

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
        const re = /\S+@\S+\.\S+/;

        if (volunteerFullName === "") {

            errorsString += "* שם מתנדב/ת חובה\n";
        }

        if (volunteerPersonalID === "") {

            errorsString += "* מספר ת.ז חובה\n";
        } else if (volunteerPersonalID.trim().length != 9 || isNaN(volunteerPersonalID)) {

            errorsString += "* מספר ת.ז שגוי\n";
        }

        if (volunteerPhoneNumber === "") {

            errorsString += "* מספר טלפון חובה\n";
        } else if ((volunteerPhoneNumber.trim().length != 10 && volunteerPhoneNumber.trim().length != 9) || isNaN(volunteerPhoneNumber)) {

            errorsString += "* מספר טלפון שגוי\n";
        }



        if (!isForEdit) {

            if (volunteerEmail === "") {

                errorsString += "* דוא״ל חובה\n";

            } else if (!re.test(volunteerEmail)) {

                errorsString += "* דוא״ל שגוי\n";
            }

            if ((volunteerPassword === "") || (volunteerPassword.trim().length < 5)) {

                errorsString += "* סיסמה לפחות 5 אותיות או מספרים\n";
            }
        }

        if (isHeadAdmin && value === null) {

            errorsString += "* סוג משתמש חובה\n"
        }


        if (errorsString !== "") {
            setAlertTitle("שגיאות קלט");
            setAlertContent(errorsString);
            setIsAlertVisible(true);
            return false;
        }

        return true;
    }

    React.useEffect(() => {
        if (route.params?.tempVolunteerInfo) {

            let currVolunterInfo = route.params?.tempVolunteerInfo;

            setID(currVolunterInfo.id);
            setImage((currVolunterInfo.image === null) ? addPicImageURI : currVolunterInfo.image);
            setFullName(currVolunterInfo.name);
            setPersonalID(currVolunterInfo.personalID);
            setPhoneNumber(currVolunterInfo.phoneNumber);
            setEmail(currVolunterInfo.email);
            setRank(currVolunterInfo.rank);
            setValue(currVolunterInfo.rank);
            setDropDownPlaceholder(getUserRankString(currVolunterInfo.rank));
        }

        if (route.params?.isForEdit) {
            setIsForEdit(true);
        }
    }, [route.params?.tempVolunteerInfo]);

    return (

        <View style={styles.background}>





            <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>



                <BackButton goBack={navigation.goBack}></BackButton>

                <KeyboardAvoidingWrapper>



                    <View style={styles.volunteerInfoInputContainer}>


                        <TouchableOpacity style={styles.toucheableImageContainer} onPress={pickImage}><Image style={styles.volunteerCircleImageStyle} source={{ uri: volunteerImageUri }}></Image></TouchableOpacity>

                        <TextInput style={styles.infoTextInputStyle} value={volunteerFullName} onChangeText={(value) => setFullName(value)} placeholder="שם המתנדב/ת" keyboardType="name-phone-pad"></TextInput>

                        <TextInput style={[styles.infoTextInputStyle, { display: isForEdit ? "none" : "flex" }]} value={volunteerEmail} onChangeText={(value) => setEmail(value)} placeholder="דואר אלקטרוני" keyboardType="email-address"></TextInput>

                        <TextInput style={styles.infoTextInputStyle} value={volunteerPersonalID} onChangeText={(value) => setPersonalID(value)} placeholder="ת.ז" keyboardType="number-pad"></TextInput>

                        <TextInput style={styles.infoTextInputStyle} value={volunteerPhoneNumber} onChangeText={(value) => setPhoneNumber(value)} placeholder="מספר טלפון" keyboardType="phone-pad"></TextInput>

                        <TextInput style={[styles.infoTextInputStyle, { display: isForEdit ? "none" : "flex" }]} onChangeText={(value) => setPassword(value)} placeholder="סיסמה" keyboardType="name-phone-pad" secureTextEntry={true}></TextInput>



                    </View>


                </KeyboardAvoidingWrapper>

                <DropDownPicker placeholder={dropDownPlaceholder}
                    style={{
                        borderColor: "#1c6669",
                        borderBottomWidth: 2,
                        display: (isHeadAdmin && volunteerRank !== 0) ? "flex" : "none",
                    }}

                    textStyle={{
                        fontSize: 15,

                    }}
                    showTickIcon={false}
                    containerStyle={styles.dropDownStyle}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    onChangeValue={(value) => {
                        setRank(value);
                        setValue(value);
                    }}

                />

                <TouchableOpacity style={styles.saveButtonStyle} onPress={onSaveButtonPressed}><Text style={styles.saveButtonTextStyle}>שמור</Text></TouchableOpacity>

                <TouchableOpacity style={[styles.deleteButtonStyle, { display: (isForEdit && volunteerRank !== 0) ? "flex" : "none" }]} onPress={onDeleteButtonPressed}><Text style={styles.deleteButtonTextStyle}>הוסיר</Text></TouchableOpacity>


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

    toucheableImageContainer: {

        borderRadius: 60,
        width: 120,
        height: 120,
        borderColor: "black",
        borderWidth: 3,
        alignItems: "center",
        justifyContent: "center"
    },

    volunteerCircleImageStyle: {
        borderRadius: 60,
        borderColor: "#1c6669",
        borderWidth: 3,
        width: 120,
        height: 120,

    },

    infoTextInputStyle: {

        fontSize: 20,
        textAlign: "center",
        width: "75%",
        marginTop: 10,
        borderColor: "#1c6669",
        borderBottomWidth: 2,
        padding: 7
    },



    dropDownStyle: {

        marginTop: 20,
        width: "75%",
        alignSelf: "center",

    },

    saveButtonStyle: {

        marginTop: 20,
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

        marginTop: 20,
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


