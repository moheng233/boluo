import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { Message } from '../messages/messages.entity';
import { User } from '../users/users.entity';
import { Invitation } from '../invitaions/invitaions.entity';
import { Member } from '../members/members.entity';
import { Channel } from '../channels/channels.entity';

@Entity('spaces')
@Index(['name', 'parentId'], { unique: true })
@ObjectType('Channel')
export class Space {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  id!: string;

  @Column({ type: 'boolean', default: false })
  @Field()
  isPublic!: boolean;

  @OneToMany(
    () => Channel,
    channel => channel.parent
  )
  @Field(() => [Channel])
  channels!: Promise<Channel[]>;

  @Column()
  @Field()
  name!: string;

  @Column({ default: '' })
  @Field()
  description!: string;

  @CreateDateColumn()
  @Field()
  created!: Date;

  @UpdateDateColumn()
  @Field()
  modified!: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  @Field(() => User, { nullable: false })
  owner!: Promise<User>;

  @Column({ type: 'uuid' })
  @Field(() => ID)
  ownerId!: string;

  @OneToMany(
    () => Invitation,
    invitation => invitation.space
  )
  invitations!: Promise<Invitation[]>;

  @OneToMany(
    () => Member,
    member => member.space
  )
  @Field(() => [Member])
  members!: Promise<Member[]>;

  @Column({ type: 'integer', default: 20 })
  @Field(() => Int)
  diceDefaultFace!: number;

  @Column({ type: 'text', default: '' })
  @Field(() => String, { description: 'ISO 639-1, An empty string represents the language of the channel is not set' })
  language!: string;
}
