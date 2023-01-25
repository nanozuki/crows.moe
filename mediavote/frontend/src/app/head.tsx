import Script from 'next/script';

const adobeFont = `(function(d) {
    var config = {
      kitId: 'oza8qmh',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);`;

export default function Head() {
  return (
    <>
      <title>Exodus媒体艺术祭</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta property="og:title" content="Exodus媒体艺术祭" />
      <link rel="icon" href="/favicon.ico" />
      <Script id="adobe-font" dangerouslySetInnerHTML={{ __html: adobeFont }} />
    </>
  );
}
