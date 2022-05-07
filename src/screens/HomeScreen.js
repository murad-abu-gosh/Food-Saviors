import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";
import { auth } from "../config";

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      {/* hidden screen when you click in profile icon */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.HiddenScreen}>
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={styles.ProfileScreen}
          >
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Image
                  style={styles.avatar}
                  source={require("../assets/avatar.png")}
                />

                <Text style={styles.name}> add name here </Text>
              </View>
            </View>
            <View style={styles.DetailsContainer}>
              <Text style={styles.ProfileDetails}> ת.ז: </Text>
              <Text style={styles.ProfileDetails}> דואר אלקטרוני: </Text>
              <Text style={styles.ProfileDetails}> תאריך לידה: </Text>
            </View>
            <TouchableOpacity
              onPress={() => auth.signOut()}
              style={styles.logOutButtonContainer}
            >
              <Text style={styles.appButtonText}>התנתק</Text>
            </TouchableOpacity>
          </Pressable>

        </View>
      </Modal>
      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={require("../assets/profile.png")}
          style={styles.profileIcon}
        />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <SafeAreaView style={styles.LogoTextContainer}>
          <Text style={styles.Text}>ניצול מזון : 79879</Text>

          <Logo />
        </SafeAreaView>
        {/* all the button  */}
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("ManageGoods")}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>ניהול סחורות</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ManageItems")}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>ניהול פריטים</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("SeeStatistics")}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>צפו בסטטיסטיקה</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ManageVolunteers")}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>ניהול מתנדבים</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ManageDropArea")}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>ניהול נקודות פיזור</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Feedback")}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>משובים</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => navigation.navigate("TestScreen")}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>Test</Text>
        </TouchableOpacity> */}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  profileIconContainer: {
    position: "absolute",
    top: 60,
    right: 4,
    width: 50,
    height: 50
  },
  profileIcon: {
    width: 50,
    height: 50
  },
  HiddenScreen: {
    flex: 1,
    backgroundColor: "#000000aa"
  },
  ProfileScreen: {
    flex: 1,
    backgroundColor: "#ffffff",
    margin: 40,
    padding: 10,
    borderRadius: 10
  },
  header: {
    backgroundColor: "#1c6669",
    borderRadius: 10
  },
  headerContent: {
    padding: 30,
    alignItems: "center"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600"
  },
  DetailsContainer: {
    flex: 1,
    justifyContent: "space-evenly"
  },
  ProfileDetails: {
    fontSize: 20,
    fontWeight: "bold"
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 16,
    borderRadius: 100
  },
  appButtonContainer: {
    alignSelf: "center",
    elevation: 8,
    backgroundColor: "#1c6669",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 200
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  Text: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  LogoTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  logOutButtonContainer: {
    alignSelf: "center",
    elevation: 8,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 200
  }
});
