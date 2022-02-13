 
import { jsx } from '@emotion/react'
import * as React from 'react';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { flex, pY, roundedPx, text3Xl } from '../../styles/atoms';
import { darken, lighten } from 'polished';
import plus from '../../assets/icons/plus-circle.svg';
import Icon from '../atoms/Icon';
import { bgColor, textColor } from '../../styles/colors';

const style = css`
  ${[flex, roundedPx, pY(4), text3Xl]};
  background-color: ${lighten(0.025, bgColor)};
  color: ${darken(0.1, textColor)};
  text-decoration: none;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${lighten(0.05, bgColor)};
  }
`;

function NewSpaceCard() {
  return (
    <Link to="/space/new" css={style}>
      <Icon sprite={plus} />
    </Link>
  );
}

export default NewSpaceCard;
