import React from 'react';
import ListItem, { Separator } from './ListItem';
import * as firebase from 'firebase';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, AsyncStorage, Picker } from 'react-native';


class BoughtList extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            items: {},
            singleitem: "",
            groupname: "",
            quantity: "1",
            storename: "",
            storephone: "",
            from: "",
            appuid: 'dh7OXmOVKNeDNVwR4XKyc70097I2/'    
        };
        this.getAsyncData();
    }

    getAsyncData() {
        console.log(this.state.quantity);
        AsyncStorage.getItem("from").then((value) => {
            console.log("boughtlist: 26: from: " + value);
            this.setState({ "from": value });
        });
        AsyncStorage.getItem("groupname").then((value) => {
            console.log("boughtlist: 23: groupname: " + value);
            this.setState({ "groupname": value });
        }).then(res => { this.fbLoadList() });
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
    componentDidMount() {
        this.fbAuthenticate();
        this._isMounted = true;
    }
    UNSAFE_componentWillMount() {
        this._isMounted = false;
    }

    render = () => {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <FlatList
                        data={Object.keys(this.state.items)}
                        renderItem={({ item, index }) => (
                            <ListItem
                                title={this.state.items[item].title.concat(" : ", this.state.items[item].quantity)}
                                onSwipeFromLeft={() => { this.fbAddToShoppingList(item, this.state.items[item])}}
                                onRightPress={() => { this.fbDelete(item, this.state.items[item].title) }}
                                textlabelright="delete"
                                textlabelleft="buy again"
                            />
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={() => <Separator />}
                    />
                </View>
                <View style={styles.padTop}>

                    <View style={styles.container}>
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => {
                                this.props.navigation.navigate('ShoppingList');
                            }}
                        >
                            <Text>Back to Shopping List</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    fbAddToShoppingList = (uid, item) => {
        console.log("62: uid: " + uid);
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
        var path = this.state.appuid + "shoppinglist/" + groupname + "/lists/active/list/";
        var itempath = uid;
        path = path.concat(itempath.replace(/\s+/g, '').toLowerCase());

        var ref = firebase.database().ref(path);
        ref.update(item);

        ref = firebase.database().ref(this.state.appuid + "boughtlist/" + groupname + "/list");
        ref.child(uid).remove();
    }

    fbDelete = (uid, title) => {
        console.log("89: " + uid);
        var listname = this.state.groupname;
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
        var ref = firebase.database().ref(this.state.appuid + "boughtlist/" + listname + "/list");
        ref.child(uid).remove();

        var ref = firebase.database().ref(this.state.appuid + "boughtlist/" + listname);
        ref.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                console.log("110: " + snapshot);
                const newitem1 = snapshot.val().list;
                console.log(newitem1);
                this.setState({ items: newitem1 })
            }
        }.bind(this), function () {
            console.info("API initialization failed");
        });
    }

    fbLoadList = () => {
        console.log("todo list" + this.state.groupname);
        var groupname = this.state.groupname;
        // Initialize Firebase
        /*
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
        var ref = firebase.database().ref(this.state.appuid + "boughtlist/" + groupname);
        ref.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                //console.log(snapshot);
                const newitem1 = snapshot.val().list;
                //console.log(newitem1);
                this.setState({ items: newitem1 })
                const newitem2 = snapshot.val().store;
                if (newitem2) {
                    this.setState({ storename: newitem2.storename });
                    this.setState({ storephone: newitem2.storephone });
                }
            } else {
                this.setState({ items: {} });
                console.log("228: list is empty");
            }
        }.bind(this), function () {
            console.info("API initialization failed");
        });
        console.log("end getData, looking for ", ref);
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


export default BoughtList;