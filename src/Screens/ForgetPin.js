import React, { useState, useEffect, useContext ,} from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, useColorScheme} from "react-native";
import { updatePassword } from "../odoo_service";
import urls from '../../url';
import { AuthContext } from './Context';
import { COLORS } from "../styles/Colors";
import HeaderCompo from "../components/HeaderCompo";

export default function ForgotPasswordScreen({ navigation }) {

    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState(null);
    const contextType = useContext(AuthContext);
    const server_origin = contextType.currentUrl;
    const getPinChange = server_origin + urls.getPin;
     const colorschema=useColorScheme()
        const isDark = colorschema === 'dark';

    const showAlert = (errorMessage) => {
        Alert.alert(
            'Error',
            errorMessage
        );
    };

    const handlePasswordReset = async () => {
        try {
            const response = await fetch(getPinChange, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: { username, currentPassword, newPassword, confirmNewPassword },
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const userpin = await response.json();
            console.log('------User pin------', userpin)
            if (userpin.result.message) {
                showAlert(userpin.result.message);
            } else {
                Alert.alert(
                    'Pin Change successfully',
                    'Your Pin has been Changed successfully.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login'),
                        },
                    ]
                );
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <>
        <HeaderCompo title={'Reset Password'} lefticon={require('../assets/back.png')}
        onPress={()=>navigation.goBack()}/>
        <View style={{...styles.container,backgroundColor:isDark?COLORS.black:COLORS.white}}>
            <Text style={styles.headerText}>Reset Password</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Employee ID"
                    placeholderTextColor="#555"
                    onChangeText={(text) => setUsername(text)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Current Password"
                    placeholderTextColor="#555"
                    secureTextEntry
                    onChangeText={(text) => setCurrentPassword(text)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="New Password"
                    placeholderTextColor="#555"
                    secureTextEntry
                    onChangeText={(text) => setNewPassword(text)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#555"
                    secureTextEntry
                    onChangeText={(text) => setConfirmNewPassword(text)}
                />
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={handlePasswordReset}>
                <Text style={styles.loginText}>CHANGE PASSWORD</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}

          
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0",
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
        color: "blue",
        fontStyle: "italic",
    },
    inputView: {
        backgroundColor: "white",
        borderRadius: 100,
        width: "80%",
        height: 45,
        marginBottom: 20,
        paddingHorizontal: 20,
        justifyContent: "center",
        borderWidth:1
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        color: "#333",
        fontWeight: "bold",
        borderColor: "black",
        // borderWidth: 0.2,
    },
    loginBtn: {
        width: "80%",
        borderRadius: 12,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "blue",
    },
    loginText: {
        color: "white",
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginTop: 10,
    },
});