/**
 * Optionally disables common ways of inspecting the site (right-click context
 * menu, devtools keyboard shortcuts, view-source / save shortcuts).
 *
 * Toggled via the VITE_DISABLE_INSPECT env variable:
 *   VITE_DISABLE_INSPECT=true  -> inspection blocked
 *   VITE_DISABLE_INSPECT=false (or unset) -> inspection allowed
 *
 * Note: this is a deterrent only. It cannot truly prevent a determined user
 * from viewing client-side code, since all browser source is delivered to the
 * client. Treat it as friction, not real security.
 *
 * Returns a cleanup function that removes the listeners.
 */
export function setupDisableInspect(): () => void {
  if (import.meta.env.VITE_DISABLE_INSPECT !== 'true') {
    return () => {};
  }

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase();

    // F12 — open devtools
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }

    // Ctrl/Cmd+Shift+I / J / C — devtools / console / inspect element
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(key)) {
      e.preventDefault();
      return;
    }

    // Ctrl/Cmd+U — view source
    // Ctrl/Cmd+S — save page
    if ((e.ctrlKey || e.metaKey) && ['U', 'S'].includes(key)) {
      e.preventDefault();
    }
  };

  document.addEventListener('contextmenu', onContextMenu);
  document.addEventListener('keydown', onKeyDown);

  return () => {
    document.removeEventListener('contextmenu', onContextMenu);
    document.removeEventListener('keydown', onKeyDown);
  };
}
