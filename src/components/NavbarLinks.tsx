'use client';

import {usePathname} from 'next/navigation';
import {Home, Compass} from 'lucide-react';
import Link from 'next/link';
import {cn} from '~/lib/utils';

const NavbarLinks = () => {
  const pathname = usePathname();

  const links = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="transition-all" />,
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: <Compass className="transition-all" />,
    },
  ];

  return (
    <ul className="flex flex-col gap-2">
      {links.map(link => (
        <li key={link.name} className="w-full">
          <Link
            className={cn(
              'flex h-full w-full items-center justify-center gap-3 rounded-xl p-4 font-semibold text-white transition-all duration-150 hover:bg-neutral-500',
              {'font-bold text-[#695593]': pathname === link.href}
            )}
            href={`${link.href}`}
          >
            {link.icon}
            <span className="text-lg transition-colors duration-200">
              {link.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavbarLinks;
