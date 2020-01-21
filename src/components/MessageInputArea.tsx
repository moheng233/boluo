import React, { useRef, useState } from 'react';
import { Channel, ChannelMember } from '../api/channels';
import { TextField, Stack, CommandBar, IconButton } from 'office-ui-fabric-react';
import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/components/CommandBar/CommandBar.types';
import { TextFieldOnChange } from '../types';
import { post } from '../api/client';
import { Message, NewMessage } from '../api/messages';
import { newId } from '../utils';
import { useMe } from './App';

interface Props {
  channel: Channel;
  member: ChannelMember;
}

export const MessageInputArea: React.FC<Props> = ({ channel, member }) => {
  const me = useMe();
  const [text, setText] = useState('');
  const [name, setName] = useState(member.characterName);
  const [inGame, setInGame] = useState(true);
  const [isAction, setIsAction] = useState(false);
  const [broadcast, setBroadcast] = useState(true);
  const id = useRef<string>(newId());

  if (me === null) {
    return null;
  }

  const handleText: TextFieldOnChange = (_, value) => {
    setText(value ?? '');
  };

  const handleCharacterName: TextFieldOnChange = (_, value) => {
    setName(value ?? '');
  };

  const handleSend = async () => {
    await post<Message, NewMessage>('/messages/send', {
      messageId: id.current,
      channelId: channel.id,
      name: inGame ? name : me.nickname,
      text,
      entities: [],
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

  const canSend = text.trim().length > 0 && name.length > 0;

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
    <div>
      <Stack horizontal>
        <Stack.Item align="end">
          <Stack horizontal>
            <Stack.Item align="end">
              <TextField
                label="名字"
                value={inGame ? name : me.nickname}
                onChange={handleCharacterName}
                disabled={!inGame}
                required
              />
            </Stack.Item>
            <Stack.Item align="end">
              <IconButton iconProps={{ iconName: 'history' }} />
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Item align="end" grow>
          <CommandBar items={items} farItems={farItems} />
        </Stack.Item>
      </Stack>
      <TextField value={text} onChange={handleText} multiline />
    </div>
  );
};
