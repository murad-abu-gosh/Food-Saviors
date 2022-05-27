import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "../config";


export default function OurActivityIndicator() {

    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>

    );

}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }

});