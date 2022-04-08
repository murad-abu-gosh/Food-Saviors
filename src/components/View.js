import React from "react";
import { StyleSheet, View as RNView } from "react-native";

export const View = ({ isSafe, style, children }) => {
  // const insets = useSafeAreaInsets();

  if (isSafe) {
    return (
      <RNView style={StyleSheet.flatten(style)}>{children}</RNView>
    );
  }

  return <RNView style={StyleSheet.flatten(style)}>{children}</RNView>;
};
