import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage, TextInput} from 'react-native';
import ToDoList from './ToDoList';

class AddNewFamily extends Component {
    constructor(props){
      super(props);
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

    render () {
      return (
        <View style={styles.padTop}>
          <View style={styles.padTop}>
            <Text style={styles.textGlobal}>New Family. Enter your Primary Mobile Number</Text>
          </View>
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
                        onPress={ () =>  {
                            AsyncStorage.setItem('familyname', this.state.familyname).then 
                              (
                                this.props.navigation.navigate('ToDoList')
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

     

    ShopListScreen = () => {
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
                            onPress={() =>   {
                              console.log("114:  setitem " +this.state.fname);
                              AsyncStorage.setItem('familyname', this.state.fname).then 
                              (
                                this.props.navigation.navigate('ToDoList')
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
/*
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
              name="ExistingFamilySignUp"
              component={this.ExistingFamilySignUpScreen}
              options={{ title: 'ExistingFamilySignUp' }}
            />
            <Stack.Screen
              name="StartYourOwnFamily"
              component={this.StartYourOwnFamilyScreen}
              options={{ title: 'StartYourOwnFamily' }}
            />
            <Stack.Screen
              name="AddFamilyModal"
              component={this.AddFamilyModalScreen}
              options={{ title: 'AddFamilyModal' }}
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
    */
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

export default AddNewFamily;