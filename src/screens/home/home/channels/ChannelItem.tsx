import React from 'react';
import styles from './ChannelItem.styles';

import {useNavigation} from '@react-navigation/native';

import {customFormat} from '../../../../utilities/persian-date';

import {View, Pressable} from 'react-native';
import Animated from 'react-native-reanimated';

import Text from '../../../../components/Text';

import {useSelector} from 'react-redux';

import {selectChannelById} from '../../../../redux/channelsSlice';
import {RootState} from '../../../../redux/store';

import Image from '../../../../components/Image';
// import {Image} from 'react-native';

import useChannelItemAnimation from './useChannelItemAnimation';

function ChannelItem({id}: any) {
  const navigation = useNavigation<any>();

  const channel = useSelector((state: RootState) =>
    selectChannelById(state, id),
  );

  const lastMessageDateTime = customFormat(new Date());
  const newMessagesCount = 2;

  // console.log('render', channel.identifier);

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
    navigation.navigate('Message', {id});
  };

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
                {channel.title}
              </Text>
            </View>
            <View style={styles.messageContainer}>
              <Text
                style={styles.message}
                numberOfLines={1}
                ellipsizeMode="tail">
                به اطلاع دانشجویان گرامی میرساند به اطلاع دانشجویان گرامی
                میرساند
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
}

export default ChannelItem;
