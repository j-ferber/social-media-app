import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Toaster } from "~/components/ui/toaster";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerAuthSession()
  if (!session?.user) return redirect('/api/auth/signin')

  return (
    <main className="flex min-h-screen w-full flex-col bg-darkPurple items-center justify-center md:p-4">
      {children}
      <Toaster />
    </main>
  );
}