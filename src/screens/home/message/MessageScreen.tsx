import React from 'react';
import styles from './MessageScreen.styles';

import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {selectChannelById} from '../../../redux/channelsSlice';

import {View} from 'react-native';
// import Text from '../../../components/Text';

import Topbar from './Topbar';
import MessageList from './MessageList';

function MessageScreen({route}: any) {
  const {channelId} = route.params;

  const channel = useSelector((state: RootState) =>
    selectChannelById(state, channelId),
  );

  return (
    <View style={styles.container}>
      <Topbar channelTitle={channel?.title} />
      <MessageList currentChannel={channel} />
    </View>
  );
}

export default MessageScreen;
// export default React.memo(
//   MessageScreen,
//   (prevProps, nextProps) =>
//     prevProps.route.params.id === nextProps.route.params.id,
// );
