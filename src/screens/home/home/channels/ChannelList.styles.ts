import {StyleSheet, Dimensions} from 'react-native';

import {topBarHeight} from '../../../../config/styles';
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    // borderWidth: 2,
    // borderColor: 'blue',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    height: '100%',

    // borderWidth: 2,
    // borderColor: 'red',
  },
  listEmptyContainer: {
    // for some fu** reason flex 1 not working
    flex: 1,
    // height: '100%',
    height: windowHeight - topBarHeight - 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

    // borderColor: 'red',
    // borderWidth: 1,
  },
});

export default styles;
