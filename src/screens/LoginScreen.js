import React, { useState } from "react";
import { ActivityIndicator, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import { Modal, Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, Colors } from "../config";
import { getUserByEmail } from "../config/database_interface";


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [errorState, setErrorState] = useState("");

  const [alertTitle, setAlertTitle] = useState("שגיאה");
  const [alertContent, setAlertContent] = useState("קרתה שגיאה");
  const [isAleretVisible, setIsAlertVisible] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const onLoginPressed = () => {

    setIsProcessing(true);

    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    getUserByEmail(email.value.toLowerCase()).then((currUserInfo) => {

      console.log("$$$$$$$$$$$$$$");
      console.log(currUserInfo);

      if (currUserInfo === undefined || currUserInfo.isActive === false) {

        setAlertTitle("שגיאה");
        setAlertContent("* נא לוודא דוא״ל וסיסמה");
        setIsProcessing(false);
        setIsAlertVisible(true);

      } else {

        signInWithEmailAndPassword(auth, email.value, password.value).catch(error => {
          setErrorState(error.message);

          setAlertTitle("שגיאה");
          setAlertContent("* נא לוודא דוא״ל וסיסמה");
          setIsProcessing(false);
          setIsAlertVisible(true);
        });
      }
    });




  };

  return (
    <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Logo />
      <Header>מצילות המזון</Header>
      <TextInput
        label="דוא״ל"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="סיסמה"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgot}>שכחת ססמתך?</Text>
        </TouchableOpacity>
      </View>
      <Button style={styles.button} mode="contained" onPress={onLoginPressed}>
        כניסה
      </Button>


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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
},
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24
  },
  button: {
    backgroundColor: theme.colors.primary
  },
  row: {
    flexDirection: "row",
    marginTop: 4
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary
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
