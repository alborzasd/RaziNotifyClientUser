import React from 'react';
import styles from './Drawer.styles';

// import {View} from 'react-native';

import Animated from 'react-native-reanimated';

import Text from '../../../components/Text';

// import {Drawer as NativeDrawer} from 'react-native-drawer-layout';
// import {createDrawerNavigator} from '@react-navigation/drawer';

// const Drawer = createDrawerNavigator();

interface DrawerProps {
  animatedStyle: any;
}

function CustomDrawer({animatedStyle}: DrawerProps) {
  // const [open, setOpen] = React.useState(false);
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text>Drawer</Text>
    </Animated.View>
  );
}

export default CustomDrawer;
