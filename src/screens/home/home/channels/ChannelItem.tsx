import React from 'react';
import styles from './ChannelItem.styles';

import {useNavigation} from '@react-navigation/native';

import {customFormat} from '../../../../utilities/persian-date';

import {View, Pressable} from 'react-native';
import Animated from 'react-native-reanimated';

import Text from '../../../../components/Text';

import {useSelector} from 'react-redux';

import {selectChannelById} from '../../../../redux/channelsSlice';
import {selectLastMessageByChannelId} from '../../../../redux/messagesSlice';
import {RootState} from '../../../../redux/store';

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
  const lastMessage = {
    bodyRawPreview: 'test message',
    createdAt: new Date(),
  };

  // TODO: remove log
  // console.log(channel?.identifier, channel?.title);
  // console.log('lastMessage', lastMessage?.bodyRawPreview);

  const lastMessageDateTime = customFormat(new Date(lastMessage?.createdAt));
  const newMessagesCount = 2;

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

  // return <View style={styles.container}></View>;

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
                {rtlMark + lastMessage?.bodyRawPreview}
              </Text>
            </View>
          </View>
          <View style={styles.colInfo}>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{lastMessageDateTime}</Text>
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

export default ChannelItemWrapper;
