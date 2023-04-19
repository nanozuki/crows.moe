import App from './App';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head />
      <body className="bg-base text-text min-h-screen">
        <div className="w-full pl-4 pr-4 max-w-screen-wide ml-auto mr-auto">
          <App>{children}</App>
        </div>
      </body>
    </html>
  );
}
