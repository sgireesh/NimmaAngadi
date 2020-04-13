import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage, TextInput, BackHandler, Button, Platform } from 'react-native';
import * as SMS from 'expo-sms';
import * as firebase from 'firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
//import DateTimePickerModal from "react-native-modal-datetime-picker";

import moment from 'moment';
import colorScheme from 'react-native-appearance';

class NotifyCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupname: '',
            groupphone: '',
            evalnow: false,
            setflag1: false,
            setflag2: false,
            date: new Date(),
            mode: 'date',
            show: false,
            totalcost: '',
            picktimetime: moment(new Date()).format('MM-DD-YYYY hh:mm:ss A'),
        };
        this.getAsyncData();
        this.backButtonClick = this.backButtonClick.bind(this);
    }

    getGroupInfo = () => {
        //get group info
        var gname = this.state.groupname;
        console.log("35: " + gname);
        var ref = firebase.database().ref("groups/" + gname + "/groupphone");
        ref.once('value', (snapshot) => {
            console.log("245: " + snapshot.val());
            this.setState({ groupphone: snapshot.val() });
        });
    }

    /*

    getAsyncData = async () => {
        try {
            await AsyncStorage.getItem('groupname', groupname, (err) => {
                if (!err) {
                    console.log("44: " + groupname);
                    this.setState({ "groupname": groupname });
                    this.setState({ setflag1: true });
                }
            });
        } catch (e) {
            console.log("Error ", e);
        }
    }

*/



    getAsyncData() {
        AsyncStorage.getItem("groupname").then((value) => {
            console.log("notify customer: 30: groupname: " + value);
            this.setState({ "groupname": value });
        }).then(res => { this.getGroupInfo() });
    }


    notifyCustomer = async () => {
        try {
            var groupname = this.state.groupname;
            groupname = groupname.replace(/\s+/g, '').toLowerCase();
            await AsyncStorage.setItem('groupname', groupname, (err) => {
                if (!err) {
                    this.setState({ setflag1: true });
                }
            });

            await AsyncStorage.setItem('from', 'group', (err) => {
                if (!err) {
                    this.setState({ setflag2: true });
                }
            });
            console.log("45: " + this.state.setflag1);
            console.log("46: " + this.state.setflag2);

            if (this.state.setflag1 && this.state.setflag2) {
                var msg = "Your Order is ready. Pickup Time: " + this.state.pickuptime + " Price: " + this.state.totalcost;
                this.sendSMS('4086053070', msg);
                this.props.navigation.navigate('PendingOrders');
            }
        } catch (e) {
            console.log("Error ", e);
        }
    }

    backButtonClick() {
        //        console.log("62: backbuttonclicked");
        //        this.props.navigation.navigate('Home');
        //        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
    }
    // Function to send message
    sendSMS = (number, message) => {
        console.log('sendSMS' + number + " " + message);
        const isAvailable = SMS.isAvailableAsync().then
            (
                result = () => SMS.sendSMSAsync(
                    [number],
                    message
                ).then(console.log("sms done")));
    }

    onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;

        this.setState({ show: (Platform.OS === 'ios') });
        console.log("122: " + this.state.show);
        this.setState({ date: currentDate });
        var ptime = moment(currentDate).format('MM-DD-YYYY hh:mm:ss A');
        console.log("113: ", ptime);
        this.setState({ pickuptime: ptime });
    };

    showMode = (currentMode) => {
        this.setState({ show: true });
        this.setState({ mode: currentMode });
    };

    showDatepicker = () => {
        this.showMode('date');
    };

    showTimepicker = () => {
        this.showMode('time');
    };

    render() {
        return (
            <View>
                <View>
                    <Text style={styles.textGlobal}>Select pickup  </Text>
                </View>
                <View>
                    <Text style={styles.textGlobal}>Customer : {this.state.groupname} </Text>
                </View>
                <View>
                    <Text style={styles.textGlobal}>phone : {this.state.groupphone} </Text>
                </View>
                <View style={styles.padTop}>

                    <View>
                        <Button onPress={() => this.showDatepicker()} title="date" />
                    </View>
                    <View>
                        <Button onPress={() => this.showTimepicker()} title="time" />
                    </View>
                    <View>
                        {this.state.show && (
                            <DateTimePicker
                                    isVisible={this.state.show}

                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={this.state.date}
                                mode={this.state.mode}
                                is24Hour={false}
                                //display="default"
                                onChange={(event, selectedDate) => this.onDateChange(event, selectedDate)}
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: colorScheme === "dark" ? "#222" : "white"
                                    }
                                }}
                            />
                        )}
                    </View>
                </View>
                <View >
                    <View >
                        <Text style={styles.textGlobal}>Total Cost(including taxes+delivery)         </Text>
                    </View>
                    <View >
                        <TextInput
                            style={styles.TI}
                            placeholder="$56.75"
                            keyboardType={'numeric'}
                            onChangeText={(fn) => this.setState({ totalcost: fn })}
                        />
                    </View>
                </View>

                <View >
                    <View >
                        <Text style={styles.textGlobal}>Summary : </Text>
                    </View>
                    <View >
                        <Text style={styles.textGlobal}>Time : {this.state.pickuptime} </Text>
                    </View>
                    <View >
                        <Text style={styles.textGlobal}>Cost : {this.state.totalcost}</Text>
                    </View>
                </View>
                <View >
                    <TouchableOpacity style={styles.buttonStyle}
                        title="List of Items"
                        onPress={() => {
                            //this.sendSMS();
                            console.log("140: send message pressed");
                            this.notifyCustomer();
                        }}
                    >
                        <Text style={styles.textGlobal}>   Send Message   </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    TI: {
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 20
    },
    padTopFlex: {
        flex: 1,
        padding: 15,
        flexDirection: "row",
    },
    padTop: {
        padding: 15,
        flexDirection: "row",
    },
    textGlobal: {
        fontWeight: 'bold',
        fontSize: 20
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

export default NotifyCustomer;