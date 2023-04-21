import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: '鸦之歌',
  description: "Nanozuki's personal website",
  openGraph: {
    title: '鸦之歌',
    description: "Nanozuki's personal website",
    type: 'website',
    locale: 'zh-CN',
    url: 'https://crows.moe',
  },
};

const adobeFont = `(function(d) {
    var config = {
      kitId: 'oza8qmh',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <Script
          id="adobe-font"
          dangerouslySetInnerHTML={{ __html: adobeFont }}
        />
      </head>
      <body className="w-full h-screen bg-base overflow-y-scroll">
        <div className="w-full pl-4 pr-4 max-w-screen-wide ml-auto mr-auto pt-12 pb-12 flex flex-col gap-y-12">
          {children}
        </div>
      </body>
    </html>
  );
}
