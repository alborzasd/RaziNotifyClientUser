import React from 'react';
import styles from './LoginForm.styles';

import {
  View,
  Pressable,
  Animated,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import Toast from 'react-native-toast-message';
import {CustomToastExtraProps} from '../../components/Toast';
// import {primaryColor} from '../../config/styles';

import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../redux/store';
import {login, AuthFetchStatus as statusEnum} from '../../redux/authSlice';

import useFadeAnimation from '../../hooks/animations/useFadeAnimation';

import Icon from 'react-native-vector-icons/Feather';

function LoginForm() {
  const dispatch = useDispatch<any>();
  const authStatus = useSelector((state: RootState) => state.auth.status);
  // error message is handled by backend
  const authError = useSelector((state: RootState) => state.auth.error);

  // error message is handled by frontend
  const [validationError, setValidationError] = React.useState<{
    username: string | null;
    password: string | null;
  }>({
    username: null,
    password: null,
  });

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {opacityValue, fadeIn, fadeOut} = useFadeAnimation();

  const canHandlePress = React.useRef(true);

  React.useEffect(() => {
    if (authStatus === statusEnum.AUTH_FAILED) {
      const extraProps: CustomToastExtraProps = {
        type: 'error',
        texts: [authError?.message, authError?.detail],
        // progressBarDuration: 2000,
        progressBarCanAnimate: true,
      };
      Toast.show({
        type: 'custom',
        // autoHide: false,
        // visibilityTime: 2000,
        props: extraProps,
      });
    }
  }, [authStatus, authError?.message, authError?.detail]);

  const handlePress = () => {
    if (canHandlePress.current) {
      // console.log(username, password);
      Keyboard.dismiss();

      if (!username || !password) {
        setValidationError({
          username: username ? null : 'نام کاربری نباید خالی باشد',
          password: password ? null : 'رمز عبور نباید خالی باشد',
        });
        return;
      }
      setValidationError({username: null, password: null});
      dispatch(login({username, password}));
    }
  };

  const handleLongPress = () => {
    canHandlePress.current = false;
  };

  const handlePressIn = () => {
    canHandlePress.current = true;
    fadeOut();
  };

  const handlePressOut = () => {
    fadeIn();
  };

  const animatedStyle = {
    opacity: opacityValue,
  };

  let buttonContent: JSX.Element;
  if (authStatus === statusEnum.SENDING_CREDENTIALS) {
    buttonContent = <ActivityIndicator size="large" color="#fff" />;
  } else {
    buttonContent = <Text style={styles.buttonText}>ورود</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>سامانه اطلاع رسانی رازی</Text>
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <View style={styles.label}>
            <Icon name="user" size={20} />
            <Text>نام کاربری</Text>
          </View>
          <TextInput
            defaultVlue={username}
            onChangeText={(newValue: string) => setUsername(newValue)}
          />
          <Text style={styles.errorText}>
            {authError?.username || validationError?.username}
          </Text>
        </View>
        <View style={styles.formGroup}>
          <View style={styles.label}>
            <Icon name="lock" size={20} />
            <Text>رمز عبور</Text>
          </View>
          <TextInput
            secureTextEntry
            defaultVlue={password}
            onChangeText={(newValue: string) => setPassword(newValue)}
          />
          <Text style={styles.errorText}>
            {authError?.password || validationError?.password}
          </Text>
        </View>
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={authStatus === statusEnum.SENDING_CREDENTIALS}
          style={styles.buttonPressable}>
          <Animated.View style={[styles.buttonAnimatedView, animatedStyle]}>
            {buttonContent}
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

export default LoginForm;
