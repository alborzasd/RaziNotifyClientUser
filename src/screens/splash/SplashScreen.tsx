import React from 'react';
import styles from './SplashScreen.styles';

import {useSelector} from 'react-redux';

import {
  selectDataManagerStatus,
  selectDataManagerError,
  DataManagerStatus,
} from '../../redux/dataManagerSlice';

import {View, ActivityIndicator} from 'react-native';
import {primaryColor} from '../../config/styles';
import Text from '../../components/Text';

function SplashScreen() {
  const dataManagerStatus = useSelector(selectDataManagerStatus);
  const dataManagerError = useSelector(selectDataManagerError);

  let content: JSX.Element = <></>;
  if (
    dataManagerStatus === DataManagerStatus.INIT ||
    dataManagerStatus === DataManagerStatus.GET_STORED_DATA
  ) {
    content = <ActivityIndicator size="large" color={primaryColor} />;
  } else if (dataManagerStatus === DataManagerStatus.GET_STORED_DATA_FAILED) {
    content = (
      <>
        <Text style={[styles.text, styles.danger]}>
          {dataManagerError?.message}
        </Text>
        <Text style={styles.text}>{dataManagerError?.detail}</Text>
      </>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

export default SplashScreen;
