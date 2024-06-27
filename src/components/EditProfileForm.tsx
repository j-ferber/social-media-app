"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "./ui/use-toast";

export const EditProfileFormSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(13, { message: "Username must be between 3 and 13 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers and underscores" }),
  bio: z.string().trim().max(20),
});

export const ProfileForm = () => {

  const router = useRouter()
  const {data} = api.user.getUserData.useQuery()
  const {mutate} = api.user.editUserProfile.useMutation({
    onError: (error) => {
      toast({
        title: "Input Error",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  const defaultValues = useMemo(
    () => ({
      username: data?.username || "",
      bio: data?.bio || "" ,
    }),
    [data]
  )

  const form = useForm<z.infer<typeof EditProfileFormSchema>>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues
  })

  const onSubmit = (values: z.infer<typeof EditProfileFormSchema>) => {
    mutate(values, {onSuccess: () => {
      router.push(`/${values.username}`);
      router.refresh();
    }})
  }

  useEffect(() => {
    form.reset(defaultValues)
  }, [data])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>
                This is your display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({field}) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input placeholder="Enter bio" {...field} />
              </FormControl>
              <FormDescription>
                This bio is displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}