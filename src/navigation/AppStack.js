import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  AddDropArea,
  AddFeedback,
  AddVolunteer,
  ExportAndWaste,
  Feedback,
  HomeScreen,
  ManageDropArea,
  ManageGoods,
  ManageItems,
  ManageVolunteers,
  SeeStatistics,
  StatisticsDisplay,
  UpdateGoods
 
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
      <Stack.Screen name="AddVolunteer" component={AddVolunteer} />
      <Stack.Screen name="ManageDropArea" component={ManageDropArea} />
      <Stack.Screen name="AddDropArea" component={AddDropArea} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="AddFeedback" component={AddFeedback} />
      <Stack.Screen name="SeeStatistics" component={SeeStatistics} />
      <Stack.Screen name="StatisticsDisplay" component={StatisticsDisplay} />
      <Stack.Screen name="UpdateGoods" component={UpdateGoods} />
      <Stack.Screen name="ExportAndWaste" component={ExportAndWaste} />
      
    </Stack.Navigator>
  );
};
