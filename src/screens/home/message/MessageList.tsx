import React from 'react';
import styles from './MessageList.styles';

import {View} from 'react-native';
import Text from '../../../components/Text';

function MessageList() {
  return (
    <View style={styles.container}>
      <Text>no message</Text>
    </View>
  );
}

export default MessageList;
