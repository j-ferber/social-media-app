import React from 'react'
import NavbarLinks from './NavbarLinks'
import { getServerAuthSession } from '~/server/auth'
import { Card, CardHeader } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { api } from '~/trpc/server'
import { ModeToggle } from './ThemeToggle'
import { cn } from '~/lib/utils'
import SearchSheet from './SearchSheet'

const Navbar = async () => {

  const session = await getServerAuthSession()
  const userData = await api.user.getUserData()

  return (
    <nav className="md:w-[200px] bg-neutral-900 fixed left-0 top-0 bottom-0 p-4 md:flex hidden justify-between flex-col">
      <div className='grid grid-cols-1 gap-4'>
        <NavbarLinks />
        <SearchSheet />
      </div>
      {
        session?.user ? (
          <div className='w-full flex gap-2 flex-col'>
            <Card className='flex items-center justify-between p-2 gap-2'>
              {
                session.user.image ? (
                  <Avatar>
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>{session.user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarImage src='../images/avatar.png' />
                  </Avatar>
                )
              }
              <div className='flex-1'>
                <CardHeader className='p-0 truncate text-sm text-center'>
                  {userData?.username ? userData.username : session.user.name}
                </CardHeader>
              </div>
            </Card>
            <div className='flex gap-2 justify-center items-center w-full'>
              <Link className={cn(buttonVariants({variant: "secondary"}), "flex-1 flex")} href={"/api/auth/signout"}>
                Sign Out
              </Link>
              <ModeToggle />
            </div>
          </div>
        ) : (
          <Link className={buttonVariants({variant: "secondary"})} href={"/api/auth/signin"}>
            Sign In
          </Link>
        )
      } 
    </nav>
  )
}

export default Navbar