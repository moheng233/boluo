import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Channel } from '../channels/channels.entity';
import { User } from '../users/users.entity';
import { Space } from '../spaces/spaces.entity';

@Entity('invitations')
@ObjectType('Invitation')
export class Invitation {
  @PrimaryColumn()
  @Field()
  token!: string;

  @ManyToOne(
    () => Space,
    space => space.invitations,
    { nullable: false, onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'spaceId' })
  @Field(() => Channel)
  space!: Promise<Space>;

  @Column({ type: 'uuid' })
  @Field(() => ID)
  spaceId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  @Field(() => User)
  creator!: Promise<User>;

  @Column({ type: 'uuid' })
  @Field(() => ID)
  creatorId!: string;

  @Column({ type: 'timestamp' })
  @Field()
  expiration!: Date;
}
