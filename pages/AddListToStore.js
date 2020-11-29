import React, { Component } from 'react';
import ListItem, { Separator } from './ListItem';
import { View, Text, StyleSheet, AsyncStorage, FlatList } from 'react-native';
import * as firebase from 'firebase';


class AddListToStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            activeitems: {},
            storename: '',
            groupname: '',
            groupphone: '',
            isFamilyLoggedIn: true,
            appuid: 'dh7OXmOVKNeDNVwR4XKyc70097I2'
        };
        this.getAsyncData();
    }

    componentDidMount() {
        if (!firebase.apps.length) {
            this.fbAuthenticate();
        }
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
        var ref = firebase.database().ref(this.state.appuid + "/stores/");
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
        var storepath = storename;
        var grouppath = this.state.groupname;
        storepath = this.state.appuid + "/pendingorders/".concat(storepath.replace(/\s+/g, '').toLowerCase().concat("/", grouppath.replace(/\s+/g, '').toLowerCase()));
        var ref = firebase.database().ref(storepath);
        ref.update({ "groupname": this.state.groupname, "groupphone": this.state.groupphone, "storestatus": "open" });

        var path = this.state.appuid + "/shoppinglist/".concat(grouppath, "/lists/active");
        ref = firebase.database().ref(path);
        //copy the list to a new name
        ref.once('value', function (snapshot) {
            if (snapshot.val() != null) {
                console.log(snapshot);
                const newitem1 = snapshot.val().list;
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
        var ref = firebase.database().ref(this.state.appuid + "/groups/" + groupname + "/groupphone");
        ref.once('value', (snapshot) => {
            groupphone = snapshot.val();
        }).then(() => {
            var listname = groupphone.concat("_", Date.now());
            path = this.state.appuid + "/shoppinglist/".concat(grouppath, "/lists/", listname);
            ref = firebase.database().ref(path);
            ref.update({ list: this.state.activeitems });

            //create a unique list name, and then assigned store.
            storepath = this.state.appuid + "/shoppinglist/".concat(grouppath.replace(/\s+/g, '').toLowerCase(), "/lists/", listname, "/store");
            ref = firebase.database().ref(storepath);
            ref.update({ "storename": storename, "storephone": storephone });

            //clear active list
            path = this.state.appuid + "/shoppinglist/".concat(grouppath, "/lists/active");
            ref = firebase.database().ref(path);
            if(ref != undefined) {
                ref.remove();
            }
        });
        this.saveData();
    }

    render() {
        return (
            <View style={styles.container1}>
                <View style={styles.col1}>
                    <Text style={styles.textGlobal}>Share your shopping list with:</Text>
                </View>
                <View style={styles.col2}>
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
        color:'#ffffff'
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
export default AddListToStore;