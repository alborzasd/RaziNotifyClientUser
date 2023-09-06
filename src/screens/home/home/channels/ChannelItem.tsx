import React from 'react';
import styles from './ChannelItem.styles';

import {useNavigation} from '@react-navigation/native';

// import {customFormat} from '../../../../utilities/persian-date';

import {View, Pressable} from 'react-native';
import Animated from 'react-native-reanimated';

import ComputationModule from '../../../../native-modules/ComputaionModule';

import Text from '../../../../components/Text';

// import {useSelector} from 'react-redux';

// import {selectChannelById} from '../../../../redux/channelsSlice';
// import {selectLastMessageByChannelId} from '../../../../redux/messagesSlice';
// import {RootState} from '../../../../redux/store';

import Image from '../../../../components/Image';
// import {Image} from 'react-native';

import {rtlMark} from '../../../../config/styles';

import useChannelItemAnimation from './useChannelItemAnimation';

// type ChannelObject = {
//   id: any;
// };
// type ChannelItemWrapperProp = {
//   item: ChannelObject;
// };

const ChannelItem = React.memo(({channel}: any) => {
  const navigation = useNavigation<any>();

  // const channel = useSelector((state: RootState) =>
  //   selectChannelById(state, id),
  // );
  // const lastMessage = useSelector((state: RootState) =>
  //   selectLastMessageByChannelId(state, channel?._id),
  // );
  const lastMessage = channel?.der_lastMessage;

  // TODO: remove log
  // console.log(channel?.identifier, channel?.title);
  // console.log('lastMessage', lastMessage?.updatedAt);

  // const lastMessageDateTime = customFormat(new Date(lastMessage?.createdAt));
  const newMessagesCount = channel?.der_numUnreadMessages || 0;

  // if channel has no profile image, set fallback image without waiting for server error
  const fallbackRequireUri = require('../../../../assets/images/channel-logo.png');
  const imageSource = channel?.profile_image_url
    ? {uri: channel?.profile_image_url}
    : fallbackRequireUri;

  const {channelItemAnimatedStyle, backgroundFadeIn, backgroundFadeOut} =
    useChannelItemAnimation();
  const handlePressIn = () => {
    backgroundFadeIn();
  };
  const handlePressOut = () => {
    backgroundFadeOut();
  };

  const handlePress = () => {
    navigation.navigate('Message', {id: channel?._id});
  };

  const lastMessagePreview = lastMessage?.bodyRawPreview || 'پیامی وجود ندارد';

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View style={[styles.container, channelItemAnimatedStyle]}>
        <View style={styles.colImage}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={imageSource}
              fallbackRequireUri={fallbackRequireUri}
            />
          </View>
        </View>
        <View style={styles.colTextInfoContainer}>
          <View style={styles.colText}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {rtlMark + (channel?.title || 'undefined')}
              </Text>
            </View>
            <View style={styles.messageContainer}>
              <Text
                style={styles.message}
                numberOfLines={1}
                ellipsizeMode="tail">
                {rtlMark + lastMessagePreview}
              </Text>
            </View>
          </View>
          <View style={styles.colInfo}>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>
                <PersianDate dateISOStr={lastMessage?.createdAt} />
              </Text>
            </View>
            <View style={styles.counterContainer}>
              {newMessagesCount >= 1 && (
                <View style={styles.counterSubContainer}>
                  <Text style={styles.counter}>
                    {newMessagesCount.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
});

// this component is passed to FlatList renderItem prop
function ChannelItemWrapper({item: channel}: any) {
  return (
    <>
      <ChannelItem channel={channel} />
    </>
  );
}

function PersianDate({dateISOStr}: any) {
  const [formattedDate, setFormattedDate] = React.useState('...');

  React.useEffect(() => {
    // send request to native module to compute the persian date string
    const getFormattedDate = async () => {
      const paramToSend = typeof dateISOStr === 'string' ? dateISOStr : '';
      const result = await ComputationModule.getCustomPersianDateFormat(
        paramToSend,
      );
      setFormattedDate(result);
      // TODO: remove log
      // console.log('dateISOStr', dateISOStr);
      // console.log('result', result);
    };

    getFormattedDate();
  }, [dateISOStr]);

  return <>{formattedDate}</>;
}

export default ChannelItemWrapper;

// async function testDate() {
//   const testDates = [
//     new Date('2023-09-02T11:30:00').toISOString(),
//     new Date('2023-09-01T11:30:00').toISOString(),
//     new Date('2023-08-31T11:30:00').toISOString(),
//   ];

//   for (let date of testDates) {
//     console.log('iso date str --> ', date);
//     const result = await ComputationModule.getCustomPersianDateFormat(date);
//     console.log(result);
//     console.log('');
//     console.log('');
//   }
// }
// testDate();
