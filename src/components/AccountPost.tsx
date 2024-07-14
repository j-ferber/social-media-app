import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {api} from '~/trpc/server';
import type {Post} from '@prisma/client';

const AccountPost = async ({id, mediaId, caption}: Post) => {
  const mediaURL = await api.post.getMediaURL({mediaId});

  return (
    <Link
      href={`/p/${id}`}
      className="relative aspect-square h-[150px] w-full overflow-hidden sm:h-[200px] md:h-[300px]"
    >
      <Image
        src={mediaURL}
        alt={caption}
        fill
        className="object-cover transition-opacity hover:opacity-85"
        priority
        sizes="(max-width: 640px) 100vw, 
               (max-width: 768px) 50vw, 
               33vw"
      />
    </Link>
  );
};

export default AccountPost;
