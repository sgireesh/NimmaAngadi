import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage, TextInput, BackHandler } from 'react-native';
import * as firebase from 'firebase';


class AddNewStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storename: '',
            storephone: '',
            evalnow: false,
            stores: {}
        };
        this.backButtonClick = this.backButtonClick.bind(this);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
    }

    backButtonClick() {
        console.log("62: backbuttonclicked");
        this.props.navigation.navigate('Home');
        return true;
    }

    fbAddNewStore = () => {
        if (this.state.storename) {
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
            var storepath = this.state.storename;
            storepath = "stores/".concat(storepath.replace(/\s+/g, '').toLowerCase());
            console.log("49: " + storepath);

            var ref = firebase.database().ref(storepath);
            ref.update({ "storename": this.state.storename, "storephone": this.state.storephone });
        }
    }

    render() {
        return (
            <View style={styles.padTop}>
                <View style={styles.padTop}>
                    <Text style={styles.textGlobal}>Store Name</Text>
                </View>
                <View style={styles.padTop}>
                    <TextInput
                        style={styles.TI}
                        placeholder="Indian Seaside Groceries"
                        onChangeText={(fn) => this.setState({ storename: fn })}
                    />
                </View>
                <View style={styles.padTop}>
                    <Text style={styles.textGlobal}>Primary Mobile Number</Text>
                </View>
                <View style={styles.padTop}>
                    <TextInput
                        style={styles.TI}
                        placeholder="408-343-9898"
                        keyboardType={'numeric'}
                        onChangeText={(fn) => this.setState({ storephone: fn })}
                    />
                </View>
                <View style={styles.padTop}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.buttonStyle}
                            title="List of Items"
                            onPress={() => {
                                //this.sendSMS();
                                AsyncStorage.setItem('storename', this.state.storename).then(
                                    AsyncStorage.setItem('storephone', this.state.storephone).then(
                                        () => {
                                            this.fbAddNewStore();
                                            this.props.navigation.navigate('PendingOrders');
                                        }
                                    ));
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

export default AddNewStore;