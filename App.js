import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import List from "./List";
import Detail from "./Detail";
import CameraScreen from "./Camera";
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from "react-native-paper";
import {
  Provider as PaperProvider,
  Button,
  Paragraph,
  Dialog,
  Portal,
} from "react-native-paper";
export default function App() {
  const Stack = createNativeStackNavigator();
  const [visible, setVisible] = React.useState(false);
  const { colors } = useTheme();
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setVisible(true);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <PaperProvider>
        <Portal>
          <Dialog
            style={{ backgroundColor: colors.primary }}
            visible={visible}
            onDismiss={() => setVisible(false)}
          >
            <Dialog.Title style={{ color: colors.background }}>
              Uyarı !
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: colors.background }}>
                Telefonunuz İnternete Bağlı Değil
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                style={{ backgroundColor: colors.background }}
                onPress={() => setVisible(false)}
              >
                Tamam
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Stack.Navigator>
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ headerShown: false }}
          />
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
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}
