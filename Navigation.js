import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import List from "./List";
import Detail from "./Detail";
import CameraScreen from "./Camera";

export default function Navigation() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Screen name="Camera" component={CameraScreen} />
      {/* <Stack.Navigator>
        <Stack.Screen
          name="List"
          component={List}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Detail"
          component={Detail}
          options={{ headerShown: false }}
        />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}
