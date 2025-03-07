 
import { jsx } from '@emotion/react'
import * as React from 'react';
import { useRef } from 'react';
import Prando from 'prando';
import { encodeUuid, Id } from '../../utils/id';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { fontBold, inline, mL, mR, relative, textSm } from '../../styles/atoms';
import Icon from '../atoms/Icon';
import masterIcon from '../../assets/icons/gamemaster.svg';
import { css } from '@emotion/react';
import { gray } from '../../styles/colors';
import { chatContentLineHeight } from './styles';
import Tooltip from '../atoms/Tooltip';
import { useSelector } from '../../store';
import { useChannelId } from '../../hooks/useChannelId';
import { genColor } from '../../utils/game';

interface Props {
  name: string;
  master: boolean;
  action: boolean;
  inGame: boolean;
  userId: Id;
}

const Container = styled.span`
  ${[mR(1), chatContentLineHeight]};

  & .user-panel {
    visibility: hidden;
  }

  &:hover .user-panel {
    visibility: visible;
  }
`;

const NameLink = styled(Link)`
  ${[fontBold, relative]};
  text-decoration: none;
`;

const colorMap: Record<string, string> = {};

const masterIconStyle = css`
  ${[mL(0.5)]};
  color: ${gray['500']};
`;

const nicknameStyle = css`
  ${textSm};
  user-select: none;
`;

function ChatItemName({ name, userId, master }: Props) {
  const pane = useChannelId()!;
  const nickname = useSelector(
    (state) => state.chatStates.get(pane)!.members.find((member) => member.user.id === userId)?.user.nickname
  );
  const linkRef = useRef<HTMLAnchorElement>(null);
  if (!colorMap[name]) {
    const rng = new Prando(userId);
    colorMap[name] = genColor(rng);
  }
  const color = colorMap[name];
  return (
    <Container>
      <div css={[relative, inline]}>
        <NameLink ref={linkRef} css={{ color }} to={`/profile/${encodeUuid(userId)}`}>
          {name}
        </NameLink>
        {nickname && (
          <Tooltip css={nicknameStyle} className="user-panel">
            {nickname}
          </Tooltip>
        )}
      </div>
      {master && <Icon css={masterIconStyle} sprite={masterIcon} />}
    </Container>
  );
}

export default React.memo(ChatItemName);
