import React from 'react';
import styles from './MessageItem.styles';

import {View} from 'react-native';

import Text from '../../../components/Text';

import {rtlMark, ltrMark} from '../../../config/styles';

import ComputationModule from '../../../native-modules/ComputaionModule';

import {
  getPersianFormattedHour,
  isLessThan24Hour,
} from '../../../utilities/persian-date';

import Material from 'react-native-vector-icons/MaterialCommunityIcons';

export interface CustomComponentItem {
  _id: any;
  componentType: 'custom';
  component: any;
  props: any;
}

const MessateItem = React.memo(({message}: any) => {
  const messageTitle = message?.title;
  const messageRawText = message?.der_bodyRaw;

  return (
    <View style={styles.container}>
      <Text style={styles.messageTitle}>{messageTitle}</Text>
      <Text style={styles.messageBodyText}>{messageRawText}</Text>
      <View style={styles.messageInfoContainer}>
        <View style={styles.messageInfoRow}>
          <Material name="clock-time-four-outline" size={18} color={'#666'} />
          <Text style={styles.messageInfoText}>
            {/* {rtlMark} */}
            {' ارسال: '}
            <PersianDateFormatter dateISOStr={message?.createdAt} />
          </Text>
        </View>

        {message?.createdAt !== message?.updatedAt && (
          <View style={styles.messageInfoRow}>
            <Material name="circle-edit-outline" size={18} color={'#666'} />
            <Text style={styles.messageInfoText}>
              {/* {rtlMark} */}
              {' ویرایش: '}
              <PersianDateFormatter dateISOStr={message?.updatedAt} />
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

/*
 * this component is passed to FlatList renderItem prop
 * the item passed here cen be a message object
 * or an object that contains a custom component
 * and it's props
 *
 * if it's message object
 * we will render the MessageItem component with this object as prop
 * if it's costom component object
 * must contain property componentType:'custom'
 * we will render the item.component with item.props as it's props
 * the custom component object must also have an _id property
 *
 * an example for custom component:
 * - spinner when user reaches end of message list to show new messages are fetching
 */
function MessageItemWrapper({item}: CustomComponentItem | any) {
  let content;
  if (item?.componentType === 'custom') {
    const Component = item?.component;
    const props = item?.props;
    content = <Component {...props} />;
  } else {
    content = <MessateItem message={item} />;
  }
  return <>{content}</>;
}

function PersianDateFormatter({dateISOStr}: any) {
  const [formattedDate, setFormattedDate] = React.useState('...');

  // const dateISOStr = '2023-09-06T20:16:33.432Z'; // test

  React.useEffect(() => {
    // send request to native module to compute the persian date string
    const getFormattedDate = async () => {
      const paramToSend = typeof dateISOStr === 'string' ? dateISOStr : '';
      const persianFormattedDate =
        await ComputationModule.getCustomPersianDateFormat(paramToSend);

      // const result =
      //   persianFormattedDate +
      //   ' - ' +
      //   persianFormattedHour +
      let result = persianFormattedDate;
      if (!isLessThan24Hour(dateISOStr)) {
        result += ' - ' + getPersianFormattedHour(dateISOStr);
      }

      setFormattedDate(result);
      // TODO: remove log
      // console.log('dateISOStr', dateISOStr);
      // console.log('result', result);
    };

    getFormattedDate();
  }, [dateISOStr]);

  return <>{formattedDate}</>;
}

export default MessageItemWrapper;
