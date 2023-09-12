import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 16,
    // paddingHorizontal: 16,

    // borderWidth: 2,
    // borderColor: 'blue',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    // paddingVertical: 16,
    // paddingHorizontal: 16,

    // borderWidth: 2,
    // borderColor: 'red',
  },
  listContentContainer: {
    // paddingVertical: 16,
    paddingHorizontal: 16,
  },

  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,

    // height: 60,
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 10,

    // borderWidth: 1,
    // borderColor: 'red',
  },

  fetchMessageBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    borderRadius: 10,
    backgroundColor: 'rgba(20, 20, 20, 0.4)',
    padding: 8,

    // borderWidth: 1,
    borderColor: 'red',
  },
  fetchMessageBtnText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default styles;
