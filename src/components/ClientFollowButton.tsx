"use client"
import { Button } from './ui/button'
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTrigger, DialogTitle, DialogClose, DialogFooter } from './ui/dialog'

const ClientFollowButton = ({username, following} : {username: string, following: boolean}) => {

  const router = useRouter()

  const {mutate, isPending} = api.user.followUnfollowCurrentUser.useMutation({
    onSuccess: () => {
      router.refresh()
    }
  })

  const followOrUnfollowUser = () => {
    mutate({vUsername: username})
  }

  return (
    !following ? (
      <Button onClick={followOrUnfollowUser} disabled={isPending} variant={"secondary"}>Follow</Button>
    ) : (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"secondary"}>Unfollow</Button>
        </DialogTrigger>
        <DialogContent className='sm:wax-w-md'>
          <DialogHeader>
            <DialogTitle className='font-bold'>
              Unfollow {username}?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to unfollow {username}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='sm:justify-start'>
            <DialogClose asChild>
              <Button variant={"destructive"} onClick={followOrUnfollowUser} disabled={isPending}>Unfollow</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  )
}

export default ClientFollowButton