import React from 'react';
import ListItem, { Separator } from './ListItem';
import * as firebase from 'firebase';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/Feather';


class ShoppingList extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            items: {},
            singleitem: "",
            groupname: "",
            groupnamefull: "",
            groupphone: "",
            quantity: "1",
            storename: "",
            storephone: "",
            from: "",
            labelleft: "",
            lagelright: "",
            listname: "",
            appuid: 'dh7OXmOVKNeDNVwR4XKyc70097I2'
        };
        this.getAsyncData();
        /*
                this.props.navigation.setOptions({
                    title: this.state.groupname,
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Home')}
                        >
                            <Icon style={{ paddingLeft: 10 }} name="arrow-left" size={26} color="black" />
                        </TouchableOpacity>
        
                    ),
                });
        */
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
        AsyncStorage.getItem("listname").then((value) => {
            console.log("shoppinglist: 42: listname: " + value);
            this.setState({ "listname": value });
        });
        AsyncStorage.getItem("from").then((value) => {
            console.log("shoppinglist: 26: from: " + value);
            this.setState({ "from": value });
            if (value === 'group') {
                this.setState({ "labelleft": "bought" });
                this.setState({ "labelright": "delete" });
            } else {
                this.setState({ "labelleft": "add" });
                this.setState({ "labelright": "unavailable" });
            }
        });
        AsyncStorage.getItem("groupname").then((value) => {
            console.log("shoppinglist: 23: groupname: " + value);
            this.setState({ "groupname": value });
        }).then(res => { this.fbLoadList() });
    }

    componentDidMount() {
        this.fbAuthenticate();
        this._isMounted = true;
    }

    componentWillUnmount() {
    }

    getPickerElements() {
        var pickerArr = [];
        for (var i = 0; i < 10; i++) {
            var s = '' + i;
            pickerArr.push(s)
        }
        return pickerArr;
    }

    render = () => {
        return (
            <View style={styles.container1}>
                <View style={styles.col1}>
                    {(this.state.from === 'store')
                        ? <View >
                            <Text>{this.state.groupname} {this.state.groupphone} </Text>
                        </View>
                        : <View style={styles.level_1}>
                            <View style={styles.level_11}>
                                <TextInput
                                    value={this.state.singleitem}
                                    style={styles.level_111}
                                    //textAlign={'center'} 
                                    placeholder="Peanut/ಕಡ್ಲೇಕಾಯಿ"
                                    onChangeText={(itm) => this.setState({ singleitem: itm })}
                                    ref={input => { this.singleitem = input }}
                                />
                            </View>
                            <View style={styles.level_12}>
                                <TextInput
                                    value={this.state.quantity}
                                    style={styles.level_121}
                                    //textAlign={'center'} 
                                    placeholder="5"
                                    onChangeText={(itm) => this.setState({ quantity: itm })}
                                    keyboardType={'numeric'}
                                    ref={input => { this.quantity = input }}
                                />
                            </View>
                            <View style={styles.level_13}>
                                <TouchableOpacity
                                    style={styles.level_131}
                                    onPress={() => this.fbAddToList()}
                                >
                                    <Icon style={styles.icon} name="plus-square" size={45} color='#ffffff' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
                <View style={styles.col2}>
                    <FlatList
                        data={Object.keys(this.state.items)}
                        renderItem={({ item, index }) => (
                            <ListItem
                                pagename='ShoppingList'
                                title={this.state.items[item].title.concat(" : ", this.state.items[item].quantity)}
                                onSwipeFromLeft={() => { this.fbAddToBoughtList(item, this.state.items[item]) }}
                                onRightPress={() => { this.fbDelete(item, this.state.items[item].title) }}
                                onTitlePress={() => {
                                    console.log("117: pressed");
                                    this.setState({ singleitem: this.state.items[item].title });
                                    this.setState({ quantity: this.state.items[item].quantity });
                                }}
                                textlabelright={this.state.labelright}
                                textlabelleft={this.state.labelleft}
                            />
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={() => <Separator />}
                    />
                </View>
                <View style={styles.col3}>
                    {(this.state.from !== 'store')
                        ? <View style={styles.row_1}>
                            {(this.state.storename !== "Current Shopping List")
                                ? <View style={styles.row_11}>
                                    <Text style={styles.textGlobal}>Sent to store:  {this.state.storename}</Text>
                                </View>
                                : <View style={styles.row_11} >
                                    <TouchableOpacity
                                        style={styles.buttonStyle}
                                        onPress={() => { this.addListToStore() }}
                                    >
                                        <Text style={styles.textGlobal}>Send To Store</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {(this.state.storename !== "Current Shopping List")
                                ? <View></View>
                                : <View style={styles.row_11}>
                                    <TouchableOpacity
                                        style={styles.buttonStyle}
                                        onPress={() => {
                                            this.props.navigation.navigate('BoughtList');
                                        }}
                                    >
                                        <Text style={styles.textGlobal}>Master List</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        : <View style={styles.row_1}>
                            <View style={styles.row_11}>
                                <TouchableOpacity
                                    style={styles.buttonStyle}
                                    onPress={() => { this.notifyCustomer() }}
                                >
                                    <Text style={styles.textGlobal}>Notify Customer Pickup</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
                {(this.state.storename !== "Current Shopping List")
                ?<View >
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => {
                            console.log("cancel order pressed, add code here");
                        }}
                    >
                        <Text style={styles.textGlobal}>Cancel Order</Text>
                    </TouchableOpacity>
                </View>
                :<View></View>
                }
            </View>
        );
    };

    notifyCustomer = () => {
        this.props.navigation.navigate('NotifyCustomer');
    }

    addListToStore = () => {
        this.props.navigation.navigate('AddListToStore');
    };

    fbAddToBoughtList = (uid, item) => {
        console.log("uid: " + uid);
        var groupname = this.state.groupname;

        var path = this.state.appuid + "/boughtlist/" + groupname + "/list/";
        var itempath = uid;
        path = path.concat(itempath.replace(/\s+/g, '').toLowerCase());

        firebase.database().ref(path).update(item);

        path = this.state.appuid + "/shoppinglist/" + groupname + "/lists/active/list";
        firebase.database().ref(path).child(uid).remove();
    }

    fbDelete = (uid, title) => {
        var groupname = this.state.groupname;
        var listname = this.state.listname;
        var ref = firebase.database().ref(this.state.appuid + "/shoppinglist/" + groupname + "/lists/" + listname + "/list");
        ref.child(uid).remove();
        ref.off();
    }

    fbLoadList = () => {
        var groupname = this.state.groupname;
        var listname = this.state.listname;

        //get group phone
        var path = this.state.appuid + "/groups/" + groupname;
        var ref = firebase.database().ref(path);
        ref.once('value', (snapshot) => {
            this.setState({ groupphone: snapshot.val().groupphone });
            this.setState({ groupnamefull: snapshot.val().groupname });
            this.props.navigation.setOptions({
                title: this.state.groupnamefull
            });
        });

        path = this.state.appuid + "/shoppinglist/" + groupname + "/lists/" + listname;
        ref = firebase.database().ref(path);

        ref.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                const newitem1 = snapshot.val().list;
                if (newitem1) {
                    this.setState({ items: newitem1 })
                    const newitem2 = snapshot.val().store;
                    if (newitem2) {
                        //if (newitem2.storename !== "Current Shopping List") {
                        this.setState({ storename: newitem2.storename });
                        this.setState({ storephone: newitem2.storephone });
                        console.log("287: " + newitem2.storename);
                        console.log("288: " + newitem2.storephone);
                        //} else {
                        //  this.setState({ storename: ''});
                        //  this.setState({ storephone: ''});
                        //}
                    }
                } else {
                    this.setState({ items: {} });
                    console.log("270: list is empty");
                }
            } else {
                this.setState({ items: {} });
                console.log("274: list is empty");
            }
        }.bind(this), function () {
            console.info("API initialization failed");
        });

        console.log("306: " + this.state.storename);
        console.log("307: " + this.state.storephone);
    }

    showBoughtList = () => {
        console.log("227 showboughtlist");
    }

    fbAddToList = () => {
        Keyboard.dismiss()
        var listname = this.state.listname;
        if (listname === "Current Shopping List") {
            listname = "active";
        }

        if (this.state.singleitem == null || this.state.singleitem == "") {
            return null;
        }
        var groupname = this.state.groupname;
        var path = this.state.appuid + "/shoppinglist/" + groupname + "/lists/" + listname + "/list";
        var singleitem = this.state.singleitem;
        path = path.concat('/', singleitem.replace(/\s+/g).toLowerCase());

        var ref = firebase.database().ref(path);
        ref.update({ "title": this.state.singleitem, "quantity": this.state.quantity, "id": Date.now() });

        path = this.state.appuid + "/shoppinglist/" + groupname + "/lists/" + listname + "/store";
        ref = firebase.database().ref(path);
        ref.update({ "storename": "Current Shopping List", "storephone": "" });

        this.singleitem.clear();
        this.quantity.clear();

        path = this.state.appuid + "/shoppinglist/" + groupname + "/lists/" + listname;
        ref = firebase.database().ref(path);

        ref.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                const newitem1 = snapshot.val().list;
                if (newitem1) {
                    this.setState({ items: newitem1 })
                    const newitem2 = snapshot.val().store;
                    if (newitem2) {
                        this.setState({ storename: newitem2.storename });
                        this.setState({ storephone: newitem2.storephone });
                    }
                } else {
                    this.setState({ items: {} });
                    console.log("270: list is empty");
                }
            } else {
                this.setState({ items: {} });
                console.log("274: list is empty");
            }
        }.bind(this), function () {
            console.info("API initialization failed");
        });
    }
}

const styles = StyleSheet.create({
    level_1: {
        height: 70,
        flexDirection: 'row'
    },
    level_11: {
        height: 70,
        flex: 75
    },
    level_12: {
        height: 70,
        flex: 20
    },
    level_13: {
        height: 70,
        flex: 15
    },
    icon: {
        paddingVertical: 11,
        paddingHorizontal: 0,
        paddingLeft: 0,
        height: 70
    },
    level_111: {
        height: 70,
        paddingLeft: 20,
        borderColor: 'lightgray',
        borderWidth: 1,
        fontSize: 20,
        color: '#ffffff'
    },
    level_121: {
        paddingLeft: 20,
        borderColor: 'lightgray',
        borderWidth: 1,
        fontSize: 20,
        height: 70,
        color: '#ffffff'
    },
    level_131: {
        paddingLeft: 2,
        borderColor: 'lightgray',
        borderWidth: 1,
        fontSize: 20,
        height: 70
    },


    container1: {
        flex: 1,
        flexDirection: 'column',
        padding: 5,
        backgroundColor: '#d47024'

    },
    col1: {
        padding: 1,
        flex: 0
    },
    col2: {
        padding: 1,
        flex: 83
    },
    col3: {
        padding: 1,
        flex: 10
    },


    row_1: {
        height: 25,
        flexDirection: 'row'
    },
    row_11: {
        padding: 5,
        flex: 1,
        height: 25
    },


    textRow2: {
        width: 200,
        flex: 2,
    },
    textRow1: {
        flex: 1,
    },

    TI: {
        width: 150,
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 20
    },


    textGlobal: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#ffffff'
    },
    buttonStyle: {
        justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
        height: 50,
        backgroundColor: '#d47024',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#ffffff',
        marginLeft: 5,
        marginRight: 5,
        overflow: 'hidden'
    }
});


export default ShoppingList;