import React from 'react';
import styles from './Topbar.styles';

import {useNavigation} from '@react-navigation/native';

import {View} from 'react-native';

import Text from '../../../components/Text';
import HighlightButton from '../../../components/HighlightButton';

import {topbarButtonSize} from '../../../config/styles';

import AntDesign from 'react-native-vector-icons/AntDesign';

type TopbarProps = {
  channelTitle: string;
};

function Topbar({channelTitle}: TopbarProps) {
  const navigation = useNavigation<any>();

  const handleNavigateBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <HighlightButton
        onPress={handleNavigateBack}
        containerStyle={styles.highlightButtonContainer}>
        <AntDesign
          name="arrowright"
          size={topbarButtonSize - 2}
          color={'#fff'}
        />
      </HighlightButton>

      <View style={styles.titleContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {channelTitle}
        </Text>
      </View>

      {/* placing an empty square, so channel title can be centered */}
      <HighlightButton
        onPress={() => null}
        containerStyle={styles.highlightButtonContainer}
        disabled={true}
      />
    </View>
  );
}

export default Topbar;
