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
            evalnow: false,
            setflag1: false,
            setflag2: false,
            isPhoneValid: false,
            isGroupNameValid: false,
            appuid: 'dh7OXmOVKNeDNVwR4XKyc70097I2/'
        };
        this.backButtonClick = this.backButtonClick.bind(this);
    }

    fbAuthenticate() {
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

        firebase.auth().signInWithEmailAndPassword('gireesh.subramanya@gmail.com', 'alskdj1')
            .then(function (result) {
                console.log("40: " + result.user.uid);
            }).catch(function (error) {
                console.log("42: " + error);
            });
    }

    saveData = async () => {
        try {
            var groupname = this.state.groupname;
            groupname = groupname.replace(/\s+/g, '').toLowerCase();

            var groupphone = this.state.groupphone;
            groupphone = groupphone.replace(/[^\d]/g, '');

            groupname = groupname.concat(groupphone);

            await AsyncStorage.setItem('groupname', groupname, (err) => {
                if (!err) {
                    this.setState({ setflag1: true });
                }
            });

            await AsyncStorage.setItem('from', 'group', (err) => {
                if (!err) {
                    this.setState({ setflag2: true });
                }
            });
            console.log("45: " + this.state.setflag1);
            console.log("46: " + this.state.setflag2);


            if (this.state.setflag1 && this.state.setflag2) {
                this.fbAddNewGroup();
                this.props.navigation.navigate('AllLists');
            }
        } catch (e) {
            console.log("Error ", e);
        }
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
        this.fbAuthenticate();
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
            /*
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
            */
            // Don't add if exists.
            var grouppath = this.state.groupname;
            var groupphone = this.state.groupphone;
            groupphone = groupphone.replace(/[^\d]/g, '');
            grouppath = this.state.appuid + "groups/".concat(grouppath.replace(/\s+/g, '').toLowerCase(), groupphone);

            console.log("103: " + grouppath);

            var ref = firebase.database().ref(grouppath);
            ref.update({ "groupname": this.state.groupname, "groupphone": this.state.groupphone });
        }
    }

    validategroupname = (groupname) => {
        if (groupname.length > 8 && groupname.length < 20) {
            return true;
        } else {
            return false;
        }
    }

    validatePhone = (phnumber) => {
        const reg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (reg.test(phnumber) === false) {
            return false;
        } else {
            return true;
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
                        onChangeText={(fn) => this.setState({ groupname: fn, isGroupNameValid: this.validategroupname(fn) })}
                    />
                    {!this.state.isGroupNameValid && <Text style={styles.TextError}>Group Name must be atleast 8 characters</Text>}
                </View>
                <View style={styles.padTop}>
                    <Text style={styles.textGlobal}>Group Primary Mobile Number</Text>
                </View>
                <View style={styles.padTop}>
                    <TextInput
                        style={styles.TI}
                        placeholder="444-989-0989"
                        keyboardType={'numeric'}
                        onChangeText={(fn) => this.setState({ groupphone: fn, isPhoneValid: this.validatePhone(fn) })}
                    />
                    {!this.state.isPhoneValid && <Text style={styles.TextError}>Enter valid phone number</Text>}
                </View>
                <View style={styles.padTop}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.buttonStyle}
                            title="List of Items"
                            onPress={() => {
                                //this.sendSMS();
                                console.log("140: save pressed");
                                if (this.state.isPhoneValid && this.state.isGroupNameValid) {
                                    this.saveData();
                                }
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
    }, TextError: {
        color: 'gray'
    }
});

export default AddNewFamily;