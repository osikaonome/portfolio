export const THEME_KEY = "theme";

/**
 * Runs before first paint (inlined in <head>) so an explicit choice never
 * flashes. "System" needs no script: the CSS media query handles it.
 */
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
