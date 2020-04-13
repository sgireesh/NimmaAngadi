import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage, } from 'react-native';
import { NavigationContainer, NavigationEvents } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddNewFamily from './pages/AddNewFamily';
import AddNewStore from './pages/AddNewStore';
import ShoppingList from './pages/ShoppingList';
import BoughtList from './pages/BoughtList';
import PendingOrders from './pages/PendingOrders';
import AddListToStore from './pages/AddListToStore';
import NotifyCustomer from './pages/NotifyCustomer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFamilyLoggedIn: false,
      isStoreLoggedIn: false,
      groupname: '',
      setflag1: false,
    };
    Stack = createStackNavigator();
    //this.clearAsyncData();
    this.getData();
  }

  clearAsyncData() {
    console.log("21: clearasyncdata");
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys))
      .then(() => console.log("24 " + 'success'))
      .then(() => this.setState({ isFamilyLoggedIn: false }))
      .then(() => this.setState({ isStoreLoggedIn: false }))
      .then(() => this.setState({ groupname: '' }));
  }

  setNewFamily = async ({navigation}) => {
    try {
      await AsyncStorage.getItem('groupname', (err, value) => {
        if (!err && value != null) {
          this.setState({ isFamilyLoggedIn: true });
          this.setState({ groupname: value });
          console.log("40 " + this.state.isFamilyLoggedIn);
          console.log("41 " + value + " " + this.state.groupname);
        } else {
          this.setState({ isFamilyLoggedIn: false });
        }
      })
    } catch (e) {
      console.log("Error ", e);
    }

    try {
      await AsyncStorage.getItem('storename', (err, value) => {
        if (!err && value != null) {
          this.setState({ isStoreLoggedIn: true });
          this.setState({ storename: value });
          console.log("40 " + this.state.isStoreLoggedIn);
          console.log("41 " + value + " " + this.state.storename);
        } else {
          this.setState({ isStoreLoggedIn: false });
        }
      })
    } catch (e) {
      console.log("Error ", e);
    }
    console.log("65 app.js" + this.state.isFamilyLoggedIn);
    if(this.state.isFamilyLoggedIn) {
      navigation.navigate('ShoppingList');
    } else {
    navigation.navigate('AddNewFamily');
    }
  }


  setNewStore = async ({navigation}) => {
    try {
      await AsyncStorage.getItem('groupname', (err, value) => {
        if (!err && value != null) {
          this.setState({ isFamilyLoggedIn: true });
          this.setState({ groupname: value });
          console.log("40 " + this.state.isFamilyLoggedIn);
          console.log("41 " + value + " " + this.state.groupname);
        } else {
          this.setState({ isFamilyLoggedIn: false });
        }
      })
    } catch (e) {
      console.log("Error ", e);
    }

    try {
      await AsyncStorage.getItem('storename', (err, value) => {
        if (!err && value != null) {
          this.setState({ isStoreLoggedIn: true });
          this.setState({ storename: value });
          console.log("40 " + this.state.isStoreLoggedIn);
          console.log("41 " + value + " " + this.state.storename);
        } else {
          this.setState({ isStoreLoggedIn: false });
        }
      })
    } catch (e) {
      console.log("Error ", e);
    }
    console.log("106 app.js" + this.state.isStoreLoggedIn);
    if(this.state.isStoreLoggedIn) {
      navigation.navigate('PendingOrders');
    } else {
    navigation.navigate('AddNewStore');
    }
  }


  getData = async () => {
    try {
      await AsyncStorage.getItem('groupname', (err, value) => {
        if (!err && value != null) {
          this.setState({ isFamilyLoggedIn: true });
          this.setState({ groupname: value });
          console.log("40 " + this.state.isFamilyLoggedIn);
          console.log("41 " + value + " " + this.state.groupname);
        } else {
          this.setState({ isFamilyLoggedIn: false });
        }
      })
    } catch (e) {
      console.log("Error ", e);
    }

    try {
      await AsyncStorage.getItem('storename', (err, value) => {
        if (!err && value != null) {
          this.setState({ isStoreLoggedIn: true });
          this.setState({ storename: value });
          console.log("40 " + this.state.isStoreLoggedIn);
          console.log("41 " + value + " " + this.state.storename);
        } else {
          this.setState({ isStoreLoggedIn: false });
        }
      })
    } catch (e) {
      console.log("Error ", e);
    }
    console.log("65 app.js" + this.state.isFamilyLoggedIn);
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
    });
    AsyncStorage.getItem('storename').then((value) => {
      if (value) {
        this.setState({ isStoreLoggedIn: true });
        this.setState({ storename: value });
        console.log("40 " + this.state.isStoreLoggedIn);
        console.log("41 " + value + " " + this.state.storename);
      } else {
        this.setState({ isStoreLoggedIn: false });
      }
    });
  }

  componentDidMount() {

  }
  componentWillUnmount() {
  }
  saveData = async ({ navigation }) => {
    try {
      await AsyncStorage.setItem('from', 'group', (err) => {
        if (!err) {
          this.setState({ setflag1: true });
        }
      });
      console.log("102: " + this.state.setflag1);

      if (this.state.setflag1) {
        navigation.navigate('ShoppingList');
      }
    } catch (e) {
      console.log("Error ", e);
    }
  }

  HomeScreen = ({ navigation }) => {
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
              onPress={() => {
                console.log("105 " + this.state.isFamilyLoggedIn);
                if (this.state.isFamilyLoggedIn === false) {
                  this.setNewFamily({ navigation });
                } else {
                  this.saveData({ navigation });
                }
              }
              }
            >
              <Text style={styles.textGlobal}>Your List</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.padTop}>
          <View>
            <TouchableOpacity style={styles.buttonStyle}
              title="Store"
              onPress={() => {
                if (this.state.isStoreLoggedIn === false) {
                  this.setNewStore({navigation});
                } else {
                  navigation.navigate('PendingOrders');
                }
              }}
            >
              <Text style={styles.textGlobal}>Your Store</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.padTop}>
          <View>
            <TouchableOpacity style={styles.buttonStyle}
              title="Store"
              onPress={() => {
                this.clearAsyncData();
                //navigation.navigate('Home');
              }}
            >
              <Text style={styles.textGlobal}>Clear Local Cache</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  BoughtListScreen = ({ navigation }) => {
    return (
      <BoughtList navigation={navigation} />
    );
  }

  ShoppingListScreen = ({ navigation }) => {
    return (
      <ShoppingList navigation={navigation} />
    );
  }

  AddListToStoreScreen({ navigation }) {
    return (
      <AddListToStore navigation={navigation} />
    );
  }

  AddNewFamilyScreen = ({ navigation }) => {
    return (
      <AddNewFamily navigation={navigation} />
    );
  };

  AddNewStoreScreen = ({ navigation }) => {
    return (
      <AddNewStore navigation={navigation} />
    );
  }

  PendingOrdersScreen = ({ navigation }) => {
    return (
      <PendingOrders navigation={navigation} />
    );
  }

  NotifyCustomerScreen = ({ navigation }) => {
    return (
      <NotifyCustomer navigation={navigation} />
    );
  }

  /*
          {(this.state.isFamilyLoggedIn === false)
            // If not logged in, the user will be shown this route
            ? <Stack.Screen name="AddNewFamily" component={this.AddNewFamilyScreen} />
            // When logged in, the user will be shown this route
            : <Stack.Screen name="Home" component={this.HomeScreen} options={{title: this.state.familyname}}/>
          }
              */

  render = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={this.HomeScreen}
            options={{ title: this.state.groupname, headerTitleAlign: 'center' }}
          />
          <Stack.Screen
            name="AddNewFamily"
            component={this.AddNewFamilyScreen}
            options={{ title: 'Add New Group' }}
          />
          <Stack.Screen
            name="ShoppingList"
            component={this.ShoppingListScreen}

            options={{
              title: 'List : '.concat(this.state.groupname)
            }}
          />
          <Stack.Screen
            name="BoughtList"
            component={this.BoughtListScreen}
            options={{
              title: 'Bought List : '.concat(this.state.groupname)
            }}
          />
          <Stack.Screen
            name="AddNewStore"
            component={this.AddNewStoreScreen}
            options={{ title: 'Add New Store' }}
          />
          <Stack.Screen
            name="PendingOrders"
            component={this.PendingOrdersScreen}
            options={{ title: 'Pending Orders' }}
          />
          <Stack.Screen
            name="AddListToStore"
            component={this.AddListToStoreScreen}
            options={{ title: 'Available Stores' }}
          />
          <Stack.Screen
            name="NotifyCustomer"
            component={this.NotifyCustomerScreen}
            options={{ title: 'Notify Customer' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

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