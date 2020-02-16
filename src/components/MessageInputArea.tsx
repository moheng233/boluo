import React, { useRef, useState } from 'react';
import { Channel, ChannelMember } from '../api/channels';
import { TextField, Stack, CommandBar } from 'office-ui-fabric-react';
import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/components/CommandBar/CommandBar.types';
import { TextFieldOnChange } from '../types';
import { post } from '../api/client';
import { Message, NewMessage, Preview } from '../api/messages';
import { newId } from '../utils';
import { useMe } from './App';
import './MessageInputArea.scss';
import { parse } from '../parser';

interface Props {
  channel: Channel;
  member: ChannelMember;
}

export const MessageInputArea: React.FC<Props> = ({ channel, member }) => {
  const me = useMe();
  const inputting = useRef(false);
  const [text, setText] = useState('');
  const [name, setName] = useState(member.characterName);
  const [inGame, setInGame] = useState(true);
  const [isAction, setIsAction] = useState(false);
  const [broadcast, setBroadcast] = useState(true);
  const id = useRef<string>(newId());
  const timeoutSendPreview: React.MutableRefObject<number | null> = useRef(null);

  if (me === null) {
    return null;
  }

  const handleText: TextFieldOnChange = (_, value) => {
    setText(value ?? '');
    if (timeoutSendPreview.current !== null) {
      window.clearTimeout(timeoutSendPreview.current);
      timeoutSendPreview.current = null;
    }
    if (broadcast) {
      timeoutSendPreview.current = window.setTimeout(async () => {
        const { text: parsed, entities } = parse(value ?? '');
        const preview: Preview = {
          id: id.current,
          senderId: me.id,
          channelId: channel.id,
          parentMessageId: null,
          name: inGame ? name : me.nickname,
          mediaId: null,
          inGame,
          isAction,
          isMaster: false,
          text: parsed,
          whisperToUsers: null,
          entities,
          start: new Date().getTime(),
        };
        await post<Preview, Preview>('/messages/preview', preview);
        timeoutSendPreview.current = null;
      }, 300);
    }
  };

  const handleKey: React.KeyboardEventHandler = e => {
    if (e.metaKey && e.keyCode === 13) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCharacterName: TextFieldOnChange = (_, value) => {
    setName(value ?? '');
  };

  const handleSend = async () => {
    const { text: parsed, entities } = parse(text);
    await post<Message, NewMessage>('/messages/send', {
      messageId: id.current,
      channelId: channel.id,
      name: inGame ? name : me.nickname,
      text: parsed,
      entities,
      inGame,
      isAction,
    });
    setText('');
    setIsAction(false);
    id.current = newId();
  };

  const items: ICommandBarItemProps[] = [
    {
      key: 'toggleInGame',
      text: '游戏内',
      checked: inGame,
      onClick: () => setInGame(!inGame),
      iconProps: {
        iconName: 'mask',
      },
    },
    {
      key: 'toggleTextBroadcast',
      text: '广播',
      checked: broadcast,
      onClick: () => setBroadcast(!broadcast),
      iconProps: {
        iconName: 'broadcast',
      },
    },
    {
      key: 'toggleAction',
      text: '动作',
      checked: isAction,
      onClick: () => setIsAction(!isAction),
      iconProps: {
        iconName: 'action',
      },
    },
  ];

  const canSend = text.trim().length > 0 && (!inGame || name.length > 0);

  const farItems: ICommandBarItemProps[] = [
    {
      key: 'send',
      text: '发送',
      disabled: !canSend,
      iconProps: {
        iconName: 'send',
      },
      onClick: () => {
        handleSend();
      },
    },
  ];

  return (
    <div className="MessageInputArea">
      <Stack horizontal>
        <Stack.Item align="end">
          <Stack horizontal>
            <Stack.Item align="center">
              <TextField
                label="名字"
                className="name-text-field"
                inputClassName="name-input"
                value={inGame ? name : me.nickname}
                onChange={handleCharacterName}
                disabled={!inGame}
                underlined
                required
              />
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Item align="end" grow>
          <CommandBar items={items} farItems={farItems} />
        </Stack.Item>
      </Stack>
      <TextField
        className="message-text-field"
        inputClassName="message-input"
        value={text}
        onChange={handleText}
        onCompositionStart={() => (inputting.current = true)}
        onCompositionEnd={() => (inputting.current = false)}
        onKeyDown={handleKey}
        placeholder="在这里说点什么吧..."
        multiline
        autoAdjustHeight
        resizable={false}
        borderless
      />
    </div>
  );
};
