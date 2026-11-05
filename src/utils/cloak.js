export const CLOAK_PROFILES = [
  {
    id: 'default',
    name: 'VaultArcade (Default)',
    title: 'VaultArcade - Unblocked Games Portal',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='20' height='12' x='2' y='6' rx='6'/><path d='M12 12h.01'/><path d='M17 12h.01'/><path d='M7 12h.01'/></svg>"
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Home - Classes',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%231E8E3E' d='M44 8H4c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4z'/><path fill='%23FFF' d='M24 24c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 4c-3.7 0-11 1.9-11 5.5V36h22v-2.5c0-3.6-7.3-5.5-11-5.5zm11-6c1.7 0 3-1.3 3-3s-1.3-3-3-3c-.4 0-.7.1-1 .2 1.2.9 2 2.3 2 3.8s-.8 2.9-2 3.8c.3.1.7.2 1 .2zm0 4c-1.3 0-2.8.3-4.2.8 1.9 1.1 3.2 2.8 3.2 4.7V34h7v-2.5c0-2.5-4.5-3.5-6-3.5z'/></svg>"
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 87.3 78'><path d='M6.6 66.85l3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l12.3-21.3H7.55c-1.3 0-2.5.3-3.6 1-1.1.6-2 1.5-2.6 2.6-.6 1.1-.9 2.3-.9 3.6.1 1.4.5 2.7 1.2 3.8l5 8.65z' fill='%230066da'/><path d='M43.65 25L29.1 0H14.5c-1.3 0-2.6.4-3.7 1.1-1.1.7-2 1.7-2.6 2.8L.7 20.25c-.7 1.1-1 2.4-1 3.7s.3 2.6 1 3.7L18.4 57.5h18.25L43.65 25z' fill='%2300ac47'/><path d='M73.55 76.8c1.3-.7 2.4-1.8 3.2-3.2l9.85-17.1c.7-1.1 1-2.4 1-3.7s-.3-2.6-1-3.7L72.05 25H53.8l12.3 21.3H40.85L53.15 70c1.2 1.9 2.9 3.4 5 4.3 2.1.9 4.4 1.2 6.7.7 2.3-.4 4.3-1.5 5.9-3.2l1.9-2z' fill='%23ea4335'/><path d='M43.65 25L58.2 0H29.1l14.55 25z' fill='%2300832d'/><path d='M53.8 25H72.05L57.5 0H42.95L53.8 25z' fill='%23ffba00'/><path d='M72.05 25H53.8L40.85 46.3h25.25L72.05 25z' fill='%232684fc'/></svg>"
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%234285F4' d='M30 4H10C7.8 4 6 5.8 6 8v32c0 2.2 1.8 4 4 4h28c2.2 0 4-1.8 4-4V16L30 4z'/><path fill='%23A1C2FA' d='M30 4v12h12L30 4z'/><path fill='%23FFF' d='M14 22h20v2H14zm0 6h20v2H14zm0 6h14v2H14z'/></svg>"
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E13F2B'><circle cx='12' cy='12' r='10'/><circle cx='12' cy='12' r='4' fill='%23FFF'/></svg>"
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231F75FE'><rect width='24' height='24' rx='4'/><path d='M6 16c2-4 4-8 6-8s4 8 6 8' stroke='%23FFF' stroke-width='2' fill='none'/></svg>"
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text y='18' font-size='18' font-family='serif' font-weight='bold' fill='%23FFF'>W</text></svg>"
  }
];

export function applyCloak(profile) {
  if (!profile) return;
  document.title = profile.title;
  const link = document.querySelector("link[id='dynamic-favicon']") || document.querySelector("link[rel*='icon']");
  if (link && profile.iconSvg) {
    link.href = profile.iconSvg;
  }
  localStorage.setItem('vaultarcade_cloak', profile.id);
}

export function loadSavedCloak() {
  const savedId = localStorage.getItem('vaultarcade_cloak') || 'default';
  const found = CLOAK_PROFILES.find((p) => p.id === savedId);
  return found || CLOAK_PROFILES[0];
}

export function triggerPanicRedirect(customUrl) {
  const target = customUrl || 'https://classroom.google.com';
  window.location.replace(target);
}

export function resolveGameUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const clean = url.replace(/^\.?\//, '');
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${clean}`;
}

export function openInAboutBlank(url, title) {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Pop-up blocked. Please allow popups for stealth mode.');
    return;
  }
  win.document.title = title;
  const iframe = win.document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  const resolvedUrl = resolveGameUrl(url);
  const fullUrl = new URL(resolvedUrl, window.location.href).href;
  iframe.src = fullUrl;
  win.document.body.style.margin = '0';
  win.document.body.style.overflow = 'hidden';
  win.document.body.appendChild(iframe);
}
