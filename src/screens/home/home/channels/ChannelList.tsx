import React from 'react';
import styles from './ChannelList.styles';

// import {FlatList} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import {useDispatch, useSelector} from 'react-redux';

import {
  selectAllChannels,
  selectSortedChannels,
  selectChannelIdsAsObject,
  selectChannelsCount,
} from '../../../../redux/channelsSlice';

import {
  selectDataManagerStatus,
  selectDataManagerError,
  DataManagerStatus,
} from '../../../../redux/dataManagerSlice';

import {View} from 'react-native';
import Text from '../../../../components/Text';

import Toast from 'react-native-toast-message';
import {CustomToastExtraProps} from '../../../../components/Toast';
import ChannelItemWrapper from './ChannelItem';

import {channelItemHeight} from '../../../../config/styles';

// const getItemLayout = (_: any, index: any) => ({
//   length: channelItemHeight, // Height of each item
//   offset: channelItemHeight * index, // Offset based on the index and item height
//   index,
// });

const keyExtractor = (item: any) => item?._id;

const FlshListWrapper = React.memo(() => {
  const channels = useSelector(selectSortedChannels);

  return (
    <View style={styles.listContainer}>
      <FlashList
        // style={styles.listContainer}
        data={channels}
        // renderItem={({item}) => <ChannelItem id={item?.id} />}
        renderItem={ChannelItemWrapper}
        keyExtractor={keyExtractor}
        // getItemLayout={getItemLayout}
        estimatedItemSize={channelItemHeight}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
});

function ListEmptyComponent() {
  const channelsLength = useSelector(selectChannelsCount);
  const dataManagerStatus = useSelector(selectDataManagerStatus);

  let content;
  if (
    (dataManagerStatus === DataManagerStatus.GET_STORED_DATA_SUCCESS ||
      dataManagerStatus === DataManagerStatus.SYNCING_DATA_SUCCESS) &&
    channelsLength === 0
  ) {
    content = (
      <View style={styles.listEmptyContainer}>
        <Text>در حال حاضر عضو هیچ کانالی نیستید</Text>
      </View>
    );
  }

  return <>{content}</>;
}

// when this component renders, we know that fetching data from local storage was successfull
// if it's null (_NULL): it's the first time that the app is opened
// if it's empty array (_SUCCESS):
//  the sync with server has been done at least one time
//  (last time the app opened)
function ChannelList() {
  // const channelIdsObject = useSelector(selectChannelIdsAsObject);
  // const channels = useSelector(selectAllChannels);

  const dataManagerStatus = useSelector(selectDataManagerStatus);
  const dataManagerError = useSelector(selectDataManagerError);

  React.useEffect(() => {
    if (dataManagerStatus === DataManagerStatus.SYNCING_DATA_FAILED) {
      const extraProps: CustomToastExtraProps = {
        type: 'error',
        texts: [dataManagerError?.message, ...dataManagerError?.details],
        // progressBarDuration: 5000,
        progressBarCanAnimate: true,
      };
      Toast.show({
        type: 'custom',
        topOffset: 60,
        // visibilityTime: 5000,
        props: extraProps,
      });
    }
  }, [dataManagerError?.details, dataManagerError?.message, dataManagerStatus]);

  return (
    <View style={styles.container}>
      <FlshListWrapper />
    </View>
  );
}

export default ChannelList;
