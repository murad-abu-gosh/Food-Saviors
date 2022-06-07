import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Modal } from "react-native-paper";
import BackButton from "../components/BackButton";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { auth, Colors } from "../config";
import { fetchDropAreasSorted } from "../config/database_interface";
import { theme } from "../core/theme";

export default function SeeStatistics({ navigation, route }) {

  // initializing the needed variables/useStates
  const [isByDropArea, setIsByDropArea] = useState(false);

  const [statisticsTypeDDP, setStatisticsTypeDDP] = useState("סוג סטטיסטיקה");

  const [statisticsTypeOpen, setStatisticsTypeOpen] = useState(false);
  const [statisticsTypeValue, setStatisticsTypeValue] = useState(null);
  const [statisticsTypeItems, setStatisticsTypeItems] = useState([
    { label: 'כללי', value: "general" },
    { label: 'לפי נקודה', value: "dropArea" }
  ]);

  const [dropAreasDDP, setDropAreasDDP] = useState("נא לבחור נקודה");

  const [dropAreasOpen, setDropAreasOpen] = useState(false);
  const [dropAreasValue, setDropAreasValue] = useState(null);
  const [dropAreasItems, setDropAreasItems] = useState([]);

  const [alertTitle, setAlertTitle] = useState("שגיאה");
  const [alertContent, setAlertContent] = useState("קרתה שגיאה");
  const [isAleretVisible, setIsAlertVisible] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const [mainStorageID, setMainStorageID] = useState("");

  // This function returns the date from now to before the given number of days
  const getDateBeforeNumOfDays = (numOfDays) => {

    let currDate = new Date();
    return currDate.setDate(currDate.getDate() - numOfDays);
  }

  // This funtion returns a date string with the format dd-mm-yyyy using the given date object
  const getDateStr = (dateObj) => {

    dateObj = new Date(dateObj);

    let dateString;

    let dd = String(dateObj.getDate()).padStart(2, '0');
    let mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    let yyyy = dateObj.getFullYear();

    dateString = dd + '-' + mm + '-' + yyyy;

    return dateString;
  };

  const [fromDateInput, setFromDateInput] = useState(getDateStr(getDateBeforeNumOfDays(7)));
  const [toDateInput, setToDateInput] = useState(getDateStr(getDateBeforeNumOfDays(0)));

  // This useEffect runs just once when the screen opens 
  // it fetches the data of the dropAreas from the firebase using the function fetchDropAreasSorted
  // so we can get the sttisticcs for spesific dropArea
  React.useEffect(() => {

    fetchDropAreasSorted().then((dropAreasInfo) => {

      let dropAreasDDInfo = [];

      dropAreasInfo.forEach((currDropArea) => {
        if(currDropArea.isMainStorage){
          setMainStorageID(currDropArea.id);
        }
        dropAreasDDInfo.push({ label: currDropArea.name, value: currDropArea.id });
      });

      dropAreasDDInfo.push({ label: "לפני הכניסה למחסן", value: "null" });

      setDropAreasItems(dropAreasDDInfo);
    });

  }, []);

  // This function handles the user click on the ConfirmationButton 
  // it checks the validity of the inputs then and it direct the user to the proper next screen
  const onConfirmationButtonPressed = () => {

    if (!isValidInfo()) {

      return;
    }

    if (isByDropArea) {

      navigation.navigate({ name: 'StatisticsDisplay', params: { statisticsFilter: { statisticsType: "dropArea", fromDate: fromDateInput, toDate: toDateInput, dropAreaID: dropAreasValue, isMainStorage: dropAreasValue === mainStorageID? true : false}} });

    } else {

      navigation.navigate({ name: 'StatisticsDisplay', params: { statisticsFilter: { statisticsType: "general", fromDate: fromDateInput, toDate: toDateInput } } });
    }

  }

  // This function checks if the inputs are valid and all th required fieldes are filled 
  // if there is an error the function displays an error message with the proper instructions
  const isValidInfo = () => {

    let errorsString = "";

    if ((!isValidDate(fromDateInput) && fromDateInput !== "") || (!isValidDate(toDateInput) && toDateInput !== "")) {

      errorsString += "* נא להזין תאריך תקין בפורמט הזה: \n\ndd-mm-yyyy\n\n* או להשאיר את הסדה ריק\n";
    }

    if(statisticsTypeValue === null){

      errorsString += "* נא לבחור סוג סטטיסטיקה\n";
    }

    if (isByDropArea && dropAreasValue === null) {

      errorsString += "* נא לבחור נקודה\n";
    }

    if (errorsString !== "") {

      setAlertTitle("שגיאות קלט");
      setAlertContent(errorsString);
      setIsAlertVisible(true);
      return false;
    }

    return true;
  }

  // This function checks if the date is in valid format which is dd-mm-yyyy
  const isValidDate = (dateString) => {
    // First check for the pattern
    let regex_date = /^\d{1,2}\-\d{1,2}\-\d{4}$/;

    if (!regex_date.test(dateString)) {
      return false;
    }

    // Parse the date parts to integers
    let parts = dateString.split("-");
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
      return false;
    }

    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
      monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  }


  return (
    <View style={styles.background}>

      <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>

        <BackButton goBack={navigation.goBack}></BackButton>


        <KeyboardAvoidingWrapper>

          <View style={styles.DatesInputContainer}>

            <TextInput style={styles.infoTextInputStyle} value={fromDateInput} onChangeText={(value) => setFromDateInput(value)} placeholder="מ- dd/mm/yyyy" keyboardType="name-phone-pad"></TextInput>
            <TextInput style={styles.infoTextInputStyle} value={toDateInput} onChangeText={(value) => setToDateInput(value)} placeholder="עד- dd/mm/yyyy" keyboardType="name-phone-pad"></TextInput>

          </View>

        </KeyboardAvoidingWrapper>


        <DropDownPicker placeholder={statisticsTypeDDP}
          style={{
            borderColor: "#1c6669",
            borderBottomWidth: 2,
          }}

          textStyle={{
            fontSize: 15,

          }}

          showTickIcon={false}
          containerStyle={styles.dropDownStyle}
          open={statisticsTypeOpen}
          value={statisticsTypeValue}
          items={statisticsTypeItems}
          setOpen={setStatisticsTypeOpen}
          setValue={setStatisticsTypeValue}
          setItems={setStatisticsTypeItems}
          onChangeValue={(value) => {
            setStatisticsTypeValue(value);
            if (value === "dropArea") {
              setIsByDropArea(true);
            } else {
              setIsByDropArea(false);
              setDropAreasOpen(false);
            }
          }}
          zIndex={3000}
          zIndexInverse={1000}
        />

        <DropDownPicker placeholder={dropAreasDDP}
          style={{
            borderColor: "#1c6669",
            borderBottomWidth: 2,
            display: (isByDropArea) ? "flex" : "none",
          }}

          textStyle={{
            fontSize: 15,

          }}

          showTickIcon={false}
          containerStyle={styles.dropDownStyle}
          open={dropAreasOpen}
          value={dropAreasValue}
          items={dropAreasItems}
          setOpen={setDropAreasOpen}
          setValue={setDropAreasValue}
          setItems={setDropAreasItems}
          onChangeValue={(value) => {

            setDropAreasValue(value);
          }}

          zIndex={2000}
          zIndexInverse={2000}

        />


        <TouchableOpacity style={styles.saveButtonStyle} onPress={onConfirmationButtonPressed}><Text style={styles.saveButtonTextStyle}>אישור</Text></TouchableOpacity>

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

    backgroundColor: theme.colors.surface,
    justifyContent: "center",
  },

  DatesInputContainer: {
    width: "100%",
    height: "100%",
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

    marginTop: 20,
    width: "75%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1c6669",
    padding: 13,
    borderRadius: 10,

  },

  saveButtonTextStyle: {

    color: "white",
    fontSize: 25,
  },

  dropDownStyle: {

    marginTop: 20,
    width: "75%",
    alignSelf: "center",

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

    textAlign: "center",
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

