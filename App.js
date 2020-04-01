import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddNewFamily from './pages/AddNewFamily';
import ToDoList from './pages/ToDoList';


class App extends Component {

    constructor(props){
      super(props);
      Stack = createStackNavigator();
      this.state = {
        fname:'',
        modalVisible: false,
      };
    }

    componentDidMount() {
      try{
        AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => console.log("24 " + 'success'))
        .then(() => this.setState({fname: ''}));
        
        AsyncStorage.getItem('familyname').then((value) => {
            if(value){
                this.setState({fname: value});
                console.log("30 " + this.state.fname);
            } else {
              this.setState({fname: ''});
            }
        });
      } catch (e){}
    }

    HomeScreen({ navigation }) {
      return (
        <View style={styles.padTop}>
          <View style={styles.padTop}>
            <Text style={styles.textGlobal}>Welcome! Choose an Option.</Text>
          </View>
          <View style={styles.padTop}>
            <View>
              <TouchableOpacity
                style={styles.buttonStyle}
                title="Family"
                onPress={() => navigation.navigate('AddNewFamily')}
              >
                <Text style={styles.textGlobal}>Individual or Family</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.padTop}>
            <View>
              <TouchableOpacity style={styles.buttonStyle}
                title="Store"
                onPress={() => navigation.navigate('ShopList')}
              >
                <Text style={styles.textGlobal}>Store</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    ToDoListScreen({ navigation }) {
          return (
            <ToDoList navigation={navigation}/>
          );
    }  

    ShopListScreen = ({ navigation }) => {
        console.log("91: fname" + this.state.fname);
        if(this.state.fname) {          
            return (
              <ToDoList />
            );
          } else { 
          return (
      <View >
        <Text style={styles.textGlobal}>Your Primary Phone Number</Text>
          <View style={styles.padTop}>
          <TextInput
                  style={styles.TI}
                  placeholder="408-555-1212"
                  onChangeText={(fn) => this.state.fname=fn}
              />
          </View>
                <View style={styles.padTop}>
                <View style={styles.container}>
                        <TouchableOpacity style={styles.buttonStyle}
                            title="List of Items"
                            //onPress={() => navigation.navigate('ToDoList')}

                            onPress={() =>   {
                              console.log("114:  setitem " +this.state.fname);
                              AsyncStorage.setItem('familyname', this.state.fname).then 
                              (
                                navigation.navigate('ToDoList')
                              );
                            }}
                        >
                            <Text style={styles.textGlobal}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>                  
      </View>
          );
        }    
    }

    AddNewFamilyScreen({ navigation }) {
      return (
        <AddNewFamily navigation={navigation}/>
      );
    }
    
    render() {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={this.HomeScreen}
              options={{ title: 'Nimma Angadi', headerTitleAlign: 'center' }}
            />
            <Stack.Screen
              name="AddNewFamily"
              component={this.AddNewFamilyScreen}
              options={{ title: 'AddNewFamily' }}
            />
            <Stack.Screen
              name="ToDoList"
              component={this.ToDoListScreen}
              options={{ title: 'Shopping List' }}
            />
            <Stack.Screen
              name="ShopList"
              component={this.ShopListScreen}
              options={{ title: 'Shopping List' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
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

export default App;