import React from 'react';
import ListItem, { Separator } from './ListItem';
import * as firebase from 'firebase';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, AsyncStorage, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


class ShoppingList extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            items: {},
            singleitem: "",
            groupname: "",
            groupphone: "",
            quantity: "1",
            storename: "",
            storephone: "",
            from: "",
            labelleft: "",
            lagelright: "",
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

    getAsyncData() {
        console.log(this.state.quantity);
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
        this._isMounted = true;
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
                        ? <View style={styles.padTop}>
                            <Text>{this.state.groupname} {this.state.groupphone} </Text>
                        </View>
                        : <View style={styles.level_1}>
                            <View style={styles.level_11}>
                                <TextInput
                                    style={styles.level_111}
                                    placeholder="Peanut/ಕಡ್ಲೇಕಾಯಿ"
                                    onChangeText={(itm) => this.setState({ singleitem: itm })}
                                    ref={input => { this.singleitem = input }}
                                />
                            </View>
                            <View style={styles.level_12}>
                                <TextInput
                                    style={styles.level_121}
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
                                    <Icon style={styles.icon} name="shopping-cart" size={30} color="blue" />
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
                                title={this.state.items[item].title}
                                onSwipeFromLeft={() => { this.fbAddToBoughtList(item, this.state.items[item].title, this.state.items[item].id) }}
                                onRightPress={() => { this.fbDelete(item, this.state.items[item].title) }}
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
                            {(this.state.storename)
                                ? <View style={styles.row_11}>
                                    <Text>Store Pickup with</Text>
                                    <Text>{this.state.storename}</Text>
                                </View>
                                : <View style={styles.row_11} >
                                    <TouchableOpacity
                                        style={styles.buttonStyle}
                                        onPress={() => { this.addListToStore() }}
                                    >
                                        <Text>Store Pickup</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            <View style={styles.row_11}>
                                <TouchableOpacity
                                    style={styles.buttonStyle}
                                    onPress={() => {
                                        this.props.navigation.navigate('BoughtList');
                                    }}
                                >
                                    <Text>Bought List</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        : <View style={styles.row_1}>
                            <View style={styles.row_11}>
                                <TouchableOpacity
                                    style={styles.buttonStyle}
                                    onPress={() => { this.notifyCustomer() }}
                                >
                                    <Text>Notify Customer Pickup</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
            </View>
        );
    };

    notifyCustomer = () => {
        this.props.navigation.navigate('NotifyCustomer');
    }

    addListToStore = () => {
        this.props.navigation.navigate('AddListToStore');
    };

    fbAddToBoughtList = (uid, title, id) => {
        console.log("uid: " + uid);
        var listname = this.state.groupname;
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
        var refpath = "boughtlist/" + listname + "/list/";
        var itempath = uid;
        itempath = refpath.concat(itempath.replace(/\s+/g, '').toLowerCase());
        console.log("49: " + itempath);

        firebase.database().ref(itempath).update({ "title": title, "id": id });
        //            .then((data) => { console.log('success', data) })
        //            .catch((error) => { console.log('error', error) });

        firebase.database().ref("shoppinglist/" + listname + "/list").child(uid).remove();
        //            .then((data) => { console.log('success', data) })
        //            .catch((error) => { console.log('error', error) });
    }

    fbDelete = (uid, title) => {
        var listname = this.state.groupname;
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

        var ref = firebase.database().ref("shoppinglist/" + listname + "/list");
        ref.child(uid).remove();
        /*
                var ref = firebase.database().ref("shoppinglist/" + listname);
                ref.on('value', function (snapshot) {
                    if (snapshot.val() != null) {
                        console.log(snapshot);
                        const newitem1 = snapshot.val().list;
                        console.log(newitem1);
                        this.setState({ items: newitem1 })
                    }
                }.bind(this), function () {
                    console.info("API initialisation failed");
                });
                */
    }

    fbLoadList = () => {
        console.log("200 : todo list" + this.state.groupname);
        var listname = this.state.groupname;
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

        //get group info
        var ref = firebase.database().ref("groups/" + listname + "/groupphone");
        ref.once('value', (snapshot) => {
            console.log("245: " + snapshot.val());
            this.setState({ groupphone: snapshot.val() });
        });

        ref = firebase.database().ref("shoppinglist/" + listname + "/list").orderByChild('id');


        ref.on('value', function (snapshot) {
            /*
                        snapshot.forEach(function(childSnapshot) {
                            var childKey = childSnapshot.key;
                            var childData = childSnapshot.val();
                            console.log(childKey + "  " + childData.id);
                          });
            */
            if (snapshot.val() != null) {
                //                console.log("217 " + snapshot);
                const newitem1 = snapshot.val();//.list;
                //                console.log(":221 " + newitem1);
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
        console.log("end getData, looking for ", ref);
    }

    showBoughtList = () => {
        console.log("227 showboughtlist");
    }

    fbAddToList = () => {
        Keyboard.dismiss()

        if (this.state.singleitem == null || this.state.singleitem == "") {
            return null;
        }
        var listname = this.state.groupname;
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
        var refpath = "shoppinglist/" + listname + "/list/";
        var itempath = this.state.singleitem;
        itempath = refpath.concat(itempath.replace(/\s+/g, '').toLowerCase());
        console.log("49: " + itempath);
        var ref = firebase.database().ref(itempath);
        ref.update({ "title": this.state.singleitem.concat(" : ", this.state.quantity), "id": Date.now() });

        this.singleitem.clear();
        this.quantity.clear();

        var ref2 = firebase.database().ref("shoppinglist/" + listname);
        console.log("In getData, looking for ", ref2);

        ref2.on('value', function (snapshot) {
            console.log(snapshot);
            const newitem1 = snapshot.val().list;
            console.log(newitem1);
            this.setState({ items: newitem1 })
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
        paddingVertical: 15,
        paddingHorizontal: 0,
        height: 70
    },
    level_111: {
        height: 70,
        paddingLeft: 10,
        borderColor: 'orange',
        borderWidth: 1,
        fontSize: 20
    },
    level_121: {
        paddingLeft: 10,
        borderColor: 'white',
        borderWidth: 1,
        fontSize: 20,
        height: 70
    },
    level_131: {
        paddingLeft: 10,
        borderColor: 'green',
        borderWidth: 1,
        fontSize: 20,
        height: 70
    },


    container1: {
        flex: 1,
        flexDirection: 'column',
        padding: 5
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
        flex: 8
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
        fontSize: 20
    },
    buttonStyle: {
        justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
        height: 50,
        backgroundColor: 'lightgray',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#007aff',
        marginLeft: 5,
        marginRight: 5,
        overflow: 'hidden'
    }
});


export default ShoppingList;