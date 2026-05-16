import { Component } from '@theme/component';

class TeamGrid extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#bindTouchEvents();
  }

  #bindTouchEvents() {
    /** @type {NodeListOf<HTMLElement>} */
    const cards = this.querySelectorAll('.team-grid__card');

    cards.forEach((card) => {
      card.addEventListener('touchstart', this.#handleTouch.bind(this), { passive: true });
    });

    document.addEventListener('touchstart', this.#handleDocumentTouch.bind(this), { passive: true });
  }

  /** @param {TouchEvent} event */
  #handleTouch(event) {
    const card = event.currentTarget;
    const wasActive = card.classList.contains('is-touched');

    this.querySelectorAll('.team-grid__card.is-touched').forEach((el) => {
      el.classList.remove('is-touched');
    });

    if (!wasActive) {
      card.classList.add('is-touched');
    }
  }

  /** @param {TouchEvent} event */
  #handleDocumentTouch(event) {
    if (!this.contains(event.target)) {
      this.querySelectorAll('.team-grid__card.is-touched').forEach((el) => {
        el.classList.remove('is-touched');
      });
    }
  }

  disconnectedCallback() {
    document.removeEventListener('touchstart', this.#handleDocumentTouch);
    super.disconnectedCallback();
  }
}

if (!customElements.get('team-grid')) {
  customElements.define('team-grid', TeamGrid);
}
