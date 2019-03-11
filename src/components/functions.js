/**
 * Format date
 *
 * @param {string} dateString
 * @param {bool} withDay
 * @returns {string}
 */
export function formatArticleDate(dateString, withDay = true) {
  const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  if (withDay) {
    return `${day} ${monthNames[monthIndex]} ${year}`;
  }

  return `${monthNames[monthIndex]} ${year}`;
}

/**
 * Check if element is visible in viewport
 * @param top
 * @param left
 * @param bottom
 * @param right
 * @param width
 * @param height
 * @param offset
 * @returns {boolean}
 */
export function isVisible({
  top, left, bottom, right, width, height
}, offset) {
  if (top + right + bottom + left === 0) {
    return false;
  }

  const html = document.documentElement;
  const windowWidth = window.innerWidth || html.clientWidth;
  const windowHeight = window.innerHeight || html.clientHeigh;

  const topThreshold = 0 - offset;
  const leftThreshold = 0 - offset;
  const widthCheck = windowWidth + offset;
  const heightCheck = windowHeight + offset;

  return top + height >= topThreshold
        && left + width >= leftThreshold
        && bottom - height <= heightCheck
        && right - width <= widthCheck;
}

/**
 * Detect if browser supports passive events
 * @returns {boolean}
 */
export function detectPassiveEvents() {
  let passive = false;

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    const options = Object.defineProperty({}, 'passive', {
      get() { passive = true; },
    });

    const noop = () => {};
    window.addEventListener('testPassiveEventSupport', noop, options);
    window.removeEventListener('testPassiveEventSupport', noop, options);
  }

  return passive;
}

/**
 * Check if dom available
 * @type {boolean}
 */
export const canUseDOM = !!(
  typeof window !== 'undefined'
    && window.document
    && window.document.createElement
);

let scrollbarSize;

export function getScrollbarSize(recalc) {
  if ((!scrollbarSize && scrollbarSize !== 0) || recalc) {
    if (canUseDOM) {
      const scrollDiv = document.createElement('div');

      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';

      document.body.appendChild(scrollDiv);
      scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }

  return scrollbarSize;
}