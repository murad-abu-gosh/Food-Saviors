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



export default function AddVolunteer({ navigation, route }) {

    const [volunteerImageUri, setImage] = useState(Image.resolveAssetSource(require("../assets/addImagePic2.png")).uri);
    const [volunteerFullName, setFullName] = useState();
    const [volunteerEmail, setEmail] = useState();
    const [volunteerID, setID] = useState();
    const [volunteerPhoneNumber, setPhoneNumber] = useState();
    const [volunteerPassword, setPassword] = useState();
    const [volunteerType, setType] = useState();
    const [volunteerBirthdayDate, setDate] = useState()

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'מתנדב', value: 'volunteer' },
        { label: 'אדמין', value: 'admin' }
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

        let volunteerInfo = {volunteerFullName: volunteerFullName, volunteerID: volunteerID, volunteerEmail: volunteerEmail, volunteerPhoneNumber: volunteerPhoneNumber, volunteerBirthdayDate: volunteerBirthdayDate, volunteerType: volunteerType, volunteerImageUri: volunteerImageUri};

        console.log(volunteerInfo);

        navigation.navigate({name: 'ManageVolunteers', params: {tempVolunteerInfo: volunteerInfo, isForEdit: isForEdit}, merge: true});

    };

    const onDeleteButtonPressed = () => {


    }

    const isValidInfo = () => {

        

    }

    React.useEffect(() => {
        if (route.params?.tempVolunteerInfo) {
          
          let currVolunterInfo = route.params?.tempVolunteerInfo;
          
          setImage(currVolunterInfo.volunteerImageUri);
          setFullName(currVolunterInfo.volunteerFullName);
          setID(currVolunterInfo.volunteerID);
          setDate(currVolunterInfo.volunteerBirthdayDate);
          setPhoneNumber(currVolunterInfo.volunteerPhoneNumber);
          setEmail(currVolunterInfo.volunteerEmail);
          setType(currVolunterInfo.volunteerType);
          setValue(currVolunterInfo.volunteerType);
          setDropDownPlaceholder(currVolunterInfo.volunteerType);
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

                    <TextInput style={styles.infoTextInputStyle} value={volunteerID} onChangeText={(value) => setID(value)} placeholder="ת.ז" keyboardType="number-pad"></TextInput>

                    <TextInput style={styles.infoTextInputStyle} value={volunteerPhoneNumber} onChangeText={(value) => setPhoneNumber(value)} placeholder="מספר טלפון" keyboardType="phone-pad"></TextInput>

                    <TextInput style={styles.infoTextInputStyle} onChangeText={(value) => setPassword(value)} placeholder="סיסמה" keyboardType="name-phone-pad" secureTextEntry={true}></TextInput>

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
                    setType(value);
                    setValue(value);
                }}
            />

            <TouchableOpacity style={styles.saveButtonStyle} onPress={onSaveButtonPressed}><Text style={styles.saveButtonTextStyle}>שמור</Text></TouchableOpacity>

            <TouchableOpacity style={[styles.deleteButtonStyle, {display: isForEdit? "flex" : "none"}]}><Text style={styles.deleteButtonTextStyle}>הוסיר</Text></TouchableOpacity>
            
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


