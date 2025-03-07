 
import { jsx } from '@emotion/react'
import * as React from 'react';
import { useState } from 'react';
import Title from '../atoms/Title';
import SpaceCard from '../organisms/SpaceCard';
import { SpaceGrid } from '../atoms/SpaceGrid';
import NewSpaceCard from '../organisms/NewSpaceCard';
import planetConquest from '../../assets/icons/planet-conquest.svg';
import newspaper from '../../assets/icons/newspaper.svg';
import Icon from '../atoms/Icon';
import { useSelector } from '../../store';
import styled from '@emotion/styled';
import { link, mB, spacingN } from '../../styles/atoms';
import { News } from '../atoms/News';
import ExternalLink from '../../components/atoms/ExternalLink';
import { Link } from 'react-router-dom';
import Text from '../atoms/Text';
import Help from '../chat/Help';
import { Code } from '../atoms/Code';

const Container = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  gap: ${spacingN(2)};
`;

function My() {
  const spaces = useSelector((state) => state.profile!.spaces);
  const cards = spaces.valueSeq().map(({ space }) => <SpaceCard key={space.id} space={space} />);
  const [showHelp, setHelp] = useState(false);
  return (
    <Container>
      <div>
        <Title>
          <Icon sprite={planetConquest} /> 我在的位面
        </Title>
        <SpaceGrid>
          <NewSpaceCard />
          {cards}
        </SpaceGrid>
      </div>
      <div>
        <Title>
          <Icon sprite={newspaper} /> 新闻
        </Title>
        <News css={[mB(2)]}>
          增加了消息通知功能，底层改动比较大，现在可能会有一些 Bug，可以到QQ群（1107382038）反馈。
        </News>
        <News css={[mB(2)]}>
          导出功能现在可以选择时间，导出最近的消息了。切换游戏内外的按键改为<code>Esc</code>键。
          增加了网络连不上时候的备用线路 <Code>https://cdn.boluo.chat/</Code>。
        </News>
        <News css={[mB(2)]}>
          <Text>
            菠萝上线啦！现在是早期测试阶段，请到
            <ExternalLink to="https://forum.boluo.chat/" css={link}>
              讨论版
            </ExternalLink>
            或「
            <Link to="/space/sKPHfPhpEeqCXBcv8xDXgA" css={link}>
              菠萝讨论
            </Link>
            」位面提出你的意见和建议。
          </Text>

          <Text>
            功能测试可以到
            <Link css={link} to="/space/j~E-cNonEeqMopvAttbC8g">
              沙盒位面
            </Link>
            。管理员将不定期删除没有实质内容的测试位面。
          </Text>
        </News>
      </div>
      {showHelp && <Help dismiss={() => setHelp(false)} />}
    </Container>
  );
}

export default My;
