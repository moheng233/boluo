import React from 'react';
import { ExprNode } from '../entities';

interface Props {
  node: ExprNode;
}

export const Expr: React.FC<Props> = ({ node }) => {
  if (node.type === 'Num') {
    return <div className="entity entity-number">{node.value}</div>;
  } else if (node.type === 'Roll') {
    return (
      <div className="entity entity-roll">
        {node.counter}D{node.face}
      </div>
    );
  } else if (node.type === 'Binary') {
    return (
      <div className="entity entity-binary">
        <Expr node={node.l} /> {node.op} <Expr node={node.r} />
      </div>
    );
  } else {
    return <div className="entity entity-unknown">UNKNOWN</div>;
  }
};
