import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="bg-base text-text min-h-screen">
        <div className="w-full pl-4 pr-4 max-w-screen-wide ml-auto mr-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
