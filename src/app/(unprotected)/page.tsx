import Link from 'next/link'
import React from 'react'
import ResponsiveContainer from '~/components/ResponsiveContainer'
import { buttonVariants } from '~/components/ui/button'
import { Github } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { getServerAuthSession } from '~/server/auth'

const About = async () => {

  const session = await getServerAuthSession()

  const techStack = [
    {
      name: "TypeScript",
      description: "Strongly typed code for easy maintainability."
    },
    {
      name: "Next.js 14",
      description: "App router, nested layouts, and more."
    }, 
    {
      name: "Prisma",
      description: "Type-safe ORM for PostgreSQL Database."
    }, 
    {
      name: "NextAuth.js",
      description: "Authentication with OAuth providers."
    }, 
    {
      name: "TRPC",
      description: "Type-safe API client and server."
    }, 
    {
      name: "Tailwind CSS",
      description: "Utility class for components."
    }, 
    {
      name: "Zod",
      description: "Type-safe schema validation."
    }
  ]

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-[#543D7B]'>
      <ResponsiveContainer className='flex flex-col justify-center items-center'>
        <h1 className='text-center sm:text-5xl font-bold text-2xl my-6 text-white'>
          A responsive full-stack social media web app.
        </h1>
        <div className='w-full items-center justify-center flex gap-2 mb-6'>
          <Link className={buttonVariants({variant: 'default'})} href={session ? "/upload" : "/api/auth/signin"}>
            Get Started
          </Link>
          <Link className={buttonVariants({variant: 'secondary'})} href={"https://github.com/j-ferber"} target='_blank'>
            <Github className='w-4 h-4 mr-2'/>
            GitHub
          </Link>
        </div>
        <h1 className='md:text-4xl text-2xl text-white mb-4 tracking-wide'>Technology Stack</h1>
        <div className='w-full grid sm:grid-cols-2 gap-3 grid-cols-1 mb-4'>
          {
            techStack.map(tech => (
              <Card key={tech.name} className='sm:w-full w-3/4 mx-auto bg-[#695593] border-[#695593]'>
                <CardHeader>
                  <CardTitle className='md:text-lg text-xl tracking-wide text-white'>{tech.name}</CardTitle>
                  <CardDescription className='text-white tracking-wide'>{tech.description}</CardDescription>
                </CardHeader>
              </Card>
            ))
          }
        </div>
      </ResponsiveContainer>
    </main>
  )
}

export default About
