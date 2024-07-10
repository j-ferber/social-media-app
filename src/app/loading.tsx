import React from 'react';
import {LoaderCircle} from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-darkPurple">
      <h1 className="mb-2 text-xl font-bold text-white md:text-3xl">
        Loading...
      </h1>
      <LoaderCircle className="animate-spin text-white" />
    </div>
  );
};

export default Loading;
