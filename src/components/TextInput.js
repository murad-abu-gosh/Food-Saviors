import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput as Input } from "react-native-paper";
import { theme } from "../core/theme";

export default function TextInput({ errorText, description, ...props }) {
  return (
    <View style={styles.container}>
      <Input
        theme={{ colors: { primary: 'green',underlineColor:'transparent',}}}
        style={styles.input}
        selectionColor={theme.colors.select}
        underlineColor="transparent"
        mode="outlined"
        borderColor = {theme.colors.primary}
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
    tintColor: theme.colors.primary,

    
  },
  description: {
    fontSize: 15,
    color: theme.colors.secondary,
    paddingTop: 8,
    textAlign: "right"
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
})
