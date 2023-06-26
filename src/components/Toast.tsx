import React from 'react';

import {Animated, View, StyleSheet} from 'react-native';
import Text from '../components/Text';
import Tst from 'react-native-toast-message';

import {
  successColor,
  secondaryColor,
  dangerColor,
  borderRadius,
  toastDuration,
} from '../config/styles';

export interface CustomToastExtraProps {
  type: 'success' | 'error' | 'info';
  progressBarDuration?: number;
  texts: string[];
  progressBarCanAnimate: Boolean;
}

const colorByType = {
  success: successColor,
  error: dangerColor,
  info: secondaryColor,
};

function CustomToast(props: any) {
  const extraProps: CustomToastExtraProps = props?.props;

  const translateXValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (props.isVisible) {
      // prevent rest progress bar when the toast is going to hide
      // only reset when toast is showing
      // remove the if block to see effect
      translateXValue.setValue(0);
    }
    if (extraProps?.progressBarCanAnimate) {
      Animated.timing(translateXValue, {
        toValue: -340,
        duration: extraProps?.progressBarDuration || toastDuration,
        useNativeDriver: true,
      }).start();
    }
  });

  const animatedStyles = {
    transform: [{translateX: translateXValue}],
  };

  const toastColor = colorByType[extraProps?.type] || successColor;

  const renderedTexts = extraProps?.texts?.map(
    (text: string, index: number) => {
      if (index === 0) {
        return (
          <Text style={[styles.primaryText, {color: toastColor}]} key={index}>
            {text}
          </Text>
        );
      } else {
        return (
          <Text style={styles.secondaryText} key={index}>
            {text}
          </Text>
        );
      }
    },
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>{renderedTexts}</View>
      <Animated.View
        style={[
          styles.progressbar,
          {backgroundColor: toastColor},
          animatedStyles,
        ]}
      />
    </View>
  );
}

const toastConfig = {
  custom: CustomToast,
};

function Toast() {
  return <Tst config={toastConfig} visibilityTime={toastDuration} />;
}

export default Toast;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    borderColor: '#efefef',
    borderWidth: 1,
    borderRadius: borderRadius,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
  },
  contentContainer: {
    padding: 10,
  },
  primaryText: {
    fontSize: 12,
  },
  secondaryText: {
    fontSize: 12,
    color: '#999',
  },
  progressbar: {
    height: 5,
    backgroundColor: dangerColor,
  },
});
