import React from 'react';
import styles from './Topbar.styles';

import {View} from 'react-native';

import Text from '../../../components/Text';

type TopbarProps = {
  channelTitle: string;
};

function Topbar({channelTitle}: TopbarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {channelTitle}
        </Text>
      </View>
    </View>
  );
}

export default Topbar;
