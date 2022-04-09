import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Items from '../components/Items';
import { StyleSheet, Text, Modal, Button, View, SafeAreaView, TouchableOpacity, Platform, Image, TextInput, Keyboard, Alert } from 'react-native';

export default function ManageItems({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleItem, setModalVisibleItem] = useState(false);
    const [modalindex, setModalindex] = useState(null);
    const [modalEdit, setModalEdit] = useState(true);
    const [ShowAddimage, setShowAddimage] = useState(false);
    const [image, setImage] = useState();
    const [Name, setName] = useState();
    const [Weight, setWeight] = useState();
    const [WeightList, setWeightList] = useState([]);
    const [ItemsList, setItems] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [ShowText, setShowText] = useState(true);
    const [Showback, setShowBack] = useState(false);

    
    
    const handleAddItems = () => {
        Keyboard.dismiss();
        if(Name === null || Weight  === null){
         
          Alert.alert("שגיה " , "תבדוק שהטקסט אינו רק !!" , [{text : "תמשיך"}]);
          return;
        }else{
          setModalVisible(!modalVisible)
        }
        setItems([...ItemsList, Name]);
        setImageList([...imageList, image]);
        setWeightList([...WeightList, Weight])
        setName(null);
        setImage(null);
        setWeight(null)
    }
    const handleEditItems = (index) => {
      Keyboard.dismiss();
      if(Name === null || Weight  === null){
       
        Alert.alert("שגיה " , "תבדוק שהטקסט אינו רק !!" , [{text : "תמשיך"}]);
        return;
      }else{
        setShowText(!ShowText) || setModalEdit(!modalEdit) || setShowBack(false) || setShowAddimage(!ShowAddimage)
      }
        ItemsList[index] = Name;
        WeightList[index] = Weight;

        imageList[index] = image;
       
    }
    const deletItems = (index) => {
        let CopyItemsList = [...ItemsList];
        CopyItemsList.splice(index, 1);
        setItems(CopyItemsList);
        let CopyImageList = [...imageList];
        CopyImageList.splice(index, 1);
        setImageList(CopyImageList);

        let CopyWeightList = [...WeightList];
        CopyWeightList.splice(index, 1);
        setWeightList(CopyWeightList);
       
    }


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });



        if (!result.cancelled) {
            setImage(result.uri);
        }
    };
    return (
        <Background >
            <BackButton goBack={navigation.goBack} />
            {/*start your code here*/}
            <Text style={styles.Title}>ניהול פרטים</Text>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {

                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.HeddinScreeen}>
                    <View style={styles.ProfileScreen}>

                        <View style={styles.DetailsContainer}>

                        </View>
                        <TextInput style={styles.input} placeholder={"שם..."} value={Name} onChangeText={text => setName(text)} />
                        <TextInput style={styles.input} placeholder={"משקל..."} value={Weight} onChangeText={text => setWeight(text)} />
                        <TextInput style={styles.input} placeholder={"עוד..."} />
                        <View style={styles.AddphotoContainer}>
                            <TouchableOpacity onPress={pickImage}>

                                <Image style={styles.addphoto} source={require('../assets/addphoto2.png')} />
                            </TouchableOpacity>
                            {image && <Image source={{ uri: image }} style={styles.Image} />}
                        </View>
                        <TouchableOpacity style={styles.appButtonContainer} onPress={() => handleAddItems() } >

                            <Text style={styles.appButtonText}>אישור</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.appButtonContainer} onPress={() => setModalVisible(!modalVisible) || setImage(null)} >

                            <Text style={styles.appButtonText} >סוגר</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            <View style={styles.ScreenContainer}>

                {
                    ItemsList.map((Item, index) => {

                        return (
                            <TouchableOpacity key={index} onPress={() => setModalVisibleItem(true) || setModalindex(index) || setImage(imageList[index])} >
                                <Items Name={Item} image={imageList[index]} />
                                <Modal

                                    transparent={true}
                                    visible={modalVisibleItem}
                                    onRequestClose={() => {

                                        setModalVisibleItem(!modalVisibleItem);
                                    }}
                                >
                                    <View style={styles.HeddinScreeen}>
                                        <View style={styles.ProfileScreen}>
                                            {ShowText ? <View >
                                                <Text style={styles.modelText}> שם: {ItemsList[modalindex]}</Text>
                                                <Text style={styles.modelText}> משקל: {WeightList[modalindex]}</Text>
                                            </View> : null}
                                            {!ShowText ? <View style={styles.InputContainer}>
                                                <TextInput style={styles.input} placeholder={"שם..."} value={Name} onChangeText={text => setName(text)} />
                                                <TextInput style={styles.input} placeholder={"משקל..."} value={Weight} onChangeText={text => setWeight(text)} />
                                            </View> : null}

                                           <View style={styles.AddphotoContainer}>
                                                <TouchableOpacity onPress={pickImage}>

                                                {ShowAddimage? <Image style={styles.addphoto} source={require('../assets/editimage.png')} />: null }
                                                </TouchableOpacity>
                                                {image && <Image source={{ uri: image }} style={styles.Image} />}
                                            </View> 

                                            <TouchableOpacity style={styles.DeletButton} onPress={() => deletItems(modalindex) || setModalVisibleItem(!modalVisibleItem)} >
                                                <Text style={styles.appButtonText}>הוסיר</Text>
                                            </TouchableOpacity>
                                            {!modalEdit ? <TouchableOpacity style={styles.appButtonContainer} onPress={() => handleEditItems(modalindex) } >

                                                <Text style={styles.appButtonText}>אישור</Text>
                                            </TouchableOpacity> : null}
                                            {modalEdit ? <TouchableOpacity style={styles.appButtonContainer} onPress={() => setShowText(!ShowText) || setModalEdit(!modalEdit) || setShowBack(!Showback) || setShowAddimage(!ShowAddimage)}>
                                           
                                                <Text style={styles.appButtonText}>עדכן</Text>
                                            </TouchableOpacity> : null}
                                            {Showback ? <TouchableOpacity style={styles.appButtonContainer} onPress={() => setShowText(true) || setModalEdit(true) || setShowBack(!Showback) || setShowAddimage(false) || setImage(imageList[modalindex])} >

                                                <Text style={styles.appButtonText}>לחזור</Text>
                                            </TouchableOpacity> : null}
                                            <TouchableOpacity style={styles.appButtonContainer} onPress={() => setModalVisibleItem(!modalVisibleItem) || setShowText(true) || setModalEdit(true) || setShowBack(false) || setShowAddimage(false) || setImage(null)} >

                                                <Text style={styles.appButtonText}>סוגר</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </TouchableOpacity>
                        )

                    })
                }

            </View>


            <SafeAreaView>
                <TouchableOpacity style={styles.AddButton} onPress={() => setModalVisible(true)} >
                    <Text style={styles.PlusIcon}>+</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </Background>
    );
}
const styles = StyleSheet.create({
    ScreenContainer: {
        flex: 1,
        paddingTop: 50,
        marginTop: 20,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignContent: 'space-around',
        flexWrap: 'wrap',


    },
    Title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 80,
    },
    HeddinScreeen: {
        flex: 1,
        backgroundColor: '#000000aa',
    },
    ProfileScreen: {
        flex: 1,
        backgroundColor: '#ffffff',
        margin: 40,
        padding: 10,
        borderRadius: 10,
    },
    AddButton: {
        width: 60,
        height: 60,
        backgroundColor: "#1c6669",
        //"#1c6669"
        //#5AF142
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FFF',
        borderWidth: 2,
    },
    PlusIcon: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF'
    }, HeddinScreeen: {
        flex: 1,
        backgroundColor: '#000000aa',
    },
    ProfileScreen: {
        flex: 1,
        backgroundColor: '#ffffff',
        margin: 40,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        justifyContent: 'space-evenly',
        borderWidth: 5,
        borderColor: '#1c6669'
    },
    InputContainer: {
        flex: 0.5,
        justifyContent: 'space-evenly'
    },
    input: {
        width: 250,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#1c6669',
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#1c6669",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: 200,
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    DeletButton: {
        elevation: 8,
        backgroundColor: "red",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: 200,

    },
    addphoto: {
        width: 80,
        height: 80,
    },
    Image: {
        width: 120,
        height: 120,
        borderWidth: 5,
        borderRadius: 10,
        
        borderColor: "#1c6669",
    },
    AddphotoContainer: {
    
        flexDirection: 'row-reverse',
       
      
       
        alignItems: "center",
        justifyContent: 'center',
    },
    modelText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    Details1: {
        width: 100,
        height: 100,
        backgroundColor: 'blue'

    },
    Details2: {
        width: 100,
        height: 100,
        backgroundColor: 'red'

    }

});
