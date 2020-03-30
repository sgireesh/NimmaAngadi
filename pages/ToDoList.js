import React from 'react';
import ListItem, { Separator } from './ListItem';
import * as firebase from 'firebase';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, AsyncStorage} from 'react-native';

class ToDoList extends React.Component {

    state = {
        items: {},
        singleitem:"",
        familyname:"",
    };

    componentDidMount(){
        //var value = await AsyncStorage.getItem('familyname');
        //this.setState({familyname:value});
        
        AsyncStorage.getItem("familyname").then((value) => {
            alert(value);
            this.setState({"familyname": value});
        }).then ( res =>  {this.fbLoadList()});
    }

    render() {
        return (
            <View style={styles.container}>
            <Text>Family Name : {this.state.familyname}</Text>
                <TextInput
                    style={styles.TI}
                    placeholder="Peanut Butter"
                    onChangeText={(itm) => this.setState({singleitem : itm})}
                />
                <View  style={styles.padTop}>
                    <TouchableOpacity style={styles.padTop}
                        style={styles.buttonStyle}
                        onPress={this.fbAddToList}
                    >                
                        <Text>Add New</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <FlatList 
                        data={Object.keys(this.state.items)}
                        renderItem={({item, index }) => (  
                        <ListItem
                            title={this.state.items[item].title}
                            onSwipeFromLeft={() => {this.fbAddToBoughtList(item, this.state.items[item])}}
                            onRightPress={() => {this.fbDelete(item, this.state.items[item].title)}}
                        />
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={() => <Separator />}
                    />
                </View>                
            </View>
        );
    }

    fbAddToBoughtList = (uid, additem) => {
        var listname = "5827capilano";
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
        
        var ref = firebase.database().ref("boughtlist/" + listname +"/list");
        var p = ref.push();
        p.set(additem);
        var ref2 = firebase.database().ref("shoppinglist/" + listname);
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
        console.log("end getData, looking for ", ref2);
    }

    fbDelete = (uid, title) => {
        var listname = "5827capilano";
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

        var ref = firebase.database().ref("shoppinglist/" + listname +"/list");
        ref.child(uid).remove(); 
        var ref2 = firebase.database().ref("shoppinglist/" + listname);

        ref2.on('value', function (snapshot) {
            const newitem1 = snapshot.val().list;
            this.setState({ items: newitem1 })
        }.bind(this), function () {
            console.info("API initialisation failed");
        });
        alert('Deleted entry: ' + title);
    }

    fbLoadList = () => {
 //       alert(this.state.familyname);
        var listname = "5827capilano";
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
            if(snapshot.val() != null){
                console.log(snapshot);
                const newitem1 = snapshot.val().list;
                console.log(newitem1);
                this.setState({ items: newitem1 })
            }
        }.bind(this), function () {
            console.info("API initialisation failed");
        });
        console.log("end getData, looking for ", ref);
    }

    fbAddToList = () => {
        if(this.state.singleitem == null || this.state.singleitem == ""){
            return null;
        }
//        var listname = "5827capilano";
        var listname = this.state.familyname; 
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
        
        var additem = {"title":this.state.singleitem, "id":this.state.singleitem.length};

        var ref = firebase.database().ref("shoppinglist/" + listname +"/list");
        var p = ref.push();
        p.set(additem);
        var ref2 = firebase.database().ref("shoppinglist/" + listname);
        console.log("In getData, looking for ", ref2);

        ref2.on('value', function (snapshot) {
            console.log(snapshot);
            const newitem1 = snapshot.val().list;
            console.log(newitem1);
            this.setState({ items: newitem1 })
        }.bind(this), function () {
            console.info("API initialisation failed");
        });

        console.log("end getData, looking for ", ref2);
    }
    storeHighScore(listname, item) {
        firebase.database().ref('shoppinglist/' + listname).set({
            list: item
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex :1
      },
    TI: {
        padding: 10,
        borderColor: 'black',
        borderWidth: 1
    },
    padTop: {
      padding: 15
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

  
export default ToDoList;