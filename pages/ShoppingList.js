import React from 'react';
import ListItem, { Separator } from './ListItem';
import * as firebase from 'firebase';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, AsyncStorage, Picker } from 'react-native';


class ShoppingList extends React.Component {
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
            from:""
        };
        this.getAsyncData();
    }

    getAsyncData() {
        console.log(this.state.quantity);
        AsyncStorage.getItem("from").then((value) => {
            console.log("shoppinglist: 26: from: " + value);
            this.setState({ "from": value });
        });
        AsyncStorage.getItem("groupname").then((value) => {
            console.log("shoppinglist: 23: groupname: " + value);
            this.setState({ "groupname": value });
        }).then(res => { this.fbLoadList() });
    }

    componentDidMount() {
        this._isMounted = true;
    }
    componentWillMount() {
        this._isMounted = false;
    }

    getPickerElements() {
        var pickerArr = [];
        for (var i = 0; i < 10; i++) {
            var s = '' + i;
            pickerArr.push(<Picker.Item label={s} value={s} key={i} />)
        }
        return pickerArr;
    }

    render = () => {
        return (
            <View style={styles.container}>
                {(this.state.from === 'store')
                    ? <View style={styles.padTop}>
                        <Text>inside store pick up </Text>
                    </View>
                    : <View style={styles.padTop}>
                        <View style={styles.TI}>
                            <TextInput
                                placeholder="Peanut Butter                  "
                                onChangeText={(itm) => this.setState({ singleitem: itm })}
                            />
                        </View>
                        <View style={styles.TI}>
                            <Text >Qty</Text>
                        </View>
                        <View style={styles.TI}>
                            <Picker
                                selectedValue={this.state.quantity}
                                style={{ height: 25, width: 75 }}
                                onValueChange={(itemValue, itemIndex) => this.setState({ quantity: itemValue })}
                            >
                                {this.getPickerElements()}
                            </Picker>
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={this.fbAddToList}
                            >
                                <Text>    +    </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                }

                <View style={styles.container}>
                    <FlatList
                        data={Object.keys(this.state.items)}
                        renderItem={({ item, index }) => (
                            <ListItem
                                title={this.state.items[item].title}
                                onSwipeFromLeft={() => { this.fbAddToBoughtList(item, this.state.items[item].title, this.state.items[item].id) }}
                                onRightPress={() => { this.fbDelete(item, this.state.items[item].title) }}
                                textlabelright="delete"
                                textlabelleft="bought"
                            />
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={() => <Separator />}
                    />
                </View>
                <View style={styles.padTop}>
                    {(this.state.storename)
                        ? <View >
                            <Text>Store Pickup with</Text>
                            <Text>{this.state.storename}</Text>
                        </View>
                        : <View style={styles.container}>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={() => {this.addListToStore()}}
                            >
                                <Text>Store Pickup</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={styles.container}>
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
            </View>
        );
    };

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
        
        firebase.database().ref(itempath).update({ "title": title, "id": id })
        .then((data) => { console.log('success', data)})
        .catch((error)=>{console.log('error', error)});
        
        firebase.database().ref("shoppinglist/" + listname + "/list").child(uid).remove()
        .then((data) => { console.log('success', data)})
        .catch((error)=>{console.log('error', error)});        
    }
/*
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
    }
*/
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

        var ref = firebase.database().ref("shoppinglist/" + listname);
        ref.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                console.log("217 " + snapshot);
                const newitem1 = snapshot.val().list;
                console.log(":221 " +newitem1);
                this.setState({ items: newitem1 })
                const newitem2 = snapshot.val().store;
                if (newitem2) {
                    this.setState({ storename: newitem2.storename });
                    this.setState({ storephone: newitem2.storephone });
                }
            } else {
                this.setState({items: {}});
                console.log("228: list is empty");
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
        ref.update({ "title": this.state.singleitem.concat(" quantity: ", this.state.quantity), "id": this.state.singleitem.length });

        this.setState({ singleitem: '' });
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


export default ShoppingList;