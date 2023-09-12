import React, {useCallback} from 'react';
import styles from './MessageList.styles';

import type {CustomComponentItem} from './MessageItem';

import {useSelector, useDispatch} from 'react-redux';

import {syncData} from '../../../redux/dataManagerSlice';

import {
  selectMessagesByChannelId,
  fetchMessagesOfChannel,
  selectMessagesFetchStatus,
  MessagesFetchStatus,
  resetMessagesToNewData,
  syncLastMessageVisited,
} from '../../../redux/messagesSlice';

import {View, ActivityIndicator, Pressable} from 'react-native';

import Text from '../../../components/Text';
import {FlashList} from '@shopify/flash-list';
import MessateItemWrapper from './MessageItem';

import {messageItemMinHeight, primaryColor} from '../../../config/styles';
import {getPersianDateFormat} from '../../../utilities/persian-date';

interface MessageListProps {
  currentChannel: any;
}

enum FetchStatus {
  INIT = 'INIT',
  FETCHING = 'FETCHING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

const keyExtractor = (item: any) => item?._id;

/*
 * configuration to determining if a message is seen or not
 */
const viewabilityConfig = {
  // minimumViewTime: number,
  //
  // if 100%, the full height of item must be visible to mark it as 'viewable'
  // itemVisiblePercentThreshold: 100,
  //
  // if 100%, the full height must be visible, or a long item spans the whole list container
  // viewAreaCoveragePercentThreshold: 100,
  //
  // waitForInteraction: boolean,
};

const FlashListWrapperComponent = (
  {listItems, onViewableItemsChanged}: any,
  flashListRef: any,
) => {
  // const flashListRef = React.useRef<any>(null);
  const initialScrollDone = React.useRef<boolean>(false);

  /*
   * if items has at least one message item (not custom component items)
   * we want to scroll to the first message item
   * when user opens message screen
   * the first message will not be marked as 'visible'
   *  (flash list internal functionality)
   * but if we scroll down
   * the first custom compoent marked as 'non visible'
   * so onViewItemsChanged will be called
   */
  React.useEffect(() => {
    if (initialScrollDone?.current === true) {
      return;
    }
    if (!flashListRef?.current) {
      return;
    }
    // if list item has at least 1 message item
    if (listItems.some((item: any) => !(item?.componentType === 'custom'))) {
      flashListRef?.current?.scrollToIndex({index: 1, animated: true});
      initialScrollDone.current = true;
    }
  }, [flashListRef, listItems]);

  return (
    <FlashList
      ref={flashListRef}
      data={listItems}
      renderItem={MessateItemWrapper}
      keyExtractor={keyExtractor}
      estimatedItemSize={messageItemMinHeight}
      contentContainerStyle={styles.listContentContainer}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  );
};

const FlashListWrapper = React.memo(
  React.forwardRef(FlashListWrapperComponent),
);

function MessageList({currentChannel}: MessageListProps) {
  const dispatch = useDispatch<any>();

  const flashListRef = React.useRef<any>();

  /*
   * the last message read at previous sync and fetch comes from server
   * we can access it from currentChannel?.lastMessageRead
   *
   * on scroll list,
   * compare the last visible item with current value of this ref
   * or compare with the lastMessageRead
   * if it's a newer message (createdAt)
   * we assign that message to this ref,
   *
   * the messageId stored in this ref will be sent to server to tell
   * what's the last message has been read
   */
  const lastMessageVisitedRef = React.useRef<any>(null);
  const timeoutIdRef = React.useRef<any>(null);

  const messagesOfChannel = useSelector(state =>
    selectMessagesByChannelId(state, currentChannel?._id),
  );

  const lastMessageReadId = currentChannel?.der_lastMessageRead?._id;

  const topSpinnerItem: CustomComponentItem = React.useMemo(
    () => ({
      _id: 'TopSpinner',
      componentType: 'custom',
      component: TopSpinner,
      props: {currentChannel, messagesOfChannel, flashListRef},
    }),
    [currentChannel, messagesOfChannel, flashListRef],
  );

  const bottomSpinnerItem: CustomComponentItem = React.useMemo(
    () => ({
      _id: 'BottomSpinner',
      componentType: 'custom',
      component: BottomSpinner,
      props: {currentChannel, messagesOfChannel, flashListRef},
    }),
    [currentChannel, messagesOfChannel, flashListRef],
  );

  /*
   * list item contains message data objects
   * and some custom components in between
   */
  const listItems = React.useMemo(
    () => [topSpinnerItem, ...messagesOfChannel, bottomSpinnerItem],
    [bottomSpinnerItem, messagesOfChannel, topSpinnerItem],
  );

  //TODO: remove log
  // console.log('messagesOfChannel', messagesOfChannel);

  const dispatchFetchNewMessages = useCallback(() => {
    dispatch(
      fetchMessagesOfChannel({
        channelId: currentChannel?._id,
        // if last message read of a channel is undefiend or null
        // it means when user joined that channel
        // the channel was empty
        // and user did not naviaget to the channel until now
        // we want to fetch the first message that is unread
        // in this case it is the first message of the channel
        after: lastMessageReadId || 'first',
        stateTransition: 'FETCH_NEW',
      }),
    );
  }, [currentChannel?._id, dispatch, lastMessageReadId]);

  React.useEffect(() => {
    // dispatch fecth action with a little delay
    // so stack navigator animation can run smoothly
    setTimeout(() => {
      dispatchFetchNewMessages();
    }, 500);

    // when message screen closed
    // we want to clear messages data from redux
    // New Note: we should not add the close handler in useEffect cleanup
    // because cleanup does not run onClose necessarily
    // it can run when user wants to fetch older messages
    // New Note 2: useEffect with no dependency only runs 1 time
    // cleanup runs only if the useEffect is going to run again (or unmount)
    // so here cleanup only runs in unmount (close screen)
    return () => {
      // the action creator recevies optional payload as new data
      // here we dont need to provide data
      dispatch(resetMessagesToNewData(null));

      // clear timeout for send lastest seen messageId
      // instead send it immediatelly
      clearTimeout(timeoutIdRef?.current);
      // may be there is a message, but timeout ref is empty
      // it means the request is already sent
      if (lastMessageVisitedRef?.current && timeoutIdRef?.current) {
        dispatch(
          syncLastMessageVisited({
            channelId: currentChannel?._id,
            messageId: lastMessageVisitedRef?.current?._id,
          }),
        )
          ?.unwrap()
          ?.finally(() => {
            dispatch(syncData());
          });
        // TODO: remove log
        // console.log('run immediate', lastMessageVisitedRef?.current?.title);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * assign the most new unread message to lastMessageVisited.current
   * set a timeout to send that messageId to server (for example 5 sec)
   * if a new message is seen within the timeout duration (5 sec)
   * cancel that timeout and set a new one
   * because we must only send the newest messageId
   *
   * if message screen is closed
   * cancel the last timeout (that wants to send the newest messageId)
   * and send that neweset messageId immediatelly
   */
  const handleViewableChange = React.useCallback(
    (info: any) => {
      const itemsVisible = info.viewableItems;
      const messageItemsVisible = itemsVisible.filter(
        (item: any) => item?.item?.componentType !== 'custom',
      );
      const lastMessageItemVisible =
        messageItemsVisible[messageItemsVisible?.length - 1];

      const lastMessageVisible = lastMessageItemVisible?.item;

      // who is the last visited message that we want to send it's id to server ?
      // at the end, the result will be assigned to ref.current
      // why not directly assigning ref.current ?
      // because we want to check if the result same as the ref.current
      // prevent send duplicate request
      let result: any;
      // the current last visiBLE message in screen
      // may be newer than last visiTED message (if user scrolls down)
      // or may be older than last visiTED message (if user scroll up to see old messages)
      if (lastMessageVisitedRef?.current) {
        const lastMessageVisibleDate = new Date(lastMessageVisible?.createdAt);
        const lastMessageVisitedDate = new Date(
          lastMessageVisitedRef?.current?.createdAt,
        );
        if (lastMessageVisibleDate > lastMessageVisitedDate) {
          result = lastMessageVisible;
        }
      }
      // the ref was empty
      // so we have to compare it with the lastMessageRead (from server response)
      else if (currentChannel?.der_lastMessageRead) {
        const lastMessageVisibleDate = new Date(lastMessageVisible?.createdAt);
        const lastMessageReadDate = new Date(
          currentChannel?.der_lastMessageRead?.createdAt,
        );
        if (lastMessageVisibleDate > lastMessageReadDate) {
          result = lastMessageVisible;
        }
      }
      // there is no lastMessageRead from server (it's null)
      // and the ref is also empty
      // so the last visible message at the first cycle, is the last visited message
      else {
        result = lastMessageVisible;
      }

      // if result is same as the ref.current or it's undefined
      // do not trigger timeoue
      // NEW NOTEL: actually result can not be same as the ref.current
      // because result has to be newer (in date)
      if (result && lastMessageVisitedRef?.current?._id !== result?._id) {
        lastMessageVisitedRef.current = result;
        clearTimeout(timeoutIdRef?.current);
        timeoutIdRef.current = setTimeout(() => {
          // TODO: remove log
          // console.log('last message title to send', result?.title);
          dispatch(
            syncLastMessageVisited({
              channelId: currentChannel?._id,
              messageId: lastMessageVisitedRef?.current?._id,
            }),
          );
          // add a sign to indicate that there is no request to send when screen closes
          timeoutIdRef.current = null;
        }, 10000);
      }

      // handle fetch new messages if we reach end
      if (
        lastMessageVisible &&
        lastMessageVisible?._id ===
          messagesOfChannel?.[messagesOfChannel?.length - 1]?._id
      ) {
        // TODO: remove log
        console.log('reach end');
      }

      // TODO: remove log
      // console.log('last message visible', lastMessageVisible?.title);
      // console.log('changed items', info);
      console.log('id1', lastMessageVisible?._id);
      console.log(
        'id2',
        messagesOfChannel?.[messagesOfChannel?.length - 1]?._id,
      );
      console.log('messagesOfChannel', messagesOfChannel);
    },
    [
      currentChannel?._id,
      currentChannel?.der_lastMessageRead,
      dispatch,
      messagesOfChannel,
    ],
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlashListWrapper
          ref={flashListRef}
          listItems={listItems}
          onViewableItemsChanged={handleViewableChange}
        />
      </View>
    </View>
  );
}

function TopSpinner({currentChannel, messagesOfChannel, flashListRef}: any) {
  const dispatch = useDispatch<any>();
  const [fetchStatus, setFetchStatus] = React.useState(FetchStatus.INIT);

  // sets to true when the real first message of channel is fetched
  // and there is no more older items
  const [isEndReached, setIsEndReached] = React.useState(false);

  const channelId = currentChannel?._id;
  // current first message in redux
  // may be there is older messages at backend
  const currentFirstMessage = messagesOfChannel?.[0];
  const firstMessageId = currentFirstMessage?._id;

  const handleFetchMessagePress = useCallback(() => {
    const fetch = async () => {
      setFetchStatus(FetchStatus.FETCHING);
      try {
        const actionPayload = await dispatch(
          fetchMessagesOfChannel({
            channelId,
            before: firstMessageId || 'last',
          }),
        ).unwrap();

        setFetchStatus(FetchStatus.SUCCESS);

        // actionPayload: {data: (...from server), stateTransition}
        const responseMessagesLength = actionPayload?.data?.messages?.length;
        const responseLimit = actionPayload?.data?.limit;

        if (responseMessagesLength < responseLimit) {
          setIsEndReached(true);
        }

        if (flashListRef?.current) {
          // remain at the same item when user presses fetch message button
          // if 10 items fetched from response
          // then scroll down 1+10 items (the 1 is top custom component)
          setTimeout(() => {
            flashListRef?.current?.scrollToIndex({
              index: responseMessagesLength + 1,
              animated: true,
              viewOffset: 60,
              // viewPosition: 50,
            });
          }, 250);
        }
      } catch (err) {
        setFetchStatus(FetchStatus.ERROR);
      }
    };
    fetch();
  }, [channelId, dispatch, firstMessageId, flashListRef]);

  const persianDateFormat = React.useMemo(() => {
    return getPersianDateFormat(currentChannel?.createdAt);
  }, [currentChannel?.createdAt]);

  const channelCreatedText =
    'کانال' +
    ' ' +
    currentChannel?.title +
    ' ' +
    'در تاریخ' +
    ' ' +
    persianDateFormat +
    ' ' +
    'ایجاد شد';

  let buttonContent;
  if (isEndReached) {
    buttonContent = (
      <Text style={styles.fetchMessageBtnText}>{channelCreatedText}</Text>
    );
  } else if (fetchStatus === FetchStatus.FETCHING) {
    buttonContent = <ActivityIndicator size={24} color={'#fff'} />;
  } else {
    buttonContent = (
      <Pressable onPress={handleFetchMessagePress}>
        <Text style={styles.fetchMessageBtnText}>
          مشاهده پیام های خوانده شده
        </Text>
      </Pressable>
    );
  }

  let content = <View style={styles.fetchMessageBtn}>{buttonContent}</View>;

  return <View style={styles.spinnerContainer}>{content}</View>;
}

function BottomSpinner() {
  const messageFetchStatus = useSelector(selectMessagesFetchStatus);

  let content;
  if (messageFetchStatus === MessagesFetchStatus.FETCH_NEW_MESSAGES) {
    content = <ActivityIndicator size={36} color={primaryColor} />;
  }

  return <View style={styles.spinnerContainer}>{content}</View>;
}

export default MessageList;
