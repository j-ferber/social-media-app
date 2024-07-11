'use client';

import React, {Suspense} from 'react';
import {Form, FormControl, FormField, FormItem, FormMessage} from './ui/form';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Textarea} from './ui/textarea';
import {Button} from './ui/button';
import {useParams} from 'next/navigation';
import {api} from '~/trpc/react';
import {useToast} from './ui/use-toast';
import {LoaderCircle} from 'lucide-react';
import {Avatar, AvatarImage} from './ui/avatar';
import {Heart} from 'lucide-react';
import {cn} from '~/lib/utils';

const commentFormSchema = z.object({
  comment: z
    .string()
    .min(1, {message: 'Comment must be at least one character long'})
    .max(200, {message: 'Comment must be less than 200 characters long'}),
});

const CommentForm = () => {
  const params: {postid: string} = useParams();

  const {toast} = useToast();

  const {mutate} = api.comment.createComment.useMutation({
    onError: error => {
      toast({
        title: 'Comment Error',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: async () => {
      commentForm.reset();
      await refetch();
      toast({
        title: 'Comment Created',
        description: 'Your comment has been posted successfully',
      });
    },
  });

  const {mutate: likeComment} = api.comment.likeComment.useMutation({
    onSuccess: async () => {
      await refetch();
    },
    onError: error => {
      toast({
        title: 'Like Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const {data, refetch, isLoading} = api.comment.getPostComments.useQuery({
    postId: params.postid,
  });

  const commentForm = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: '',
    },
  });

  async function onSubmit(values: z.infer<typeof commentFormSchema>) {
    mutate({postId: params.postid, text: values.comment});
  }

  return (
    <Form {...commentForm}>
      <form
        onSubmit={commentForm.handleSubmit(onSubmit)}
        className="my-4 space-y-8"
      >
        <div className="flex w-full flex-col items-start justify-center gap-2">
          <FormField
            control={commentForm.control}
            name="comment"
            render={({field}) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="Leave a comment here..."
                    className="w-full resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="secondary" className="mt-2">
            Post
          </Button>
        </div>
        {data === undefined ?? !data?.length ? (
          isLoading ? (
            <LoaderCircle className="mx-auto mt-4 animate-spin" />
          ) : (
            <p className="font-semibold">No comments yet.</p>
          )
        ) : (
          data.map(comment => (
            <div
              className="flex w-full flex-col items-start justify-center gap-2"
              key={comment.id}
            >
              <div className="flex w-full items-center justify-start gap-2">
                {comment.user.image ? (
                  <Avatar>
                    <AvatarImage
                      src={comment.user.image}
                      alt="Profile Picture"
                    />
                  </Avatar>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-darkPurple">
                    <p>{comment.user.username?.charAt(0).toUpperCase()}</p>
                  </div>
                )}
                <p className="font-semibold">{comment.user.username}</p>
                <div className="flex w-full items-center justify-end text-muted-foreground">
                  {comment.createdAt.toLocaleDateString()}
                </div>
              </div>
              <p className="text-pretty">{comment.comment}</p>
              <div className="flex w-full items-center justify-start gap-2">
                <Heart
                  className={cn(
                    'h-4 w-4 transition-all hover:scale-110 hover:cursor-pointer active:scale-105',
                    comment.isLikedByCurrentUser && 'text-red-500'
                  )}
                  onClick={() => likeComment({commentId: comment.id})}
                />
                <p className="w-full text-sm font-semibold">
                  {comment.commentLikes.length}
                </p>
              </div>
            </div>
          ))
        )}
      </form>
    </Form>
  );
};

export default CommentForm;
