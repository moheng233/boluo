import React from 'react';
import { Entity } from '../entities';
import { Expr } from './Expr';

interface Props {
  text: string;
  entities: Entity[];
}

export const MessageContent: React.FC<Props> = ({ text, entities }) => {
  const content = [];
  let key = 0;
  for (const entity of entities) {
    if (entity.type === 'Expr') {
      content.push(<Expr key={key} node={entity.node} />);
    } else if (entity.type === 'Text') {
      content.push(
        <div key={key} className="entity entity-text">
          {text.substr(entity.start, entity.offset)}
        </div>
      );
    } else if (entity.type === 'Link') {
      content.push(
        <a key={key} className="entity entity-link" href={entity.href}>
          {text.substr(entity.start, entity.offset)}
        </a>
      );
    } else if (entity.type === 'Strong') {
      content.push(
        <strong key={key} className="entity entity-strong">
          {text.substr(entity.start, entity.offset)}
        </strong>
      );
    } else if (entity.type === 'Emphasis') {
      content.push(
        <em key={key} className="entity entity-emphasis">
          {text.substr(entity.start, entity.offset)}
        </em>
      );
    }
    key += 1;
  }
  return <div className="MessageContent">{content}</div>;
};
