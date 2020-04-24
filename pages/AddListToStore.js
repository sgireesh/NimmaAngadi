import React, { Component } from 'react';
import ListItem, { Separator } from './ListItem';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import * as firebase from 'firebase';
import dbutils from "./dbutils";

class AddListToStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            activeitems: {},
            storename: '',
            groupname: '',
            groupphone: '',
            isFamilyLoggedIn: true
        };
        this.getAsyncData();
    }

    async componentDidMount() {
    }

    saveData = async () => {
        try {
            await AsyncStorage.setItem('from', 'group', (err) => {
                if (!err) {
                    this.setState({ setflag1: true });
                }
            });
            console.log("102: " + this.state.setflag1);

            if (this.state.setflag1) {
                this.props.navigation.navigate('ShoppingList');
            }
        } catch (e) {
            console.log("Error ", e);
        }
    }

    getAsyncData() {
        AsyncStorage.getItem('groupname').then((value) => {
            if (value) {
                this.setState({ isFamilyLoggedIn: true });
                this.setState({ groupname: value });
                console.log("40 " + this.state.isFamilyLoggedIn);
                console.log("41 " + value + " " + this.state.groupname);
            } else {
                this.setState({ isFamilyLoggedIn: false });
            }
        }).then(() => {
            this.fbLoadList();
        });

    }

    fbLoadList = () => {
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

        var ref = firebase.database().ref("stores/");
        ref.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                console.log(snapshot);
                const newitem1 = snapshot.val();
                console.log(newitem1);
                this.setState({ items: newitem1 })
            }
        }.bind(this), function () {
            console.info("API initialisation failed");
        });
    }

    fbAddToPendingOrders = (uid, storename, storephone) => {
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



        var storepath = storename;
        var grouppath = this.state.groupname;
        storepath = "pendingorders/".concat(storepath.replace(/\s+/g, '').toLowerCase().concat("/", grouppath.replace(/\s+/g, '').toLowerCase()));
        console.log("AddListToStore: 86: " + storepath);
        var ref = firebase.database().ref(storepath);
        ref.update({ "groupname": this.state.groupname, "groupphone": this.state.groupphone, "storestatus": "open" });

        var path = "shoppinglist/".concat(grouppath, "/lists/active");
        ref = firebase.database().ref(path);
        //copy the list to a new name
        ref.once('value', function (snapshot) {
            if (snapshot.val() != null) {
                console.log(snapshot);
                const newitem1 = snapshot.val();
                console.log(newitem1);
                this.setState({ activeitems: newitem1 })
            }
        }.bind(this), function () {
            console.info("API initialisation failed");
        });

        //get groupphone
        var groupname = this.state.groupname;
        console.log("125: " + groupname);
        var groupphone = '';
        var ref = firebase.database().ref("groups/" + groupname + "/groupphone");
        ref.once('value', (snapshot) => {
            console.log("129: " + snapshot.val());
            groupphone = snapshot.val();
            this.setState({ groupphone: groupphone });
        }).then(  () => {
            console.log("127  " + groupphone);

            var listname = groupphone.concat("_", Date.now());

            path = "shoppinglist/".concat(grouppath, "/lists/", listname);
            ref = firebase.database().ref(path);
            ref.update({ list: this.state.activeitems });

            //create a unique list name, and then assigned store.
            storepath = "shoppinglist/".concat(grouppath.replace(/\s+/g, '').toLowerCase(), "/lists/", listname, "/store");
            console.log("AddListToStore: 92: " + storepath);
            ref = firebase.database().ref(storepath);
            ref.update({ "storename": storename, "storephone": storephone });

            //clear active list
            path = "shoppinglist/".concat(grouppath, "/lists/active");
            ref = firebase.database().ref(path);
            ref.remove();

        });
        this.saveData();

    }

    render() {
        return (
            <View style={styles.padTop}>
                <View style={styles.padTop}>
                    <Text style={styles.textGlobal}>Share your shopping list with:</Text>
                </View>
                <View style={styles.container}>
                    <FlatList
                        data={Object.keys(this.state.items)}
                        renderItem={({ item, index }) => (
                            <ListItem
                                title={this.state.items[item].storename}
                                onSwipeFromLeft={() => { this.fbAddToPendingOrders(item, this.state.items[item].storename, this.state.items[item].storephone) }}
                                onRightPress={() => { console.log("right button pressed") }}
                                textlabelright=""
                                textlabelleft="select store"
                            />
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={() => <Separator />}
                    />
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
    buttonStyle: {
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

export default AddListToStore;