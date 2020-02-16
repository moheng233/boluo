import React, { useEffect, useRef, useState } from 'react';
import { get } from '../api/client';
import { Message, Preview } from '../api/messages';
import { useFetch } from '../helper/fetch';
import { MessageItem } from './MessageItem';
import { Event } from '../api/events';
import { List, Map, OrderedMap, Seq } from 'immutable';
import { MESSAGE_PREVIEW, NEW_MESSAGE } from '../consts';
import './MessageList.scss';
import { PreviewItem } from './PreviewItem';

interface Props {
  channelId: string;
}

interface Events {
  newMessages: List<Message>;
  previews: List<Preview>;
}

const useEvents = (channelId: string): Events => {
  const after = useRef(new Date().getTime());
  const [newMessages, setNewMessage] = useState<OrderedMap<string, Message>>(OrderedMap());
  const [previews, setPreviews] = useState<OrderedMap<string, Preview>>(OrderedMap());
  useEffect(() => {
    (async () => {
      const timeBeforeRequest = new Date().getTime();
      const eventsResult = await get<Event[]>('/events/subscribe', { mailbox: channelId, after: after.current });
      if (!eventsResult.ok) {
        console.warn(eventsResult.err);
        return;
      }
      const events = eventsResult.some;
      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        after.current = lastEvent.timestamp;
      } else {
        after.current = timeBeforeRequest;
      }

      let nextNewMessages = newMessages;
      let nextPreviews = previews;

      for (const event of events) {
        if (event.body.type === NEW_MESSAGE) {
          const newMessage = event.body.message;
          nextNewMessages = nextNewMessages.set(newMessage.id, newMessage);
          nextPreviews = nextPreviews.remove(newMessage.id);
        } else if (event.body.type === MESSAGE_PREVIEW) {
          const newPreview = event.body.preview;
          nextPreviews = previews.set(newPreview.id, newPreview);
        }
      }
      const now = new Date().getTime();
      const keepPreview = now - 40 * 1000;
      nextPreviews.filter(preview => preview.start > keepPreview);

      if (nextNewMessages !== newMessages) {
        setNewMessage(nextNewMessages);
      }
      if (nextPreviews !== previews) {
        setPreviews(nextPreviews);
      }
    })();
  }, [channelId, after.current]);

  return { newMessages: newMessages.toList(), previews: previews.toList() };
};

export const MessageList: React.FC<Props> = ({ channelId }) => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [messageLoadResult] = useFetch(
    async () => get<Message[]>('/messages/by_channel', { channel: channelId }),
    [channelId]
  );
  const { newMessages, previews } = useEvents(channelId);

  useEffect(() => {
    const div = ref.current;
    if (div) {
      div.scrollTo(0, div.scrollHeight);
    }
  }, [channelId, messageLoadResult, newMessages.size]);

  if (messageLoadResult === 'LOADING') {
    return <div className="MessageList">...</div>;
  }
  if (!messageLoadResult.ok) {
    return <div className="MessageList">{messageLoadResult.err.message}</div>;
  }
  const messages = messageLoadResult.some;

  return (
    <div className="MessageList" ref={ref}>
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
      {newMessages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
      {previews.map(preview => (
        <PreviewItem key={preview.id} preview={preview} />
      ))}
    </div>
  );
};
