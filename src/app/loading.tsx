import React from 'react'
import { LoaderCircle } from 'lucide-react'

const Loading = () => {
  return (
    <div className='bg-darkPurple w-full min-h-screen flex justify-center items-center flex-col'>
      <h1 className='md:text-3xl text-xl text-white font-bold mb-2'>Loading...</h1>
      <LoaderCircle className='animate-spin text-white'/>
    </div>
  )
}

export default Loading