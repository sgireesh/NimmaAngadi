import React from 'react';
import ListItem, { Separator } from './ListItem';
import * as firebase from 'firebase';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


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
            <View style={styles.container1}>
                <View style={styles.col2}>
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
                <View style={styles.col3}>
                    <View style={styles.rowl1}>
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
        
        var path = this.state.appuid + "shoppinglist/" + groupname + "/lists/active/list/";
        var itempath = uid;
        path = path.concat(itempath.replace(/\s+/g, '').toLowerCase());

        var ref = firebase.database().ref(path);
        ref.update(item);

        ref = firebase.database().ref(this.state.appuid + "boughtlist/" + groupname);
        ref.once('value', function (snapshot) {
            if (snapshot.val() != null) {
                console.log("112: loading data");
                const newitem1 = snapshot.val().list;
                this.setState({ items: newitem1 })                
            } else {
                this.setState({ items: {} });
            }
        }.bind(this), function () {
            console.info("API initialization failed");
        });
        
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
        var groupname = this.state.groupname;

        console.log("298 : " + groupname);

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

        ref = firebase.database().ref(this.state.appuid + "boughtlist/" + groupname);
        ref.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                //console.log(snapshot);
                const newitem1 = snapshot.val().list;
                //console.log(newitem1);
                this.setState({ items: newitem1 })
                
            } else {
                this.setState({ items: {} });
                console.log("228: list is empty");
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

export default BoughtList;