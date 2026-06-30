// Run in Chrome DevTools Console on Ads Manager (while logged in as mwixted1).
// Publishes all pending draft changes.
(() => {
  const match = [...document.querySelectorAll('div[role="button"], button, a')]
    .find((el) => /review and publish/i.test(el.textContent || ''));
  if (!match) {
    console.error('Review and publish button not found. Wait for page to finish loading.');
    return 'NOT_FOUND';
  }
  match.click();
  console.log('Clicked:', match.textContent.trim());
  setTimeout(() => {
    const confirm = [...document.querySelectorAll('div[role="button"], button')]
      .find((el) => /^(publish|confirm|publish all)/i.test((el.textContent || '').trim()));
    if (confirm) {
      confirm.click();
      console.log('Clicked confirm:', confirm.textContent.trim());
    }
  }, 2500);
  return 'CLICKED_REVIEW';
})();