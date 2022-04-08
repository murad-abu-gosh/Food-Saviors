import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  StartScreen
} from "../screens";

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={RegisterScreen} />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="ForgotPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};
