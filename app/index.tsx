import React from "react";
import { AppRegistry } from "react-native";
import AppNavigator from "../navigation/AppNavigator"; // Import AppNavigator
import { name as appName } from "../app.json";


const App = () => (
  <AppNavigator /> // Main navigation with tabs and screens
);

AppRegistry.registerComponent(appName, () => App);
export default App;
