"use client"

import { usePathname } from "next/navigation"
import {Home, SquarePlus, User, Compass, NotebookText, Search} from 'lucide-react'
import Link from "next/link"
import { cn } from "~/lib/utils"

const NavbarLinks = () => {
  
  const pathname = usePathname()

  const links = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className='transition-all'/>
    },
    {
      name: 'Upload',
      href: '/upload',
      icon: <SquarePlus className='transition-all'/>
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: <Compass className='transition-all'/>
    },
    {
      name: 'About',
      href: '/about',
      icon: <NotebookText className='transition-all'/>
    },
  ]

  return (
      <ul className="flex flex-col gap-2">
        {
          links.map(link => (
            <li key={link.name} className='w-full'>
              <Link className={cn('w-full h-full hover:bg-neutral-500 flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-150 font-semibold text-white', {'text-[#695593] font-bold': pathname === link.href})} href={`${link.href}`}>
                {link.icon}
                <span className='text-lg transition-colors duration-200'>{link.name}</span>
              </Link>
            </li>
        ))}
      </ul>
  )
}

export default NavbarLinks