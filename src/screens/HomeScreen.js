import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";
import { auth } from "../config";
import { fetchDocumentById, fetchImportRecordsSorted, getGeneralStatisticsArray } from "../config/database_interface";


// async function testFun() {
//   const sevenDaysAgo: Date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)  
//   // let fromDate = new Date();
//   // let toDate = new Date();
//   // console.log("7 days ago: ", sevenDaysAgo);
//   // console.log("from date: ", fromDate);
//   // console.log("to date: ", toDate);
//   console.log(await getGeneralStatisticsArray(null, sevenDaysAgo));
// }

export default function HomeScreen({ navigation }) {

  console.log(auth.currentUser.uid);
  const [modalVisible, setModalVisible] = useState(false);

  const profileDefaultImageUri = Image.resolveAssetSource(require("../assets/profile_default_image.png")).uri;

  const [currUserInfo, setCurrUserInfo] = useState({ name: "", image: profileDefaultImageUri, personalID: "", email: "", phoneNumber: "", rank: 2 });

  const [isAdmin, setIsAdmin] = useState(false);

  const getUserRankString = (userRank) => {

    switch (userRank) {

      case 0:
        return "אחראי/ת המערכת";

      case 1:
        return "אדמין/ת";

      case 2:
        return "מתנדב/ת";

      default:
        return "No Type";

    }
  }

  const getAndCheckUserInfo = async () => {

    fetchDocumentById("users", auth.currentUser.uid).then((userInfoResult) => {

      if (userInfoResult.isActive === false) {

        auth.signOut();
      } else {

        let userJSONObj = { name: userInfoResult.name, image: userInfoResult.image === null ? profileDefaultImageUri : userInfoResult.image, personalID: userInfoResult.personalID, email: userInfoResult.email, phoneNumber: userInfoResult.phoneNumber, rank: userInfoResult.rank };

        setCurrUserInfo(() => userJSONObj);

        if (userJSONObj.rank <= 1) {
          setIsAdmin(true);
        }
      }
    });
  }

  React.useEffect(() => {

    getAndCheckUserInfo();

  }, []);

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
                  source={{ uri: currUserInfo.image }}
                />

                <Text style={styles.name}> {currUserInfo.name} </Text>
              </View>
            </View>
            <View style={styles.DetailsContainer}>
              <Text style={styles.ProfileDetails}> ת.ז: {currUserInfo.personalID} </Text>
              <Text style={styles.ProfileDetails}> דוא״ל: {currUserInfo.email}</Text>
              <Text style={styles.ProfileDetails}> טל״ס: {currUserInfo.phoneNumber}</Text>
              <Text style={styles.ProfileDetails}>סוג משתמש/ת: {getUserRankString(currUserInfo.rank)}</Text>
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
        onPress={() => {
          getAndCheckUserInfo();
          setModalVisible(true);
        }}
      >
        <Image
          source={require("../assets/profile.png")}
          style={styles.profileIcon}
        />
      </TouchableOpacity>

      {/* <View style = {styles.mainCont}> */}
      <SafeAreaView style={styles.LogoTextContainer}>
        <Logo />
        {/* <Text style={styles.Text}>ניצול מזון : 12,000 ק''ג</Text> */}


      </SafeAreaView>
      <ScrollView style={styles.buttonContainer2}
        showsVerticalScrollIndicator={false}>
        <View style={styles.buttonContainer}>

          {/* all the button  */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ManageGoods")}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>ניהול סחורות</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("SeeStatistics")}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>צפו בסטטיסטיקה</Text>
          </TouchableOpacity>


          {isAdmin && <TouchableOpacity
            onPress={() => navigation.navigate("ManageItems")}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>ניהול פריטים</Text>
          </TouchableOpacity>}

          {isAdmin && <TouchableOpacity
            onPress={() => navigation.navigate("ManageVolunteers")}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>ניהול מתנדבים</Text>
          </TouchableOpacity>}

          {isAdmin && <TouchableOpacity
            onPress={() => navigation.navigate("ManageDropArea")}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>ניהול נקודות פיזור</Text>
          </TouchableOpacity>}

          <TouchableOpacity
            onPress={() => navigation.navigate("Feedback")}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>משובים</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* </View> */}
    </Background>
  );
}

const styles = StyleSheet.create({
  profileIconContainer: {
    position: "absolute",
    top: 60,
    right: 10,
    width: 50,
    height: 50,
    zIndex: 2
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#1c6669",
    borderRadius: 50
  },
  HiddenScreen: {
    flex: 1,
    backgroundColor: "#000000aa"
  },
  ProfileScreen: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#1c6669",
    margin: 40,
    padding: 10,
    borderRadius: 10
  },
  header: {

    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#1c6669"
  },
  headerContent: {
    padding: 25,
    alignItems: "center",

  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "#1c6669",
    marginBottom: 10
  },
  name: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "600"
  },
  DetailsContainer: {
    flex: 1,
    justifyContent: "space-evenly"
  },
  ProfileDetails: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right"
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 15,
    //  justifyContent: "space-between",
    // padding: 16,
    width: "100%",
    borderRadius: 100,
  },
  buttonContainer2: {
    width: "100%",
    borderRadius: 100,
  },
  appButtonContainer: {
    alignSelf: "center",
    elevation: 8,
    backgroundColor: "#1c6669",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 20,
    width: "90%"
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
    flexDirection: "column",
    marginTop: 80
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
