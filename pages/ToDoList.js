import React from 'react';
import * as firebase from 'firebase';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Item, FlatList} from 'react-native';

class ToDoList extends React.Component {

    state = {
        items: [],
        singleitem:"",
    };

    componentDidMount(){
        this.fbLoadList();
    }

    render() {
        return (
            <View  style={styles.padTop}>
          <TextInput
                style={styles.TI}
                placeholder="Peanut Butter"
                onChangeText={(itm) => this.setState({singleitem : itm})}
            />
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={this.fbAddToList}
                >
                    <Text>Add New</Text>
                </TouchableOpacity>
                <View >
                    <SafeAreaView style={styles.container}>
                        <FlatList
                            data={this.state.items}
                            renderItem={({ item }) => <Text>{item.title} </Text>}
                        />
                    </SafeAreaView>
                </View>
            </View>
        );
    }

    fbLoadList = () => {
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
        //    fbToDoList() {
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
        
        var itemarray = this.state.items.concat({"title":this.state.singleitem, "id":this.state.items.length});
        this.setState({ items: itemarray })
        firebase.database().ref('shoppinglist/' + listname).set({
            list: itemarray
        });

        var ref = firebase.database().ref("shoppinglist/" + listname);
        console.log("In getData, looking for ", ref);

        // get support data from firebase
        ref.on('value', function (snapshot) {
            console.log("In Value");
            const newitem1 = snapshot.val().list;
            console.log(newitem1);
            this.setState({ items: newitem1 })

        }.bind(this), function () {
            console.info("API initialisation failed");
        });

        console.log("end getData, looking for ", ref);
    }

    storeHighScore(listname, item) {
        firebase.database().ref('shoppinglist/' + listname).set({
            list: item
        });
    }

}


const styles = StyleSheet.create({
    container: {
      
        marginTop: 40,
      },
    TI: {
        padding: 10,
        borderColor: 'black',
        borderWidth: 1
    },
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

  
export default ToDoList;