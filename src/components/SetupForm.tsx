'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {Input} from './ui/input';
import {Button} from './ui/button';
import {api} from '~/trpc/react';
import {useToast} from './ui/use-toast';
import {useRouter} from 'next/navigation';

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(13, {message: 'Username must be between 3 and 13 characters'})
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers and underscores',
    }),
});

const SetupForm = () => {
  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: '',
    },
  });

  const {toast} = useToast();
  const router = useRouter();

  const {mutate} = api.user.changeUsername.useMutation({
    onSuccess: () => {
      toast({
        title: 'Username updated',
        description: 'Your username has been updated successfully.',
      });
      form.reset();
      router.push(`/`);
      router.refresh();
    },
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof usernameSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-5/6 space-y-8 rounded-lg bg-white p-6 dark:bg-neutral-900 md:w-4/5"
      >
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username:</FormLabel>
              <FormControl>
                <Input placeholder="John_Smith" {...field} />
              </FormControl>
              <FormDescription>
                This is your display name, it is required to access your
                profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SetupForm;
