import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {api} from '~/trpc/server';
import type {Post} from '@prisma/client';

const AccountPost = async ({id, mediaId, caption}: Post) => {
  const mediaURL = await api.post.getMediaURL({mediaId});

  return (
    <article className="relative aspect-square h-[150px] w-full overflow-hidden sm:h-[200px] md:h-[300px]">
      <Link href={`/p/${id}`}>
        <Image
          src={mediaURL}
          alt={caption}
          fill
          className="object-cover transition-opacity hover:opacity-85"
        />
      </Link>
    </article>
  );
};

export default AccountPost;
