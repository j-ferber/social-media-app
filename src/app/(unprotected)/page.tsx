import Link from 'next/link';
import React from 'react';
import ResponsiveContainer from '~/components/ResponsiveContainer';
import {buttonVariants} from '~/components/ui/button';
import {Github} from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {getServerAuthSession} from '~/server/auth';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'A responsive full-stack social media web app.',
};

const About = async () => {
  const session = await getServerAuthSession();

  const techStack = [
    {
      name: 'TypeScript',
      description: 'Strongly typed code for easy maintainability.',
    },
    {
      name: 'Next.js 14',
      description: 'App router, nested layouts, and more.',
    },
    {
      name: 'Prisma',
      description: 'Type-safe ORM for PostgreSQL Database.',
    },
    {
      name: 'NextAuth.js',
      description: 'Authentication with OAuth providers.',
    },
    {
      name: 'TRPC',
      description: 'Type-safe API client and server.',
    },
    {
      name: 'Tailwind CSS',
      description: 'Utility class for components.',
    },
    {
      name: 'Zod',
      description: 'Type-safe schema validation.',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#543D7B]">
      <ResponsiveContainer className="flex flex-col items-center justify-center">
        <h1 className="my-6 text-center text-2xl font-bold text-white sm:text-5xl">
          A responsive full-stack social media web app.
        </h1>
        <div className="mb-6 flex w-full items-center justify-center gap-2">
          <Link
            className={buttonVariants({variant: 'default'})}
            href={session ? '/upload' : '/api/auth/signin'}
          >
            Get Started
          </Link>
          <Link
            className={buttonVariants({variant: 'secondary'})}
            href={'https://github.com/j-ferber'}
            target="_blank"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </div>
        <h1 className="mb-4 text-2xl tracking-wide text-white md:text-4xl">
          Technology Stack
        </h1>
        <div className="mb-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {techStack.map(tech => (
            <Card
              key={tech.name}
              className="mx-auto w-3/4 border-[#695593] bg-[#695593] sm:w-full"
            >
              <CardHeader>
                <CardTitle className="text-xl tracking-wide text-white md:text-lg">
                  {tech.name}
                </CardTitle>
                <CardDescription className="tracking-wide text-white">
                  {tech.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ResponsiveContainer>
    </main>
  );
};

export default About;
