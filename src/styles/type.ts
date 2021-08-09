const sans = 'font-family: alegreya-sans, source-han-sans-cjk-sc, sans-serif;';

const serif = 'font-family: yrsa, source-han-serif-sc, serif;';

const monospace = 'font-family: fira-mono, monospace;';

const adobeFonts = `
  (function(d) {
    var config = {
      kitId: 'oza8qmh',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);
`;

export {
  adobeFonts, sans, serif, monospace,
};
