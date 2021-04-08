import React, { Component } from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";

function ExistingFamilySignUp(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.loremIpsum}>
                You will recieve a text/ email on your code to join your family. If
                anyone else wants to join your family, they can use your code.
          </Text>
            <Text style={styles.yourNumberOrEmail}>Enter Your Code Here</Text>
            <TextInput
                style={styles.TI}
                placeholder="235454"
            />
            <Button title="Validate" style={styles.Button} />
        </View>
    );
}

const styles = StyleSheet.create({
    TI: {
        padding: 10,
        borderColor: 'black',
        borderWidth: 1
    },
    container: {
        flex: 1,
        backgroundColor: "rgba(15,15, 15,0)"
    },
    yourNumberOrEmail: {
        padding: 35,
        color: "rgba(26,25,25,1)",
        fontSize: 20,
        textAlign: "center",
        alignSelf: "center"
    },
    loremIpsum: {
        padding: 15,
        color: "rgba(26,25,25,1)",
        fontSize: 20,
        textAlign: "center",
        alignSelf: "center"
    },
    nameOfYourFamily: {
        padding: 10,
        color: "rgba(0,0,0,1)",
        fontSize: 20,
        marginLeft: 23
    }
});

export default ExistingFamilySignUp;
