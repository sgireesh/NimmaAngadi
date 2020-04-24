import { Swipeable } from 'react-native-gesture-handler';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#d47024',

    //    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  text: {
    color: '#ffffff',
    fontSize: 25,
    textAlign: 'left'
  },
  textactive: {
    color: 'green',
    fontSize: 25,
    textAlign: 'left'
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

const LeftActions = ({ progress, dragX, textlabel }) => {
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

const ListItem = ({ pagename, title, onSwipeFromLeft, onRightPress, onTitlePress, textlabelright, textlabelleft }) => (
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
      <MCIcon style={styles.MCIcon} name="gesture-swipe-horizontal" size={35} color="#d47024" />
      <TouchableOpacity
        onPress={onTitlePress}
      >
          <Text style={styles.text}>{"  " + title}</Text>
      </TouchableOpacity>
    </View>
  </Swipeable>
);

export default ListItem;