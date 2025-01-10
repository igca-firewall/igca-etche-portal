"use client"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 ; // Empty dependency array ensures this runs only once, after the component mounts

  return <main className="justify-center">{children}</main>;
}
