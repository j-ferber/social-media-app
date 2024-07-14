'use client';

import React, {useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {Button} from './ui/button';
import {SquarePlus} from 'lucide-react';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {Input} from './ui/input';
import {createPost, handleUpload} from '~/lib/upload/actions';
import {useToast} from './ui/use-toast';

export const uploadPostSchema = z.object({
  image: z
    .instanceof(File, {message: 'Please select an image'})
    .refine(file => file.size < 8000000, {
      message: 'Image must be less than 8MB',
    }),
  caption: z
    .string()
    .max(500, {message: 'Caption must be less than 500 characters'}),
});

const UploadDialog = () => {
  const [visualMedia, setVisualMedia] = useState<File | undefined>(undefined);
  const [visualMediaURL, setVisualMediaURL] = useState<string | undefined>(
    undefined
  );
  const [open, setOpen] = useState<boolean>(false);
  const {toast} = useToast();

  const postForm = useForm<z.infer<typeof uploadPostSchema>>({
    resolver: zodResolver(uploadPostSchema),
    defaultValues: {
      caption: '',
    },
  });

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  };

  const onSubmit = async (values: z.infer<typeof uploadPostSchema>) => {
    const checksum = await computeSHA256(values.image);
    const result = await handleUpload(
      values.image.type,
      values.image.size,
      checksum
    );
    if (result.failure !== undefined) {
      toast({
        title: 'Failure',
        description: result.failure,
        variant: 'destructive',
      });
      return;
    }

    const {url, mediaID} = result.success;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: values.image,
        headers: {
          'Content-Type': values.image.type,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
      await createPost(mediaID, values.caption);
    } catch (e) {
      toast({
        title: 'Failure',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    }
    setOpen(false);
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target;
    if (files === null) return;
    setVisualMedia(files[0]);

    if (visualMediaURL) {
      URL.revokeObjectURL(visualMediaURL);
    }

    if (files[0]) {
      const url = URL.createObjectURL(files[0]);
      setVisualMediaURL(url);
    } else {
      setVisualMediaURL(undefined);
    }
  };

  const handleCloseMedia = () => {
    setOpen(!open);
    if (open === false) {
      setVisualMedia(undefined);
      setVisualMediaURL(undefined);
      postForm.reset();
    }
  };

  return (
    <Dialog onOpenChange={() => handleCloseMedia()} open={open}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          className="flex h-full w-full items-center justify-center gap-3 rounded-xl p-4 font-semibold text-white transition-all duration-150 hover:bg-neutral-500"
        >
          <SquarePlus />
          <span className="text-lg text-white">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Create your post here</DialogDescription>
        </DialogHeader>
        <Form {...postForm}>
          <form
            onSubmit={postForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={postForm.control}
              name="image"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({field: {value, onChange, ...fieldProps}}) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...fieldProps}
                      onChange={async e => {
                        await handleMediaChange(e);
                        onChange(e.target.files?.[0]);
                      }}
                      accept="image/*"
                    />
                  </FormControl>
                  <FormDescription>Select an image to upload</FormDescription>
                  {visualMediaURL && visualMedia && (
                    <div className="flex items-center justify-center">
                      <img
                        src={visualMediaURL}
                        alt={visualMedia.name}
                        className="mt-4 h-48 w-48 rounded-sm object-cover"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={postForm.control}
              name="caption"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter caption" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a caption for your post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Upload</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
