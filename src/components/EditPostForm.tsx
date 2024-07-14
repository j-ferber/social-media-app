'use client';

import React from 'react';
import {api, type RouterOutputs} from '~/trpc/react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from './ui/form';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Input} from './ui/input';
import {Button} from './ui/button';
import {Label} from './ui/label';
import {useRouter} from 'next/navigation';
import {useToast} from './ui/use-toast';

type PostDataOutput = RouterOutputs['post']['getPostData'];

const editPostSchema = z.object({
  caption: z
    .string()
    .max(500, {message: 'Caption must be less than 500 characters'}),
});

const EditPostForm = ({post}: {post: PostDataOutput}) => {
  const editPostForm = useForm<z.infer<typeof editPostSchema>>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      caption: post.caption,
    },
  });

  const router = useRouter();
  const {toast} = useToast();

  const onSubmit = (values: z.infer<typeof editPostSchema>) => {
    mutate({postId: post.id, caption: values.caption});
  };

  const {mutate} = api.post.updatePost.useMutation({
    onSuccess: async () => {
      router.push(`/p/${post.id}`);
      toast({
        title: 'Post Updated',
        description: 'Your post has been updated successfully',
      });
    },
    onError: error => {
      toast({
        title: 'Post Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <Form {...editPostForm}>
      <form
        onSubmit={editPostForm.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <FormField
          control={editPostForm.control}
          name="caption"
          render={({field}) => (
            <FormItem>
              <Label>Caption</Label>
              <FormControl>
                <Input placeholder="Caption..." {...field} />
              </FormControl>
              <FormDescription>Add/Edit your caption here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={'secondary'}>
          Save
        </Button>
      </form>
    </Form>
  );
};

export default EditPostForm;
