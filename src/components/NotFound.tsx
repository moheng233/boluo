import React from 'react';
import { Link } from 'react-router-dom';

interface Props {}

export const NotFound: React.FC<Props> = () => {
  return (
    <div className="NotFound">
      <h1>没有找到</h1>
      <p>
        页面没有找到，<Link to="/">点这里回首页</Link>。
      </p>
    </div>
  );
};
