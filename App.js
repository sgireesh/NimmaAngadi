import * as React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, AsyncStorage, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartYourOwnFamily from './pages/StartYourOwnFamily';
import ExistingFamilySignUp from './pages/ExistingFamilySignUp';
import AddFamilyModal from './pages/AddFamilyModal';
import ToDoList from './pages/ToDoList';

var state = {
  familyname:"",
};

function HomeScreen({ navigation }) {
  return (
    <View style={styles.padTop}>
      <View style={styles.padTop}>
        <Text style={styles.textGlobal}>Welcome to your very own online shopping list! </Text>
      </View>
      <View style={styles.padTop}>
        <Text style={styles.textGlobal}> Here is how you get started. </Text>
      </View>
      <View style={styles.padTop}>
        <View>
          <TouchableOpacity
            style={styles.buttonStyle}
            title="Start your own Group"
            onPress={() => navigation.navigate('StartYourOwnFamily')}
          >
            <Text style={styles.textGlobal}>Start your own Group</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.padTop}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.buttonStyle}
            title="Go To Existing Family"
            onPress={() => navigation.navigate('ExistingFamilySignUp')}
          >
            <Text style={styles.textGlobal}>Go To Existing Family</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.padTop}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.buttonStyle}
            title="Shopping List"
            onPress={() => navigation.navigate('ShopList')}
          >
            <Text style={styles.textGlobal}>Shopping List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


function ToDoListScreen({ navigation }) {
       return (
         <ToDoList />
      );
}  

function ShopListScreen({ navigation }) {
//  AsyncStorage.getAllKeys()
//    .then(keys => AsyncStorage.multiRemove(keys))
//    .then(() => alert('success'));


    var familyname=null;
    AsyncStorage.getItem("familyname").then((value) => {
      alert(value);
      familyname = value;
    });

     alert(familyname);

    if(familyname) {
      return (
        <ToDoList />
      );
    } else {
      return (
        <View style={styles.padTop}>
            <Text style={styles.textGlobal}>Family Name</Text>
            <View style={styles.padTop}>
            <TextInput
                    style={styles.TI}
                    placeholder="SubbammanaMane"
                    onChangeText={(fn) => state.familyname=fn}
                />
            </View>
            <View style={styles.padTop}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.buttonStyle}
                        title="List of Items"
                        //onPress={() => navigation.navigate('ToDoList')}

                        onPress={() =>   {
                          alert(state.familyname);
                          AsyncStorage.setItem('familyname', state.familyname);
                          navigation.navigate('ToDoList');
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

saveFamily = ({navigation}) => {
  if(state.familyname == null || state.familyname == ""){
      return null;
  }
  alert(state.familyname);
  AsyncStorage.setItem('familyname', state.familyname);
  navigation.navigate('ToDoList');
}

function ExistingFamilySignUpScreen({ navigation }) {
  return (
    <ExistingFamilySignUp />
  );
}

function StartYourOwnFamilyScreen({ navigation }) {
  return (
    <StartYourOwnFamily />
  );
}

function AddFamilyModalScreen({ navigation }) {
  return (
    <AddFamilyModal />
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Nimma Angadi', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="ExistingFamilySignUp"
          component={ExistingFamilySignUpScreen}
          options={{ title: 'ExistingFamilySignUp' }}
        />
        <Stack.Screen
          name="StartYourOwnFamily"
          component={StartYourOwnFamilyScreen}
          options={{ title: 'StartYourOwnFamily' }}
        />
        <Stack.Screen
          name="AddFamilyModal"
          component={AddFamilyModalScreen}
          options={{ title: 'AddFamilyModal' }}
        />
        <Stack.Screen
          name="ToDoList"
          component={ToDoListScreen}
          options={{ title: 'Shopping List' }}
        />
        <Stack.Screen
          name="ShopList"
          component={ShopListScreen}
          options={{ title: 'Shopping List' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
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