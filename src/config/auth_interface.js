import { db, auth, storage, app, } from "./firebase";
import {sendPasswordResetEmail} from "firebase/auth";
import { Alert } from "react-native";

/**
 * Sends reset password E-mail
 * @param String email
 */
export function resetEmailPassword(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            Alert.alert("Password reset email has been sent to " + email);
        }, (error) => {
            Alert.alert(error.message);
        });
}