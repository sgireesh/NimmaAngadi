import { Swipeable }  from 'react-native-gesture-handler';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
//import { GestureHandler } from 'react-native-gesture-handler';//'expo';
//const { Swipeable } = GestureHandler;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  text: {
    color: 'black',
    fontSize: 15,
    textAlign:'left'
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#e4e4e4',
    marginLeft: 10,
  },
  leftAction: {
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    flex: 1,
  },
  rightAction: {
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
  },
  actionText: {
    color: '#dff',
    fontWeight: '600',
    padding: 20,
  },
});

export const Separator = () => <View style={styles.separator} />;

const LeftActions = ({progress, dragX, textlabel}) => {
  const scale = dragX.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  return (
    <View style={styles.leftAction}>
      <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
        {textlabel}
      </Animated.Text>
    </View>
  );
};

const RightActions = ({ progress, dragX, onPress, textlabel }) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.rightAction}>
        <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
          {textlabel}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

const ListItem = ({ title, onSwipeFromLeft, onRightPress, textlabelright, textlabelleft }) => (
  <Swipeable
    //renderLeftActions={LeftActions}
    renderLeftActions={(progress, dragX) => (
      <LeftActions progress={progress} dragX={dragX} textlabel={textlabelleft} />
    )}
    onSwipeableLeftOpen={onSwipeFromLeft}
    renderRightActions={(progress, dragX) => (
      <RightActions progress={progress} dragX={dragX} onPress={onRightPress} textlabel={textlabelright} />
    )}
  >
    <View style={styles.container}>
      <Text style={styles.text}>{"                 " + title}</Text>
    </View>
  </Swipeable>
);

export default ListItem;