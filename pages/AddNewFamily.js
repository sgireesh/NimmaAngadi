import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage, TextInput, BackHandler } from 'react-native';
import * as SMS from 'expo-sms';
import * as firebase from 'firebase';


class AddNewFamily extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupname: '',
            groupphone: '',
            evalnow: false
        };
        this.backButtonClick = this.backButtonClick.bind(this);
    }

    backButtonClick() {
        console.log("62: backbuttonclicked");
        this.props.navigation.navigate('Home');
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
    }

    // Function to send message
    sendSMS = () => {
        console.log('sendSMS');
        const isAvailable = SMS.isAvailableAsync().then
            (
                { result } = SMS.sendSMSAsync(
                    ['6692103342'],
                    'PicknGO OTP'
                ).then(console.log("sms done")));
    }

    fbAddNewGroup = () => {
        if (this.state.groupname) {
            // Initialize Firebase
            const firebaseConfig = {
                apiKey: "AIzaSyBSe0Ikn2LsivJUpY4dOmb4PnPlX4n4q9Y",
                authDomain: "nimmaangadi-bd2fc.firebaseapp.com",
                databaseURL: "https://nimmaangadi-bd2fc.firebaseio.com",
                projectId: "nimmaangadi-bd2fc",
                storageBucket: "nimmaangadi-bd2fc.appspot.com",
                messagingSenderId: "889051007214",
                appId: "1:889051007214:web:90f9b38daf60f3791ecbff"
            };
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            // Don't add if exists.
            var grouppath = this.state.groupname;
            grouppath = "groups/".concat(grouppath.replace(/\s+/g, '').toLowerCase());

            console.log("63: " + grouppath);

            var ref = firebase.database().ref(grouppath);
            ref.update({ "groupname": this.state.groupname, "groupphone": this.state.groupphone });

        }
    }

    render() {
        return (
            <View style={styles.padTop}>
                <View style={styles.padTop}>
                    <Text style={styles.textGlobal}>Group Name</Text>
                </View>
                <View style={styles.padTop}>
                    <TextInput
                        style={styles.TI}
                        placeholder="Subbammana Mane"
                        onChangeText={(fn) => this.setState({ groupname: fn })}
                    />
                </View>
                <View style={styles.padTop}>
                    <Text style={styles.textGlobal}>Group Primary Mobile Number</Text>
                </View>
                <View style={styles.padTop}>
                    <TextInput
                        style={styles.TI}
                        placeholder="SubbammanaMane"
                        keyboardType={'numeric'}
                        onChangeText={(fn) => this.setState({ groupphone: fn })}
                    />
                </View>
                <View style={styles.padTop}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.buttonStyle}
                            title="List of Items"
                            onPress={() => {
                                //this.sendSMS();
                                var groupname = this.state.groupname;
                                groupname = groupname.replace(/\s+/g, '').toLowerCase();
                                AsyncStorage.setItem('groupname', groupname).then(
                                        () => {
                                            this.fbAddNewGroup();
                                            this.props.navigation.navigate('ShoppingList');
                                        }
                                    );
                            }}
                        >
                            <Text style={styles.textGlobal}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    padTop: {
        padding: 20
    },
    textGlobal: {
        fontWeight: 'bold',
        fontSize: 18
    },
    TI: {
        padding: 10,
        borderColor: 'black',
        borderWidth: 1
    }, buttonStyle: {
        justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
        height: 60,
        backgroundColor: 'lightgray',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#007aff',
        marginLeft: 5,
        marginRight: 5,
        overflow: 'hidden'
    }
});

export default AddNewFamily;