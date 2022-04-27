import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  HomeScreen,
  ManageGoods,
  ManageItems,
  ManageVolunteers,
  SeeStatistics
} from "../screens";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ManageGoods" component={ManageGoods} />
      <Stack.Screen name="ManageItems" component={ManageItems} />
      <Stack.Screen name="ManageVolunteers" component={ManageVolunteers} />
      <Stack.Screen name="SeeStatistics" component={SeeStatistics} />
    </Stack.Navigator>
  );
};
