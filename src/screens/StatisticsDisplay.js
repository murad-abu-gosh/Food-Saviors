import { useEffect, useState } from "react";
import { FlatList, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BackButton from "../components/BackButton";
import OurActivityIndicator from "../components/OurActivityIndicator";
import { getDropAreaStatistics, getGeneralStatisticsArray } from "../config/database_interface";
import { theme } from "../core/theme";
// Required to save to cache 
import * as FileSystem from 'expo-file-system';

import ExcelJS from 'exceljs';
// Share excel via share dialog
import * as Sharing from 'expo-sharing';
// From @types/node/buffer
import { Buffer as NodeBuffer } from 'buffer';
import { getStatusBarHeight } from "react-native-status-bar-height";


export default function StatisticsDisplay({ navigation, route }) {

    // initializing the needed variables/useStates
    const [isLoading, setIsLoading] = useState(false);

    const [fullItemsStatisticsInfo, setFullItemsStatisticsInfo] = useState([]);
    const [itemsStatisticsInfo, setItemsStatisticsInfo] = useState([]);

    const [fromDateStr, setFromDateStr] = useState("");
    const [toDateStr, setToDateStr] = useState("");

    const [isByDropArea, setIsByDropArea] = useState(false);

    // This function receives a searcing string and it fills the display list with the suitable items from the fullItemslist
    const updateListBySearch = (searchString) => {

        searchString = searchString.toLowerCase().trim();

        setItemsStatisticsInfo(() => []);

        if (searchString === "") {
            setItemsStatisticsInfo(() => [...fullItemsStatisticsInfo]);
            return;
        }

        let searcheableFileds = ["name"];
        let newItemsStatisticsList = [];

        fullItemsStatisticsInfo.forEach((currItemStatisticsInfoObj) => {

            for (let i = 0; i < searcheableFileds.length; i++) {

                if ((currItemStatisticsInfoObj[searcheableFileds[i]]).toLowerCase().includes(searchString)) {

                    newItemsStatisticsList.push(currItemStatisticsInfoObj);
                    break;
                }
            }

        });


        setItemsStatisticsInfo(() => [...(newItemsStatisticsList.sort(savedAmountsCompare))]);

    };

    // This function returns a date object which is suitable to the given date string
    const getDateObjectFromStr = (dateStr) => {

        if (dateStr === "") {
            return null;
        }

        let dateStrParts = dateStr.split("-");

        let dateObject = new Date(parseInt(dateStrParts[2]), parseInt(dateStrParts[1]) - 1, parseInt(dateStrParts[0]));

        return dateObject;
    }

    const savedAmountsCompare = (itemOne, itemTwo) => {

        return (itemTwo.savedAmount * itemTwo.boxWeight) - (itemOne.savedAmount * itemOne.boxWeight);
    }

    useEffect(() => {

        setIsLoading(true);

        let currStatisticsFilter;

        if (route.params?.statisticsFilter) {

            currStatisticsFilter = route.params?.statisticsFilter;

            switch (currStatisticsFilter.statisticsType) {

                case "general":
                    getGeneralStatisticsArray(getDateObjectFromStr(currStatisticsFilter.fromDate), getDateObjectFromStr(currStatisticsFilter.toDate)).then((itemsStatisticsList) => {

                        setIsLoading(false);

                        let itemsStatisticsInfoSorted = itemsStatisticsList.sort(savedAmountsCompare);

                        console.log("statisticsList: ", itemsStatisticsInfoSorted);
                        setFullItemsStatisticsInfo(itemsStatisticsInfoSorted);
                        setItemsStatisticsInfo(itemsStatisticsInfoSorted);
                    });
                    break;

                case "dropArea":
                    setIsByDropArea(true);
                    getDropAreaStatistics(getDateObjectFromStr(currStatisticsFilter.fromDate), getDateObjectFromStr(currStatisticsFilter.toDate), currStatisticsFilter.dropAreaID).then((itemsStatisticsList) => {

                        setIsLoading(false);

                        let itemsStatisticsInfoSorted = itemsStatisticsList.sort(savedAmountsCompare);

                        console.log("statisticsList: ", itemsStatisticsInfoSorted);
                        setFullItemsStatisticsInfo(itemsStatisticsInfoSorted);
                        setItemsStatisticsInfo(itemsStatisticsInfoSorted);
                    });
                    break;

            }

            setFromDateStr(() => currStatisticsFilter.fromDate);
            setToDateStr(() => currStatisticsFilter.toDate);
        }

    }, [route.params?.statisticsFilter]);

    // This funtion returns a date string with the format dd-mm-yyyy using the given date object
    const getDateStr = (dateObj) => {

        dateObj = new Date(dateObj);

        let dateString;

        let dd = String(dateObj.getDate()).padStart(2, '0');
        let mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        let yyyy = dateObj.getFullYear();

        dateString = dd + '-' + mm + '-' + yyyy;

        return dateString;
    };

    // This function creates an excel file that contains the statistics information 
    // it returns a local uri that can be shared
    const generateShareableExcel = async () => {

        const now = new Date();
        const fileName = `food_statistics_${getDateStr(now)}_${Math.floor(Math.random() * Math.pow(10, 15))}.xlsx`;

        const fileUri = FileSystem.cacheDirectory + fileName;

        return new Promise((resolve, reject) => {

            const workbook = new ExcelJS.Workbook();

            workbook.creator = 'מצילות המזון';
            workbook.created = now;
            workbook.modified = now;
            // Add a sheet to work on

            const worksheet = workbook.addWorksheet('food_statistics_sheet', {});
            // Just some columns as used on ExcelJS Readme

            if (isByDropArea) {

                worksheet.columns = [
                    { header: 'שם', key: 'name', width: 32 },
                    { header: 'קבלה (ארגזים)', key: 'receivedAmountBox', width: 32 },
                    { header: 'קבלה (ק״ג)', key: 'receivedAmountKG', width: 32 },
                    { header: 'בזבוז (ארגזים)', key: 'wasteAmountBox', width: 32 },
                    { header: 'בזבוז (ק״ג)', key: 'wasteAmountKG', width: 32 },
                    { header: 'ניצול (ארגזים)', key: 'savedAmountBox', width: 32 },
                    { header: 'ניצול (ק״ג)', key: 'savedAmountKG', width: 32 },
                ];
            } else {
                worksheet.columns = [
                    { header: 'שם', key: 'name', width: 32 },
                    { header: 'קבלה (ארגזים)', key: 'receivedAmountBox', width: 32 },
                    { header: 'קבלה (ק״ג)', key: 'receivedAmountKG', width: 32 },
                    { header: 'יצוא (ארגזים)', key: 'exportAmountBox', width: 32 },
                    { header: 'יצוא (ק״ג)', key: 'exportAmountKG', width: 32 },
                    { header: 'בזבוז (ארגזים)', key: 'wasteAmountBox', width: 32 },
                    { header: 'בזבוז (ק״ג)', key: 'wasteAmountKG', width: 32 },
                    { header: 'ניצול (ארגזים)', key: 'savedAmountBox', width: 32 },
                    { header: 'ניצול (ק״ג)', key: 'savedAmountKG', width: 32 },
                ];
            }



            fullItemsStatisticsInfo.forEach((item) => {

                if (isByDropArea) {

                    worksheet.addRow({
                        name: item.name,
                        receivedAmountBox: item.receivedAmount,
                        receivedAmountKG: item.receivedAmount * item.boxWeight,
                        wasteAmountBox: item.wasteAmount,
                        wasteAmountKG: item.wasteAmount * item.boxWeight,
                        savedAmountBox: item.savedAmount,
                        savedAmountKG: item.savedAmount * item.boxWeight
                    });

                } else {
                    worksheet.addRow({
                        name: item.name,
                        receivedAmountBox: item.receivedAmount,
                        receivedAmountKG: item.receivedAmount * item.boxWeight,
                        exportAmountBox: item.exportAmount,
                        exportAmountKG: item.exportAmount + item.boxWeight,
                        wasteAmountBox: item.wasteAmount,
                        wasteAmountKG: item.wasteAmount * item.boxWeight,
                        savedAmountBox: item.savedAmount,
                        savedAmountKG: item.savedAmount * item.boxWeight
                    });

                }
            });

            if (isByDropArea) {

                worksheet.addRow({
                    name: "ס״ה",
                    receivedAmountBox: getGeneralSums("received").boxesSum,
                    receivedAmountKG: getGeneralSums("received").KGSum,
                    wasteAmountBox: getGeneralSums("waste").boxesSum,
                    wasteAmountKG: getGeneralSums("waste").KGSum,
                    savedAmountBox: getGeneralSums("saved").boxesSum,
                    savedAmountKG: getGeneralSums("saved").KGSum
                });
            } else {
                worksheet.addRow({
                    name: "ס״ה",
                    receivedAmountBox: getGeneralSums("received").boxesSum,
                    receivedAmountKG: getGeneralSums("received").KGSum,
                    exportAmountBox: getGeneralSums("export").boxesSum,
                    exportAmountKG: getGeneralSums("export").KGSum,
                    wasteAmountBox: getGeneralSums("waste").boxesSum,
                    wasteAmountKG: getGeneralSums("waste").KGSum,
                    savedAmountBox: getGeneralSums("saved").boxesSum,
                    savedAmountKG: getGeneralSums("saved").KGSum
                });
            }


            // Test styling

            // Style first row
            worksheet.getRow(1).font = {
                name: 'Comic Sans MS', family: 4, size: 16, bold: true
            };


            // Write to file
            workbook.xlsx.writeBuffer().then((buffer) => {
                // Do this to use base64 encoding
                const nodeBuffer = NodeBuffer.from(buffer);
                const bufferStr = nodeBuffer.toString('base64');
                FileSystem.writeAsStringAsync(fileUri, bufferStr, {
                    encoding: FileSystem.EncodingType.Base64
                }).then(() => {
                    resolve(fileUri);
                });
            });
        });
    }

    // This function shares the excel file that have been created using the function generateShareableExcel()
    const shareExcel = async () => {

        const shareableExcelUri = await generateShareableExcel();

        Sharing.shareAsync(shareableExcelUri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Android
            dialogTitle: 'Food_Statistics_Xlsx_File', // Android and Web
            UTI: 'com.microsoft.excel.xlsx' // iOS
        }).catch(error => {
            console.error('Error', error);
        }).then(() => {
            console.log('Return from sharing dialog');
        });
    }

    // This function returns general sums (sum for all the items amounts {boxes, KG})
    // according to the given sum Name/type
    const getGeneralSums = (sumName) => {

        let sumsJSON = { boxesSum: 0, KGSum: 0 };

        switch (sumName) {

            case "received":

                fullItemsStatisticsInfo.forEach((item) => {

                    sumsJSON.boxesSum += item.receivedAmount;

                    sumsJSON.KGSum += item.receivedAmount * item.boxWeight;
                });
                break;

            case "export":

                fullItemsStatisticsInfo.forEach((item) => {

                    sumsJSON.boxesSum += item.exportAmount;

                    sumsJSON.KGSum += item.exportAmount * item.boxWeight;
                });
                break;

            case "waste":

                fullItemsStatisticsInfo.forEach((item) => {

                    sumsJSON.boxesSum += item.wasteAmount;

                    sumsJSON.KGSum += item.wasteAmount * item.boxWeight;
                });
                break;

            case "saved":

                fullItemsStatisticsInfo.forEach((item) => {

                    sumsJSON.boxesSum += item.savedAmount;

                    sumsJSON.KGSum += item.savedAmount * item.boxWeight;
                });
                break;
        }

        return sumsJSON;
    };

    // This function returns the render item / the card of the statistics info after filling it with the statistics info from
    // the received item argumnet so we can display it in the flatlist
    const getListRenderItem = (item) => {

        return (
            <View activeOpacity={0.8} style={styles.itemCardContainer} onLongPress={() => { }}>

                <Image style={styles.itemImageStyle} source={{ uri: item.image }} />

                <View style={styles.itemInfoContainer}>
                    <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>שם: </Text>{item.name}</Text>
                    <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>קבלה: </Text>{`${item.receivedAmount} ארגזים => ${item.receivedAmount * item.boxWeight} ק״ג`}</Text>
                    {!isByDropArea && <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>יצוא: </Text>{`${item.exportAmount} ארגזים => ${item.exportAmount * item.boxWeight} ק״ג`}</Text>}
                    <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>בזבוז: </Text>{`${item.wasteAmount} ארגזים => ${item.wasteAmount * item.boxWeight} ק״ג`}</Text>
                    <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>ניצול: </Text>{`${item.savedAmount} ארגזים => ${item.savedAmount * item.boxWeight} ק״ג`}</Text>

                </View>

            </View >
        );
    }

    return (
        <View style={styles.background}>
            <ImageBackground source={require("../assets/background_dot.png")} resizeMode="repeat" style={styles.background}>

                {isLoading && <OurActivityIndicator />}

                <BackButton goBack={navigation.goBack} />

                <TextInput style={styles.infoTextInputStyle} onChangeText={(searchString) => { updateListBySearch(searchString) }} placeholder="חיפוש"></TextInput>

                <View style={styles.searchAndListContainer}>


                    <FlatList keyExtractor={(item, index) => index} showsVerticalScrollIndicator={false} style={styles.flatListStyle} data={itemsStatisticsInfo} renderItem={({ item }) => { return getListRenderItem(item) }} />
                </View>

                <View styel={styles.bottomInfoAndControlContainer}>
                    <View style={styles.generalSummaryContainer}>

                        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>קבלה ס״ה: </Text>{`${getGeneralSums("received").boxesSum} ארגזים => ${getGeneralSums("received").KGSum} ק״ג`}</Text>
                        {!isByDropArea && <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>יצוא ס״ה: </Text>{`${getGeneralSums("export").boxesSum} ארגזים => ${getGeneralSums("export").KGSum} ק״ג`}</Text>}
                        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>בזבוז ס״ה: </Text>{`${getGeneralSums("waste").boxesSum} ארגזים => ${getGeneralSums("waste").KGSum} ק״ג`}</Text>
                        <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>ניצול ס״ה: </Text>{`${getGeneralSums("saved").boxesSum} ארגזים => ${getGeneralSums("saved").KGSum} ק״ג`}</Text>

                        <View style={{ flexDirection: "row-reverse" }}>
                            <Text style={[styles.infoTextStyle, { marginLeft: 5 }]}><Text style={styles.infoTitleTextStyle}>מ- </Text>{(fromDateStr === "") ? "ההתחלה" : fromDateStr}</Text>
                            <Text style={styles.infoTextStyle}><Text style={styles.infoTitleTextStyle}>עד- </Text>{(toDateStr === "") ? "עכשיו" : toDateStr}</Text>
                        </View>

                    </View>

                    <TouchableOpacity style={styles.generateXlsxButton} onPress={shareExcel}><Text style={styles.shareExcelText}>שטף קובץ Excel</Text></TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

// styling the screen and the components
const styles = StyleSheet.create({

    background: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.surface,
        alignSelf: 'center',
        alignItems: 'center',


    },

    flatListStyle: {
        width: "100%",
        height: 50,
        paddingRight: 7,
        paddingLeft: 7,
        
    },

    generalSummaryContainer: {
        alignItems: "flex-end",
        minWidth: "100%",
        borderTopColor: "#1c6669",
        borderTopWidth: 3,
        padding: 5,
        backgroundColor: "white"
    },


    itemCardContainer: {

        flexDirection: "row-reverse",
        borderColor: "#1c6669",
        borderWidth: 3,
        padding: 5,
        width: "100%",
        borderRadius: 5,
        backgroundColor: "white",
        alignItems: 'center',
        marginBottom: 5,
    },

    itemImageStyle: {
        borderRadius: 10,
        borderColor: "#1c6669",
        borderWidth: 2,
        width: "30%",
        height: 100,
        marginLeft: "3%"
    },

    itemInfoContainer: {

        alignItems: "flex-end",
        width: "67%",

    },

    infoTitleTextStyle: {

        fontSize: 16,
        fontWeight: "bold"
    },

    searchAndListContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",

    },

    infoTextInputStyle: {

        marginTop: getStatusBarHeight() + 24,
        marginBottom: 10,
        fontSize: 20,
        textAlign: "center",
        minWidth: "75%",
        borderColor: "#1c6669",
        borderBottomWidth: 2,
        padding: 7
    },

    generateXlsxButton: {

        minWidth: "100%",
        height: 60,
        backgroundColor: "#00700f",
        alignItems: "center",
        justifyContent: "center"
    },

    shareExcelText: {

        fontSize: 22,
        color: "white",
        fontWeight: "bold"

    },

    bottomInfoAndControlContainer: {
        
       minWidth: "100%",

    }

});