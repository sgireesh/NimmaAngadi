import React from 'react';
import ListItem, { Separator } from './ListItem';
import * as firebase from 'firebase';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/Feather';


class PendingOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            singleitem: "",
            storename: "",
            setflag1: false,
            setflag2: false,
            appuid: 'dh7OXmOVKNeDNVwR4XKyc70097I2'
        };
        this.getAsyncData();
        this.props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Home')}
                >
                    <Icon style={{ paddingLeft: 10 }} name="arrow-left" size={26} color="black" />
                </TouchableOpacity>

            ),
        });
    }

    fbLogin() {
        firebase.auth().signInWithEmailAndPassword('gireesh.subramanya@gmail.com', 'alskdj1')
            .then(function (result) {
                console.log("31: " + result.user.uid);
            }).catch(function (error) {
                console.log("33: " + error);
            });
    }

    fbAuthenticate() {
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
        this.fbLogin();

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log("53: found user" + user.uid);
            } else {
                this.fbLogin();
            }
        });
    }

    getAsyncData() {
        AsyncStorage.getItem("storename").then((value) => {
            console.log("22: storename " + value);
            this.setState({ "storename": value });
        }).then(res => { this.fbLoadPendingOrders() });
    }

    componentDidMount() { }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.TI}>Store Name : {this.state.storename}</Text>
                <View style={styles.container}>
                    <FlatList
                        data={Object.keys(this.state.items)}
                        renderItem={({ item, index }) => (
                            <ListItem
                                title={this.state.items[item].groupname.concat("    Phone: ", this.state.items[item].groupphone, "     ", this.state.items[item].storestatus)}
                                onSwipeFromLeft={() => { this.notifyCustomer(item, this.state.items[item]) }}
                                onRightPress={() => { this.startFulfill(item, this.state.items[item].groupname) }}
                                textlabelright="start"
                                textlabelleft="done"
                            />
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={() => <Separator />}
                    />
                </View>
            </View>
        );
    }

    notifyCustomer = (uid, additem) => {
        /* NOT IMPLEMENTED*/
        var listname = this.state.storename;

        var ref = firebase.database().ref(this.state.appuid + "/boughtlist/" + listname + "/list");
        var p = ref.push();
        p.set(additem);
        var ref2 = firebase.database().ref(this.state.appuid + "/shoppinglist/" + listname);
        console.log("In getData, looking for ", ref2);

        ref2.on('value', function (snapshot) {
            console.log(snapshot);
            const newitem1 = snapshot.val().list;
            console.log(newitem1);
            this.setState({ items: newitem1 })
        }.bind(this), function () {
            console.info("API initialisation failed");
        });

        this.fbDelete(uid, additem.title);
    }

    fbDelete = (uid, title) => {
        var listname = this.state.storename;

        var ref = firebase.database().ref(this.state.appuid + "/shoppinglist/" + listname + "/list");
        ref.child(uid).remove();
        var ref2 = firebase.database().ref(this.state.appuid + "/shoppinglist/" + listname);

        ref2.on('value', function (snapshot) {
            const newitem1 = snapshot.val().list;
            this.setState({ items: newitem1 })
        }.bind(this), function () {
            console.info("API initialisation failed");
        });
        alert('Deleted entry: ' + title);
    }

    fbLoadPendingOrders = () => {
        var listname = this.state.storename;
        listname = listname.replace(/\s+/g, '').toLowerCase();

        var ref = firebase.database().ref(this.state.appuid + "/pendingorders/" + listname);
        ref.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                console.log("153: " + snapshot);
                const newitem1 = snapshot.val();
                console.log(newitem1);
                this.setState({ items: newitem1 })
            }
        }.bind(this), function () {
            console.info("API initialization failed");
        });
    }

    startFulfill = async (uid, groupname) => {
        console.log("165 :" + uid);
        try {
            await AsyncStorage.setItem('groupname', uid, (err) => {
                if (!err) {
                    this.setState({ setflag1: true });
                }
            });

            await AsyncStorage.setItem('from', 'store', (err) => {
                if (!err) {
                    this.setState({ setflag2: true });
                }
            });
            if (this.state.setflag1 && this.state.setflag2) {
                this.props.navigation.navigate('ShoppingList');
            }
        } catch (e) {
            console.log("Error ", e);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    TI: {
        padding: 10,
        borderColor: 'black',
        borderWidth: 1
    },
    padTop: {
        padding: 15,
        flexDirection: "row",
    },

    textGlobal: {
        fontWeight: 'bold',
        fontSize: 18
    },
    buttonStyle: {
        flex: 1,
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

export default PendingOrders;