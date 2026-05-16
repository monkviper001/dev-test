import { Component } from '@theme/component';

class ProteinTabs extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#bindEvents();
  }

  #bindEvents() {
    /** @type {NodeListOf<HTMLButtonElement>} */
    const tabs = this.querySelectorAll('[role="tab"]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', this.#handleTabClick.bind(this));
      tab.addEventListener('keydown', this.#handleKeyDown.bind(this));
    });
  }

  /** @param {MouseEvent} event */
  #handleTabClick(event) {
    const clickedTab = event.currentTarget;
    this.#activateTab(clickedTab);
  }

  /** @param {KeyboardEvent} event */
  #handleKeyDown(event) {
    /** @type {NodeListOf<HTMLButtonElement>} */
    const tabs = this.querySelectorAll('[role="tab"]');
    const tabsArray = Array.from(tabs);
    const currentIndex = tabsArray.indexOf(event.currentTarget);

    let targetIndex;

    switch (event.key) {
      case 'ArrowRight':
        targetIndex = (currentIndex + 1) % tabsArray.length;
        break;
      case 'ArrowLeft':
        targetIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = tabsArray.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.#activateTab(tabsArray[targetIndex]);
    tabsArray[targetIndex].focus();
  }

  /** @param {HTMLButtonElement} selectedTab */
  #activateTab(selectedTab) {
    /** @type {NodeListOf<HTMLButtonElement>} */
    const tabs = this.querySelectorAll('[role="tab"]');
    /** @type {NodeListOf<HTMLElement>} */
    const panels = this.querySelectorAll('[role="tabpanel"]');

    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      tab.classList.toggle('protein-tabs__tab--active', isSelected);
    });

    panels.forEach((panel) => {
      const isActive = panel.id === selectedTab.getAttribute('aria-controls');
      panel.hidden = !isActive;
      panel.classList.toggle('protein-tabs__panel--active', isActive);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}

if (!customElements.get('protein-tabs')) {
  customElements.define('protein-tabs', ProteinTabs);
}
