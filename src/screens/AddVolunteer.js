import React, { useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import DatePicker from 'react-native-datepicker'
import DropDownPicker from "react-native-dropdown-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BackButton from "../components/BackButton";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { theme } from "../core/theme";
import * as ImagePicker from "expo-image-picker";
import { createNewUser, deleteDocumentById, updateDocumentById } from "../config/database_interface";



export default function AddVolunteer({ navigation, route }) {

    const [volunterID, setID] = useState();
    const [volunteerPersonalID, setPersonalID] = useState();
    const [volunteerImageUri, setImage] = useState(Image.resolveAssetSource(require("../assets/addImagePic2.png")).uri);
    const [volunteerFullName, setFullName] = useState();
    const [volunteerEmail, setEmail] = useState();
    const [volunteerPhoneNumber, setPhoneNumber] = useState();
    const [volunteerPassword, setPassword] = useState();
    // const [passwordFieldDisplay, setPasswordDisplay] = useState("flex");
    const [volunteerRank, setRank] = useState();
    const [volunteerBirthdayDate, setDate] = useState()

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Head Admin', value: 0 },
        { label: 'Admin', value: 1 },
        { label: 'Volunteer', value: 2 }
    ]);

    const [dropDownPlaceholder, setDropDownPlaceholder] = useState("סוג משתמש" );

    const [isForEdit, setIsForEdit] = useState(false);
    
    const pickImage = async () => {
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const onSaveButtonPressed = () => {

        if(isForEdit){

            let updatedUserJSON = {
                "name": volunteerFullName,
                "email" : volunteerEmail,
                "personalID" : volunteerPersonalID,
                "image": volunteerImageUri,
                "phoneNumber" : volunteerPhoneNumber,
                "birthDate" : volunteerBirthdayDate,
                "rank" : volunteerRank
              };

            updateDocumentById("users", volunterID, updatedUserJSON).then(() => {

                navigation.navigate({ name: 'ManageVolunteers' });
            });

        } else {

            createNewUser(volunteerEmail, volunteerPassword, volunteerFullName, volunteerPersonalID, volunteerPhoneNumber, volunteerImageUri, volunteerBirthdayDate, volunteerRank).then(() => {

                navigation.navigate({ name: 'ManageVolunteers' });
            });
        }

        

    };

    const getUserRankString = (userRank) => {

        switch(userRank){
    
          case 0:
            return "Head Admin";
    
          case 1:
            return "Admin";
    
          case 2:
            return "volunteer";
    
          default:
            return "No Type";
    
        }    
      }

    const onDeleteButtonPressed = () => {
        /// T-Shirt
        
        deleteDocumentById("users", volunterID).then(() => {

            navigation.navigate({ name: 'ManageVolunteers' });
        });
        
    }

    const isValidInfo = () => {

        

    }

    React.useEffect(() => {
        if (route.params?.tempVolunteerInfo) {
          
          let currVolunterInfo = route.params?.tempVolunteerInfo;

          console.log("Here");
          console.log(currVolunterInfo);
          
          setID(currVolunterInfo.id);
          setImage(currVolunterInfo.image);
          setFullName(currVolunterInfo.name);
          setPersonalID(currVolunterInfo.personalID);
          setDate(currVolunterInfo.birthDate);
          setPhoneNumber(currVolunterInfo.phoneNumber);
          setEmail(currVolunterInfo.email);
          setRank(currVolunterInfo.rank);
          setValue(currVolunterInfo.rank);
          setDropDownPlaceholder(getUserRankString(currVolunterInfo.rank));
        }

        if (route.params?.isForEdit){
            setIsForEdit(true);
        }
      }, [route.params?.tempVolunteerInfo]);

    return (



        <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>

            <BackButton goBack={navigation.goBack}></BackButton>


            <KeyboardAvoidingWrapper>



                <View style={styles.volunteerInfoInputContainer}>


                    <TouchableOpacity style={styles.toucheableImageContainer} onPress={pickImage}><Image style={styles.volunteerCircleImageStyle} source={{uri : volunteerImageUri}}></Image></TouchableOpacity>

                    <TextInput style={styles.infoTextInputStyle} value={volunteerFullName} onChangeText={(value) => setFullName(value)} placeholder="שם המתנדב" keyboardType="name-phone-pad"></TextInput>

                    <TextInput style={styles.infoTextInputStyle} value={volunteerEmail} onChangeText={(value) => setEmail(value)} placeholder="דואר אלקטרוני" keyboardType="email-address"></TextInput>

                    <TextInput style={styles.infoTextInputStyle} value={volunteerPersonalID} onChangeText={(value) => setPersonalID(value)} placeholder="ת.ז" keyboardType="number-pad"></TextInput>

                    <TextInput style={styles.infoTextInputStyle} value={volunteerPhoneNumber} onChangeText={(value) => setPhoneNumber(value)} placeholder="מספר טלפון" keyboardType="phone-pad"></TextInput>

                    <TextInput style={[styles.infoTextInputStyle, {display: isForEdit? "none" : "flex"}]} onChangeText={(value) => setPassword(value)} placeholder="סיסמה" keyboardType="name-phone-pad" secureTextEntry={true}></TextInput>

                    <DatePicker
                        style={styles.datePickerStyle}
                        date={volunteerBirthdayDate} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        placeholder="תאריך לידה"
                        format="DD-MM-YYYY"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                display: 'none',
                            },
                            dateInput: {
                                borderWidth: 0,
                            },
                            placeholderText: {
                                fontSize: 19,
                                color: "#b7b7b7"
                            },
                            dateText: {
                                fontSize: 20,
                            }, dateTouchBody: {
                                marginTop: 0
                            }
                        }}
                        onDateChange={(date) => {
                            setDate(date);
                        }}
                    />

                </View>


            </KeyboardAvoidingWrapper>

            <DropDownPicker placeholder={dropDownPlaceholder}
                style={{
                    borderColor: "#1c6669",
                    borderBottomWidth: 2
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

            <TouchableOpacity style={[styles.deleteButtonStyle, {display: isForEdit? "flex" : "none"}]} onPress={onDeleteButtonPressed}><Text style={styles.deleteButtonTextStyle}>הוסיר</Text></TouchableOpacity>
            
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

    datePickerStyle: {
        width: "75%",
        marginTop: 10,
        borderColor: "black",
        borderColor: "#1c6669",
        borderBottomWidth: 2
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
    }

});


