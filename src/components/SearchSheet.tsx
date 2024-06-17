"use client"

import { Button } from "./ui/button"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormControl, FormDescription, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { useRouter, useSearchParams } from "next/navigation"

const usernameSchema = z.object({
  username: z.string().min(1).max(13, { message: "Username must be between 3 and 13 characters" }).regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers and underscores" }),
})

const SearchSheet = () => {

  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: ""
    }
  })

  function onSubmit(values: z.infer<typeof usernameSchema>) {
    const params = new URLSearchParams(searchParams)
    params.set('search', values.username)
    router.push(`/search?${params.toString()}`)
    form.reset()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-white text-lg"><Search /><span className="font-semibold ml-3">Search</span></Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-3">
        <SheetHeader>
          <SheetTitle>Search Usernames</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the username you want to search for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose>
                <Button type="submit" variant={"secondary"}>Search</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default SearchSheet