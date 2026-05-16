import { Component } from '@theme/component';

class CountdownTimer extends Component {
  #intervalId = null;

  connectedCallback() {
    super.connectedCallback();
    this.#startCountdown();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#stopCountdown();
  }

  #startCountdown() {
    this.#update();
    this.#intervalId = setInterval(() => this.#update(), 1000);
  }

  #stopCountdown() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  #update() {
    const targetDate = this.dataset.targetDate;
    if (!targetDate) return;

    const target = new Date(targetDate).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      this.#handleExpired();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.refs.days.textContent = String(days).padStart(2, '0');
    this.refs.hours.textContent = String(hours).padStart(2, '0');
    this.refs.minutes.textContent = String(minutes).padStart(2, '0');
    this.refs.seconds.textContent = String(seconds).padStart(2, '0');
  }

  #handleExpired() {
    this.#stopCountdown();

    if (this.refs.display) {
      this.refs.display.hidden = true;
    }

    if (this.refs.expiredMessage) {
      this.refs.expiredMessage.hidden = false;
    }

    if (this.hasAttribute('data-hide-when-expired')) {
      this.hidden = true;
    }
  }
}

if (!customElements.get('countdown-timer')) {
  customElements.define('countdown-timer', CountdownTimer);
}
