import React from 'react';
import styles from './ChannelList.styles';

import {FlatList} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {selectChannelIdsAsObject} from '../../../../redux/channelsSlice';

import {
  selectDataManagerStatus,
  selectDataManagerError,
  DataManagerStatus,
} from '../../../../redux/dataManagerSlice';

import {View} from 'react-native';
import Text from '../../../../components/Text';

import Toast from 'react-native-toast-message';
import {CustomToastExtraProps} from '../../../../components/Toast';
import ChannelItem from './ChannelItem';

import {channelItemHeight} from '../../../../config/styles';

const getItemLayout = (_: any, index: any) => ({
  length: channelItemHeight, // Height of each item
  offset: channelItemHeight * index, // Offset based on the index and item height
  index,
});

// when this component renders, we know that fetching data from local storage was successfull
// if it's null (_NULL): it's the first time that the app is opened
// if it's empty array (_SUCCESS):
//  the sync with server has been done at least one time
//  (last time the app opened)
function ChannelList() {
  // const channelIds = useSelector(selectChannelIds);
  // const channelIdsObject = channelIds.map(id => ({id}));
  const channelIdsObject = useSelector(selectChannelIdsAsObject);

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

  // if we directly assign the flat list to ref.current below
  // for some reasons the whole list will rerender even if fetched data after sync is same
  // possible reasons:
  // - assign new flat list to ref.current when sync state changes (implemented React.useMemo)
  // - channelIdsObject changing on each render (so flat list treats them as new data)
  // -  because array map returns new reference every time (implemented memoized selector)
  const channelsFlatList = React.useMemo(
    () => (
      <FlatList
        style={styles.listContainer}
        data={channelIdsObject}
        renderItem={({item}) => <ChannelItem id={item.id} />}
        keyExtractor={item => item.id.toString()}
        getItemLayout={getItemLayout}
      />
    ),
    [channelIdsObject],
  );

  // use ref to keep old data when sync with server is in progress or failed
  // if we don't use useRef, new channel data will be shown
  // before the sync state becomes suucess
  // becuase of the useSelector(selectChannelIds)
  let content = React.useRef<JSX.Element | null>(null);
  if (
    dataManagerStatus === DataManagerStatus.GET_STORED_DATA_SUCCESS ||
    dataManagerStatus === DataManagerStatus.SYNCING_DATA_SUCCESS
  ) {
    if (channelIdsObject.length === 0) {
      content.current = <Text>شما عضو هیچ کانالی نیستید</Text>;
    } else {
      content.current = channelsFlatList;
    }
  }
  return <View style={styles.container}>{content.current}</View>;
}

export default ChannelList;
