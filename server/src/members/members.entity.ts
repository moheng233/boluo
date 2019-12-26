import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from '../users/users.entity';
import { Channel } from '../channels/channels.entity';
import { Space } from '../spaces/spaces.entity';

@Entity('members')
@ObjectType('Members')
export class Member {
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user!: Promise<User>;

  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  userId!: string;

  @ManyToOne(
    () => Space,
    space => space.members,
    { nullable: false, onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'spaceId' })
  @Field(() => Channel)
  space!: Promise<Space>;

  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  spaceId!: string;

  @Column({ type: 'boolean', default: false })
  @Field()
  isMaster!: boolean;

  @CreateDateColumn()
  @Field()
  joinDate!: Date;

  @Column({ default: '' })
  @Field()
  character!: string;
}
