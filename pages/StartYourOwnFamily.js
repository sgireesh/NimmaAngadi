import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";

function StartYourOwnFamily(props) {
    return (
        <View style={styles.padTop}>
            <Text style={styles.textGlobal}>Family Group Name</Text>
            <View style={styles.padTop}>
                <TextInput
                    style={styles.textGlobal}
                    placeholder="Subbammana Mane"
                />
            </View>
            <View style={styles.padTop}>
                <Text style={styles.textGlobal}>
                    Add your Family Members that you want to add to your group. If anyone else wants to join your family, they can use your code.
                </Text>
            </View>
            <View style={styles.padTop}>
                <TextInput
                    style={styles.textGlobal}
                    placeholder="4083439898"
                />
            </View>
            <View style={styles.padTop}>
                <TextInput
                    style={styles.textGlobal}
                    placeholder="4151112222"
                />
            </View>
            <View style={styles.padTop}>
                <TextInput
                    style={styles.textGlobal}
                    placeholder="4151112222"
                />
            </View>
            <View style={styles.padTop}>
                <TextInput
                    style={styles.textGlobal}
                    placeholder="4151112222"
                />
            </View>
            <View style={styles.padTop}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.buttonStyle}
                        title="List of Items"
                        onPress={() => navigation.navigate('ExistingFamilySignUp')}
                    >
                        <Text style={styles.textGlobal}>Save and Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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

export default StartYourOwnFamily;
