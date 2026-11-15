/**
 * Inline in <head> (app/layout.tsx):
 *   <head><script dangerouslySetInnerHTML={{ __html: prepaintScript }} /></head>
 * and put suppressHydrationWarning on <html>. Runs before first paint, so the
 * page is already in the right mode and the intro never flashes. Rename the
 * "portfolio-" keys to your site slug (same keys as site-store.ts).
 */
export const prepaintScript = `(()=>{try{var d=document.documentElement,p=JSON.parse(localStorage.getItem("portfolio-preferences")||"null")||{};d.dataset.mode=p.mode==="plain"?"plain":"themed";d.dataset.motion=p.motion===false?"off":"on";d.dataset.explain=localStorage.getItem("portfolio-explain")==="tech"?"tech":"plain";if(sessionStorage.getItem("portfolio-intro")||p.mode==="plain"||matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.intro="done";}catch(e){document.documentElement.dataset.intro="done"}})()`;
