export function scrollToElement(id: string): void {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0 });
}
