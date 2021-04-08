import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import ToDoList from './ToDoList';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class StartYourOwnFamily extends React.Component {

    state = {
        familyname:"",
    };

    App() {
        return (
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="ToDoList"
                component={ToDoListScreen}
                options={{ title: 'Shopping List' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        );
      }
      
    ToDoListScreen({ navigation }) {
        return (
          <ToDoList />
        );
      }

    render(navigation) {
        return (
        <View style={styles.padTop}>
            <Text style={styles.textGlobal}>Family Name</Text>
            <View style={styles.padTop}>
            <TextInput
                    style={styles.TI}
                    placeholder="SubbammanaMane"
                    onChangeText={(fn) => this.setState({familyname : fn})}
                />
            </View>
            <View style={styles.padTop}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.buttonStyle}
                        title="List of Items"
                        onPress={navigation.navigate('ToDoList')}
                    >
                        <Text style={styles.textGlobal}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
    }

    saveFamily = (navigation) => {
        if(this.state.familyname == null || this.state.familyname == ""){
            return null;
        }
        alert(this.state.familyname);
        AsyncStorage.setItem('familyname', this.state.familyname);
        navigation.navigate('ToDoList');
    }


}

const styles = StyleSheet.create({
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

export default StartYourOwnFamily;
