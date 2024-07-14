import Image from 'next/image';
import React from 'react';
import {type RouterOutputs} from '~/trpc/react';
import {Avatar, AvatarImage} from './ui/avatar';

type PostDataOutput = RouterOutputs['post']['getRecentPosts']['items'][number];

const ExploreFeedPost = ({post}: {post: PostDataOutput}) => {
  return (
    <div className="flex h-screen w-full flex-col gap-4">
      <div className="relative h-2/3 w-full">
        <Image
          fill
          src={post.media.url}
          alt="Post Image"
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex w-full items-center justify-start gap-2">
        <Avatar>
          <AvatarImage src={post.createdBy.image ?? '/images/avatar.png'} />
        </Avatar>
        <p className="text-xl font-semibold text-white">
          {post.createdBy.username}
        </p>
      </div>
      <p className="text-lg text-muted-foreground">{post.caption}</p>
    </div>
  );
};

export default ExploreFeedPost;
