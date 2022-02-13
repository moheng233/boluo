import * as React from 'react';
import Loading from '../../components/molecules/Loading';
import styled from '@emotion/styled';
import { css,jsx } from '@emotion/react';
import { mask } from '../../styles/atoms';

const Mask = styled.div`
  ${mask};
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const spinnerContainer = css``;

interface Props {
  text?: string;
}

function PageLoading({ text }: Props) {
  return (
    <Mask>
      <div css={spinnerContainer}>
        <Loading css={css({
          display: "block"
        })} text={text} />
      </div>
    </Mask>
  );
}

export default PageLoading;
