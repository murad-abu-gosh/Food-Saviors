/* eslint-disable prettier/prettier */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootNavigator } from "./src/navigation";
import { AuthenticatedUserProvider } from "./src/providers";
import { LogBox } from 'react-native';
const Stack = createStackNavigator();

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['AsyncStorage']);

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
  // return (
  //   <Provider theme={theme}>
  //     <NavigationContainer>
  //       <Stack.Navigator
  //         initialRouteName="StartScreen"
  //         screenOptions={{
  //           headerShown: false,
  //         }}
  //       >
  //         <Stack.Screen name="StartScreen" component={StartScreen} />
  //         <Stack.Screen name="LoginScreen" component={LoginScreen} />
  //         <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
  //         <Stack.Screen name="HomeScreen" component={HomeScreen} />
  //         <Stack.Screen name="ManageGoods" component={ManageGoods} />
  //         <Stack.Screen name="ManageVolunteers" component={ManageVolunteers} />
  //         <Stack.Screen name="ManageItems" component={ManageItems} />
  //         <Stack.Screen name="SeeStatistics" component={SeeStatistics} />
  //
  //         <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   </Provider>
  // )
}