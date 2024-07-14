'use client';

import React from 'react';
import {api} from '~/trpc/react';
import {useParams} from 'next/navigation';
import ResponsiveContainer from '~/components/ResponsiveContainer';
import {Home, LoaderCircle, Pencil, Trash} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {ThumbsUp} from 'lucide-react';
import {cn} from '~/lib/utils';
import CommentSheet from '~/components/CommentSheet';
import {useToast} from '~/components/ui/use-toast';
import {useRouter} from 'next/navigation';

const PostPage = () => {
  const params: {postid: string} = useParams();
  const {toast} = useToast();
  const router = useRouter();
  const {isLoading, data, refetch} = api.post.getPostData.useQuery({
    postId: parseInt(params.postid),
  });
  const {mutate} = api.post.likePost.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const {mutate: deletePost} = api.post.deletePost.useMutation({
    onSuccess: async () => {
      router.push(`/`);
      toast({
        title: 'Post Deleted',
        description: 'Your post has been deleted successfully',
      });
    },
    onError: error => {
      toast({
        title: 'Delete Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <ResponsiveContainer className="flex flex-col items-center justify-center gap-2">
        <LoaderCircle className="h-16 w-16 animate-spin text-white" />
      </ResponsiveContainer>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-2xl font-bold tracking-wide">Post not found.</p>
        <Link href={'/'}>
          <Home className="transition-all hover:scale-110" />
        </Link>
      </div>
    );
  }

  return (
    <ResponsiveContainer>
      <div className="flex min-h-screen w-full flex-col gap-5 bg-neutral-900 p-6 md:p-10">
        <div className="relative h-[300px] w-full overflow-hidden rounded-xl sm:h-[450px]">
          <Image
            src={data.media.url}
            alt={data.caption}
            fill
            priority
            className="object-cover sm:object-contain"
          />
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <ThumbsUp
              className={cn(
                'text-white transition-all hover:scale-110 hover:cursor-pointer active:scale-105',
                data.userLiked && 'text-blue-500'
              )}
              onClick={() => mutate({postId: parseInt(params.postid)})}
            />
            <p className="w-5 text-center text-xl font-bold leading-none text-white">
              {data.likes.length}
            </p>
            <CommentSheet />
          </div>
          {data.createdByCurrentUser && (
            <div className="flex items-center justify-center gap-4">
              <Link href={`/p/edit/${params.postid}`}>
                <Pencil className="ml-4 text-white transition-all hover:scale-110 hover:cursor-pointer active:scale-105" />
              </Link>
              <Trash
                className={
                  'text-white transition-all hover:scale-110 hover:cursor-pointer active:scale-105'
                }
                onClick={() => deletePost({postId: params.postid})}
              />
            </div>
          )}
        </div>
        <div className="flex w-full items-center gap-4 text-pretty text-white">
          <img
            className="h-12 w-12 rounded-full"
            alt="Profile Picture"
            src={data.createdBy.image ?? '/images/avatar.png'}
          />
          <Link href={`/${data.createdBy.username}`}>
            <p className="text-xl font-semibold text-white">
              {data.createdBy.username}
            </p>
          </Link>
        </div>
        <p className="text-white">{data.caption}</p>
      </div>
    </ResponsiveContainer>
  );
};

export default PostPage;
