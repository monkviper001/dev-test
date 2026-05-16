import { Component } from '@theme/component';

/**
 * @typedef {Object} BestsellersTabsRefs
 * @property {NodeListOf<HTMLButtonElement>} tabs - Tab buttons
 * @property {NodeListOf<HTMLElement>} panels - Tab panels
 * @property {HTMLAnchorElement} [shopAllLink] - Shop All link
 */

/** @extends {Component<BestsellersTabsRefs>} */
class BestsellersTabs extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#bindEvents();
  }

  #bindEvents() {
    /** @type {NodeListOf<HTMLButtonElement>} */
    const tabs = this.querySelectorAll('[role="tab"]');
    /** @type {NodeListOf<HTMLButtonElement>} */
    const arrows = this.querySelectorAll('[data-direction]');

    for (const tab of tabs) {
      tab.addEventListener('click', this.#handleTabClick.bind(this));
      tab.addEventListener('keydown', this.#handleKeyDown.bind(this));
    }

    for (const arrow of arrows) {
      arrow.addEventListener('click', this.#handleArrowClick.bind(this));
    }
  }

  /** @param {MouseEvent} event */
  #handleTabClick(event) {
    this.#activateTab(/** @type {HTMLButtonElement} */ (event.currentTarget));
  }

  /** @param {KeyboardEvent} event */
  #handleKeyDown(event) {
    /** @type {HTMLButtonElement[]} */
    const tabs = Array.from(this.querySelectorAll('[role="tab"]'));
    const currentIndex = tabs.indexOf(/** @type {HTMLButtonElement} */ (event.currentTarget));
    let targetIndex;

    switch (event.key) {
      case 'ArrowRight':
        targetIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.#activateTab(tabs[targetIndex]);
    tabs[targetIndex].focus();
  }

  /** @param {HTMLButtonElement} selectedTab */
  #activateTab(selectedTab) {
    /** @type {NodeListOf<HTMLButtonElement>} */
    const tabs = this.querySelectorAll('[role="tab"]');
    /** @type {NodeListOf<HTMLElement>} */
    const panels = this.querySelectorAll('[role="tabpanel"]');
    /** @type {HTMLAnchorElement|null} */
    const shopAllLink = this.querySelector('[data-shop-all-link]');

    for (const tab of tabs) {
      const isSelected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      tab.classList.toggle('bestsellers-tabs__tab--active', isSelected);
    }

    for (const panel of panels) {
      const isActive = panel.id === selectedTab.getAttribute('aria-controls');
      panel.hidden = !isActive;
      panel.classList.toggle('bestsellers-tabs__panel--active', isActive);

      if (isActive) {
        const carousel = panel.querySelector('.bestsellers-tabs__carousel');

        if (carousel) {
          carousel.scrollLeft = 0;
        }
      }
    }

    if (shopAllLink) {
      const collectionUrl = selectedTab.dataset.collectionUrl;

      if (collectionUrl && collectionUrl !== '#') {
        shopAllLink.href = collectionUrl;
      }
    }
  }

  /** @param {MouseEvent} event */
  #handleArrowClick(event) {
    const direction = /** @type {HTMLButtonElement} */ (event.currentTarget).dataset.direction;
    const activePanel = this.querySelector('.bestsellers-tabs__panel--active');

    if (!activePanel) return;

    const carousel = activePanel.querySelector('.bestsellers-tabs__carousel');

    if (!carousel) return;

    const card = carousel.querySelector('.bestsellers-tabs__card');

    if (!card) return;

    const gap = parseInt(getComputedStyle(carousel).gap || '16', 10);
    const scrollAmount = card.offsetWidth + gap;

    carousel.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}

if (!customElements.get('bestsellers-tabs')) {
  customElements.define('bestsellers-tabs', BestsellersTabs);
}
