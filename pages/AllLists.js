import React from 'react';
import ListItem, { Separator } from './ListItem';
import * as firebase from 'firebase';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';

class AllLists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            groupnamefull: "",
            groupname: "",
            groupphone: "",
            from: "",
            labelleft: "",
            lagelright: "",
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
        AsyncStorage.getItem("from").then((value) => {
            console.log("Allist: 37: from: " + value);
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
            console.log("alllist: 61: groupname: " + value);
            this.setState({ "groupname": value });
        }).then(res => { this.fbLoadList() });
    }

    componentDidMount() {
        if (!firebase.apps.length) {
            this.fbAuthenticate();
        }
    }

    saveData = async (listname) => {
        try {
            await AsyncStorage.setItem('listname', listname, (err) => {
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

    getDt(dt) {
        var dtte = moment.unix(dt / 1000).format('MM-DD hh:mm A');
        return dtte;
    }


    render = () => {
        return (
            <View style={styles.container1}>
                <View style={styles.col1}>
                    <View>
                        <Text style={styles.textGlobal}>Group Name: {this.state.groupnamefull}</Text>
                        <Text style={styles.textGlobal}>Phone :  {this.state.groupphone} </Text>
                    </View>
                </View>
                <View style={styles.col2}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        title="Family"
                        onPress={() => {
                            this.saveData('active');
                        }
                        }
                    >
                        <View style={styles.row_11}>
                            <Text style={styles.textGlobal}> Add Items to my Current List </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View >
                    <View> 
                        <Text style={styles.textGlobal}>Status below on lists you sent to Stores</Text>
                    </View>
                </View>
                <View style={styles.col3}>
                    <FlatList
                        data={Object.keys(this.state.items)}
                        renderItem={({ item, index }) => (
                            <ListItem
                                pagename='AllLists'
                                title={this.getDt(item.split('_')[1]).concat(" ", this.state.items[item].store.storename)}
                                onSwipeFromLeft={() => { this.fbAddToBoughtList(item, this.state.items[item].title, this.state.items[item].id) }}
                                onRightPress={() => { this.fbDelete(item, this.state.items[item].title) }}
                                onTitlePress={() => {
                                    this.saveData(item);
                                }}
                                textlabelright={this.state.labelright}
                                textlabelleft={this.state.labelleft}
                            />
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={() => <Separator />}
                    />
                </View>
            </View>
        );
    };

    fbAddToBoughtList = (uid, title, id) => {
        console.log("uid: " + uid);
        var groupname = this.state.groupname;
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
        var refpath = this.state.appuid + "/boughtlist/" + groupname + "/list/";
        var itempath = uid;
        itempath = refpath.concat(itempath.replace(/\s+/g, '').toLowerCase());
        console.log("49: " + itempath);

        firebase.database().ref(itempath).update({ "title": title, "id": id });
        firebase.database().ref(this.state.appuid + "/shoppinglist/" + groupname + "/lists/active/list").child(uid).remove();
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

        var ref = firebase.database().ref(this.state.appuid + "/shoppinglist/" + listname + "/list");
        ref.child(uid).remove();
    }

    fbLoadList = () => {
        var groupname = this.state.groupname;

        //get group phone
        var path = this.state.appuid + "/groups/" + groupname;
        var ref = firebase.database().ref(path);

        ref.once('value', (snapshot) => {
            this.setState({ groupphone: snapshot.val().groupphone });
            this.setState({ groupnamefull: snapshot.val().groupname });
        });

        path = this.state.appuid + "/shoppinglist/" + groupname + "/lists/";
        ref = firebase.database().ref(path);

        ref.once('value', function (snapshot) {
            if (snapshot.val() != null) {
                const newitem1 = snapshot.val();
                if (newitem1) {
                    delete newitem1['active'];
                    this.setState({ items: newitem1 })
                } else {
                    this.setState({ items: {} });
                    console.log("226: list is empty");
                }
            } else {
                this.setState({ items: {} });
                console.log("230: list is empty");
            }
        }.bind(this), function () {
            console.info("API initialization failed");
        });
    }
}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        flexDirection: 'column',
        padding: 5,
        backgroundColor: '#d47024'
    },
    col1: {
        padding: 1,
        flex: 20
    },
    col2: {
        padding: 1,
        flex: 10
    },
    col3: {
        padding: 1,
        flex: 70
    },


    row_1: {
        height: 25,
        flexDirection: 'row'
    },
    row_11: {
        padding: 3,
        flex: 1
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
        padding: 5,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#ffffff',
        justifyContent: 'center'
    },
    buttonStyle: {
        justifyContent: 'center', //Centered vertically
        //  alignItems: 'center', // Centered horizontally
        height: 50,
        backgroundColor: 'black',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#ffffff',
        marginLeft: 5,
        marginRight: 5,
        overflow: 'hidden'
    }
});

export default AllLists;