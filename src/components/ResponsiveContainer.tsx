import {cn} from '~/lib/utils';
import type {ReactNode} from 'react';

const ResponsiveContainer = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        'mx-auto h-full w-full max-w-screen-lg px-2.5 md:px-10',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
