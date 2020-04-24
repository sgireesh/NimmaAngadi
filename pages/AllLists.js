import React from 'react';
import ListItem, { Separator } from './ListItem';
import * as firebase from 'firebase';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, AsyncStorage, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


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
            appuid: 'dh7OXmOVKNeDNVwR4XKyc70097I2/'
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
        console.log("46: " + firebase.apps.length);

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        firebase.auth().signInWithEmailAndPassword('gireesh.subramanya@gmail.com', 'alskdj1')
            .then(function (result) {
                console.log("41: " + result.user.uid + "   " + Object.keys(result.user));
            }).catch(function (error) {
                console.log("43: " + error);
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
        this.fbAuthenticate();
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

    render = () => {
        return (
            <View style={styles.container1}>
                <View>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        title="Family"
                        onPress={() => {
                            this.saveData('active');
                        }
                        }
                    >
                        <Text style={styles.textGlobal}>My Shopping List</Text>
                    </TouchableOpacity>
                </View>
                <View >
                    <View style={styles.padTop}>
                        <Text style={styles.textGlobal}>Group Name: {this.state.groupnamefull}</Text>
                        <Text style={styles.textGlobal}>Phone :  {this.state.groupphone} </Text>
                    </View>
                </View>
                <View style={styles.col2}>
                    <FlatList
                        data={Object.keys(this.state.items)}
                        renderItem={({ item, index }) => (
                            <ListItem
                                pagename='AllLists'
                                title={'list sent to:   ' + this.state.items[item].store.storename}
                                onSwipeFromLeft={() => { this.fbAddToBoughtList(item, this.state.items[item].title, this.state.items[item].id) }}
                                onRightPress={() => { this.fbDelete(item, this.state.items[item].title) }}
                                onTitlePress={() => {
                                    console.log("117: pressed");
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
        var refpath = this.state.appuid + "boughtlist/" + groupname + "/list/";
        var itempath = uid;
        itempath = refpath.concat(itempath.replace(/\s+/g, '').toLowerCase());
        console.log("49: " + itempath);

        firebase.database().ref(itempath).update({ "title": title, "id": id });
        firebase.database().ref(this.state.appuid + "shoppinglist/" + groupname + "/lists/active/list").child(uid).remove();
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

        var ref = firebase.database().ref(this.state.appuid + "shoppinglist/" + listname + "/list");
        ref.child(uid).remove();
    }

    fbLoadList = () => {
        var groupname = this.state.groupname;
        
        //get group phone
        var path = this.state.appuid + "groups/" + groupname;
        var ref = firebase.database().ref(path);
        console.log("204: looking for ", ref);

        ref.once('value', (snapshot) => {
            console.log("205: " + Object.keys(snapshot));
            this.setState({ groupphone: snapshot.val().groupphone });
            this.setState({ groupnamefull: snapshot.val().groupname });
        });

        path = this.state.appuid + "shoppinglist/" + groupname + "/lists/";
        ref = firebase.database().ref(path);

        ref.once('value', function (snapshot) {
            if (snapshot.val() != null) {
                const newitem1 = snapshot.val();
                console.log("217 " + newitem1);
                if (newitem1) {
                    delete newitem1['active'];
                    this.setState({ items: newitem1 })
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
        fontSize: 20,
        padding: 10
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

export default AllLists;