import React, { useState } from "react";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { emailValidator } from "../helpers/emailValidator";
import { resetEmailPassword } from "../config/auth_interface";
import { theme } from "../core/theme";
import { ImageBackground, StyleSheet } from "react-native";
export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });

  const onResetPasswordPress = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    console.log(email.value);
    resetEmailPassword(email.value);
    navigation.navigate("Login");
  };

  return (
    <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>שחזור סיסמה</Header>
      <TextInput
        label="דוא״ל"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="תקבל אימייל עם קישור לאיפוס סיסמה."
      />
      <Button
        mode="contained"
        onPress={onResetPasswordPress}
        style={{ marginTop: 16, backgroundColor: theme.colors.primary }}
      >
        שלח
      </Button>
    </ImageBackground>
  )
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

});
