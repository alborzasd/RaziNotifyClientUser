import React from 'react';
import styles from './Topbar.styles';

import {topbarButtonSize} from '../../../config/styles';

import {ActivityIndicator} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';

import {
  syncData,
  selectDataManagerStatus,
  DataManagerStatus,
} from '../../../redux/dataManagerSlice';

import Animated from 'react-native-reanimated';
import useTopbarAnimation from './useTopbarAnimation';

import ScrollingContainer from '../../../components/ScrollingContainer';
import Text from '../../../components/Text';
import HighlightButton from '../../../components/HighlightButton';

import Feather from 'react-native-vector-icons/Feather';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

interface TopbarProps {
  handleMenuButton: any;
}

function Topbar({handleMenuButton}: TopbarProps) {
  const dispatch = useDispatch<any>();

  const dataManagerStatus = useSelector(selectDataManagerStatus);

  const title =
    dataManagerStatus === DataManagerStatus.SYNCING_DATA
      ? 'در حال به روز رسانی...'
      : 'سامانه اطلاع رسانی رازی';

  const {topbarAnimatedStyle, runAnimation} = useTopbarAnimation();

  React.useEffect(() => {
    runAnimation();
  }, [runAnimation]);

  const handleMenu = () => {
    handleMenuButton();
  };
  const handleRefresh = () => {
    dispatch(syncData());
  };

  let refreshElement: JSX.Element;
  let refreshButtonDisabled;
  let containerStyle = {};
  if (dataManagerStatus === DataManagerStatus.SYNCING_DATA) {
    refreshElement = <ActivityIndicator size={28} color="#fff" />;
    refreshButtonDisabled = true;
    containerStyle = {padding: 0};
  } else {
    refreshElement = (
      <Material name="cloud-refresh" size={topbarButtonSize} color={'#fff'} />
    );
    refreshButtonDisabled = false;
  }

  return (
    <Animated.View style={[styles.container, topbarAnimatedStyle]}>
      <HighlightButton
        onPress={handleMenu}
        containerStyle={styles.highlightButtonContainer}>
        <Feather name="menu" size={topbarButtonSize} color={'#fff'} />
      </HighlightButton>
      <ScrollingContainer
        dependency={title}
        containerHeight={40}
        containerStyle={styles.titleContainer}
        childContainerStyle={styles.titleChildContainer}>
        <Text style={styles.title}>{title}</Text>
      </ScrollingContainer>
      <HighlightButton
        onPress={handleRefresh}
        disabled={refreshButtonDisabled}
        containerStyle={[styles.highlightButtonContainer, containerStyle]}>
        {refreshElement}
      </HighlightButton>
    </Animated.View>
  );
}

export default Topbar;
