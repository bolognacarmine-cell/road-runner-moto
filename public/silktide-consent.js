// Silktide Consent Manager - https://silktide.com/consent-manager/
// Local Implementation based on provided class structure

class SilktideCookieBanner {
  constructor(config) {
    this.config = config || {};
    this.wrapper = null;
    this.banner = null;
    this.modal = null;
    this.cookieIcon = null;
    this.backdrop = null;

    this.init();
  }

  init() {
    this.createWrapper();

    if (this.shouldShowBackdrop()) {
      this.createBackdrop();
    }

    this.createCookieIcon();
    this.createModal();

    if (this.shouldShowBanner()) {
      this.createBanner();
      this.showBackdrop();
    } else {
      this.showCookieIcon();
    }

    this.setupEventListeners();

    if (this.hasSetInitialCookieChoices()) {
      this.loadRequiredCookies();
      this.runAcceptedCookieCallbacks();
    }
  }

  destroyCookieBanner() {
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.removeChild(this.wrapper);
    }
    this.allowBodyScroll();
    this.wrapper = null;
    this.banner = null;
    this.modal = null;
    this.cookieIcon = null;
    this.backdrop = null;
  }

  createWrapper() {
    this.wrapper = document.getElementById('silktide-wrapper');
    if (!this.wrapper) {
      this.wrapper = document.createElement('div');
      this.wrapper.id = 'silktide-wrapper';
      document.body.insertBefore(this.wrapper, document.body.firstChild);
    }
  }

  createWrapperChild(htmlContent, id) {
    const child = document.createElement('div');
    child.id = id;
    if (htmlContent) {
      child.innerHTML = htmlContent;
    }
    if (!this.wrapper || !document.body.contains(this.wrapper)) {
      this.createWrapper();
    }
    this.wrapper.appendChild(child);
    return child;
  }

  createBackdrop() {
    this.backdrop = this.createWrapperChild(null, 'silktide-backdrop');
  }

  showBackdrop() {
    if (this.backdrop) {
      this.backdrop.style.display = 'block';
    }
    if (typeof this.config.onBackdropOpen === 'function') {
      this.config.onBackdropOpen();
    }
  }

  hideBackdrop() {
    if (this.backdrop) {
      this.backdrop.style.display = 'none';
    }
    if (typeof this.config.onBackdropClose === 'function') {
      this.config.onBackdropClose();
    }
  }

  shouldShowBackdrop() {
    return this.config?.background?.showBackground || false;
  }

  updateCheckboxState(saveToStorage = false) {
    if (!this.modal) return;
    const preferencesSection = this.modal.querySelector('#cookie-preferences');
    if (!preferencesSection) return;
    const checkboxes = preferencesSection.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      const idParts = checkbox.id.split('cookies-');
      const cookieId = idParts[1];
      const cookieType = this.config.cookieTypes.find(type => type.id === cookieId);
      
      if (!cookieType) return;

      if (saveToStorage) {
        const currentState = checkbox.checked;
        if (cookieType.required) {
          localStorage.setItem(`silktideCookieChoice_${cookieId}${this.getBannerSuffix()}`, 'true');
        } else {
          localStorage.setItem(`silktideCookieChoice_${cookieId}${this.getBannerSuffix()}`, currentState.toString());
          if (currentState && typeof cookieType.onAccept === 'function') {
            cookieType.onAccept();
          } else if (!currentState && typeof cookieType.onReject === 'function') {
            cookieType.onReject();
          }
        }
      } else {
        if (cookieType.required) {
          checkbox.checked = true;
          checkbox.disabled = true;
        } else {
          const storedValue = localStorage.getItem(`silktideCookieChoice_${cookieId}${this.getBannerSuffix()}`);
          if (storedValue !== null) {
            checkbox.checked = storedValue === 'true';
          } else {
            checkbox.checked = !!cookieType.defaultValue;
          }
        }
      }
    });
  }

  setInitialCookieChoiceMade() {
    window.localStorage.setItem(`silktideCookieBanner_InitialChoice${this.getBannerSuffix()}`, '1');
  }

  handleCookieChoice(accepted) {
    this.setInitialCookieChoiceMade();
    this.removeBanner();
    this.hideBackdrop();
    this.toggleModal(false);
    this.showCookieIcon();

    this.config.cookieTypes.forEach((type) => {
      if (type.required === true) {
        localStorage.setItem(`silktideCookieChoice_${type.id}${this.getBannerSuffix()}`, 'true');
        if (typeof type.onAccept === 'function') { type.onAccept() }
      } else {
        localStorage.setItem(`silktideCookieChoice_${type.id}${this.getBannerSuffix()}`, accepted.toString());
        if (accepted) {
          if (typeof type.onAccept === 'function') { type.onAccept(); }
        } else {
          if (typeof type.onReject === 'function') { type.onReject(); }
        }
      }
    });

    if (accepted && typeof this.config.onAcceptAll === 'function') {
      this.config.onAcceptAll();
    } else if (!accepted && typeof this.config.onRejectAll === 'function') {
      this.config.onRejectAll();
    }

    this.updateCheckboxState();
  }

  getAcceptedCookies() {
    return (this.config.cookieTypes || []).reduce((acc, cookieType) => {
      acc[cookieType.id] = localStorage.getItem(`silktideCookieChoice_${cookieType.id}${this.getBannerSuffix()}`) === 'true';
      return acc;
    }, {});
  }

  getRejectedCookies() {
    const accepted = this.getAcceptedCookies();
    const rejected = {};
    for (const key in accepted) {
      rejected[key] = !accepted[key];
    }
    return rejected;
  }

  runAcceptedCookieCallbacks() {
    if (!this.config.cookieTypes) return;
    const acceptedCookies = this.getAcceptedCookies();
    this.config.cookieTypes.forEach((type) => {
      if (type.required) return;
      if (acceptedCookies[type.id] && typeof type.onAccept === 'function') {
        type.onAccept();
      }
    });
  }

  loadRequiredCookies() {
    if (!this.config.cookieTypes) return;
    this.config.cookieTypes.forEach((cookie) => {
      if (cookie.required && typeof cookie.onAccept === 'function') {
        cookie.onAccept();
      }
    });
  }

  getBannerSuffix() {
    return ''; // Can be customized per site if needed
  }

  getBannerContent() {
    const bannerDescription = this.config.text?.banner?.description || "<p>We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic.</p>";
    const acceptAllButtonText = this.config.text?.banner?.acceptAllButtonText || 'Accept all';
    const rejectNonEssentialButtonText = this.config.text?.banner?.rejectNonEssentialButtonText || 'Reject non-essential';
    const preferencesButtonText = this.config.text?.banner?.preferencesButtonText || 'Preferences';

    return `
      ${bannerDescription}
      <div class="actions">
        <button class="accept-all st-button st-button--primary">${acceptAllButtonText}</button>
        <button class="reject-all st-button st-button--primary">${rejectNonEssentialButtonText}</button>
        <div class="actions-row">
          <button class="preferences"><span>${preferencesButtonText}</span></button>
          <a class="silktide-logo" href="https://silktide.com/consent-manager" target="_blank" rel="noreferrer" aria-label="Visit the Silktide Consent Manager page">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="inherit"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1096 16.7745C13.8895 17.2055 13.3537 17.3805 12.9129 17.1653L8.28443 14.9055L2.73192 17.7651L11.1025 21.9814C11.909 22.3876 12.8725 22.3591 13.6524 21.9058L20.4345 17.9645C21.2845 17.4704 21.7797 16.5522 21.7164 15.5872L21.7088 15.4704C21.6487 14.5561 21.0962 13.7419 20.2579 13.3326L15.6793 11.0972L10.2283 13.9045L13.71 15.6043C14.1507 15.8195 14.3297 16.3434 14.1096 16.7745ZM8.2627 12.9448L13.7136 10.1375L10.2889 8.46543C9.84803 8.25021 9.66911 7.72629 9.88916 7.29524C10.1093 6.86417 10.6451 6.68921 11.0859 6.90442L15.6575 9.13647L21.2171 6.27325L12.8808 2.03496C12.0675 1.62147 11.0928 1.65154 10.3078 2.11432L3.54908 6.09869C2.70732 6.59492 2.21846 7.50845 2.28139 8.46761L2.29003 8.59923C2.35002 9.51362 2.9026 10.3278 3.7409 10.7371L8.2627 12.9448ZM6.31884 13.9458L2.94386 12.2981C1.53727 11.6113 0.610092 10.2451 0.509431 8.71094L0.500795 8.57933C0.3952 6.96993 1.21547 5.4371 2.62787 4.60447L9.38662 0.620092C10.7038 -0.156419 12.3392 -0.206861 13.7039 0.486938L23.3799 5.40639C23.4551 5.44459 23.5224 5.4918 23.5811 5.54596C23.7105 5.62499 23.8209 5.73754 23.897 5.87906C24.1266 6.30534 23.9594 6.83293 23.5234 7.05744L17.6231 10.0961L21.0549 11.7716C22.4615 12.4583 23.3887 13.8245 23.4893 15.3587L23.497 15.4755C23.6033 17.0947 22.7724 18.6354 21.346 19.4644L14.5639 23.4057C13.2554 24.1661 11.6386 24.214 10.2854 23.5324L0.621855 18.6649C0.477299 18.592 0.361696 18.4859 0.279794 18.361C0.210188 18.2968 0.150054 18.2204 0.10296 18.133C-0.126635 17.7067 0.0406445 17.1792 0.47659 16.9546L6.31884 13.9458Z" fill="inherit"/></svg>
          </a>
        </div>
      </div>
    `;
  }

  hasSetInitialCookieChoices() {
    return !!localStorage.getItem(`silktideCookieBanner_InitialChoice${this.getBannerSuffix()}`);
  }

  createBanner() {
    this.banner = this.createWrapperChild(this.getBannerContent(), 'silktide-banner');
    if (this.banner && this.config.position?.banner) {
      this.banner.classList.add(this.config.position.banner);
    }
    if (this.banner && typeof this.config.onBannerOpen === 'function') {
      this.config.onBannerOpen();
    }
  }

  removeBanner() {
    if (this.banner && this.banner.parentNode) {
      this.banner.parentNode.removeChild(this.banner);
      this.banner = null;
      if (typeof this.config.onBannerClose === 'function') {
        this.config.onBannerClose();
      }
    }
  }

  shouldShowBanner() {
    if (this.config.showBanner === false) return false;
    return localStorage.getItem(`silktideCookieBanner_InitialChoice${this.getBannerSuffix()}`) === null;
  }

  getModalContent() {
    const preferencesTitle = this.config.text?.preferences?.title || 'Customize your cookie preferences';
    const preferencesDescription = this.config.text?.preferences?.description || "<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>";
    const acceptAllButtonText = this.config.text?.banner?.acceptAllButtonText || 'Accept all';
    const rejectNonEssentialButtonText = this.config.text?.banner?.rejectNonEssentialButtonText || 'Reject non-essential';
    const creditLinkText = this.config.text?.preferences?.creditLinkText || 'Get this banner for free';

    const cookieTypes = this.config.cookieTypes || [];
    const acceptedCookieMap = this.getAcceptedCookies();

    return `
      <header>
        <h1>${preferencesTitle}</h1>
        <button class="modal-close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.4081 3.41559C20.189 2.6347 20.189 1.36655 19.4081 0.585663C18.6272 -0.195221 17.3591 -0.195221 16.5782 0.585663L10 7.17008L3.41559 0.59191C2.6347 -0.188974 1.36655 -0.188974 0.585663 0.59191C-0.195221 1.37279 -0.195221 2.64095 0.585663 3.42183L7.17008 10L0.59191 16.5844C-0.188974 17.3653 -0.188974 18.6335 0.59191 19.4143C1.37279 20.1952 2.64095 20.1952 3.42183 19.4143L10 12.8299L16.5844 19.4081C17.3653 20.189 18.6335 20.189 19.4143 19.4081C20.1952 18.6272 20.1952 17.3591 19.4143 16.5782L12.8299 10L19.4081 3.41559Z" fill="currentColor"/>
          </svg>
        </button>
      </header>
      ${preferencesDescription}
      <section id="cookie-preferences">
        ${cookieTypes.map((type) => {
          const accepted = acceptedCookieMap[type.id];
          let isChecked = accepted || (!this.hasSetInitialCookieChoices() && type.defaultValue);
          return `
            <fieldset>
              <legend>${type.name}</legend>
              <div class="cookie-type-content">
                <div class="cookie-type-description">${type.description}</div>
                <label class="switch" for="cookies-${type.id}">
                  <input type="checkbox" id="cookies-${type.id}" ${type.required ? 'checked disabled' : isChecked ? 'checked' : ''} />
                  <span class="switch__pill"></span>
                  <span class="switch__dot"></span>
                  <span class="switch__off">Off</span>
                  <span class="switch__on">On</span>
                </label>
              </div>
            </fieldset>
          `;
        }).join('')}
      </section>
      <footer>
        <button class="preferences-accept-all st-button st-button--primary">${acceptAllButtonText}</button>
        <button class="preferences-reject-all st-button st-button--primary">${rejectNonEssentialButtonText}</button>
        <a href="https://silktide.com/consent-manager" target="_blank" rel="noreferrer">${creditLinkText}</a>
      </footer>
    `;
  }

  createModal() {
    this.modal = this.createWrapperChild(this.getModalContent(), 'silktide-modal');
  }

  toggleModal(show) {
    if (!this.modal) return;
    this.modal.style.display = show ? 'flex' : 'none';

    if (show) {
      this.showBackdrop();
      this.hideCookieIcon();
      this.removeBanner();
      this.preventBodyScroll();
      const closeBtn = this.modal.querySelector('.modal-close');
      if (closeBtn) closeBtn.focus();
      if (typeof this.config.onPreferencesOpen === 'function') {
        this.config.onPreferencesOpen();
      }
      this.updateCheckboxState(false);
    } else {
      this.allowBodyScroll();
      if (!this.shouldShowBanner()) {
        this.showCookieIcon();
      }
      this.hideBackdrop();
      if (typeof this.config.onPreferencesClose === 'function') {
        this.config.onPreferencesClose();
      }
    }
  }

  createCookieIcon() {
    const iconContent = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.5 21.6 11.1 21.1 11.1C19.4 11.1 18 9.7 18 8C18 7.5 17.6 7.1 17.1 7.1C15.4 7.1 14 5.7 14 4C14 3.5 13.6 3.1 13.1 3.1C12.7 3.1 12.3 2.6 12.3 2.1C12.3 2 12.2 2 12 2Z" fill="currentColor"/>
      </svg>
    `;
    this.cookieIcon = this.createWrapperChild(iconContent, 'silktide-cookie-icon');
    if (this.cookieIcon && this.config.cookieIcon?.position) {
      const pos = this.config.cookieIcon.position;
      if (pos === 'bottom-left') this.cookieIcon.classList.add('bottomLeft');
      if (pos === 'bottom-right') this.cookieIcon.classList.add('bottomRight');
    }
  }

  showCookieIcon() {
    if (this.cookieIcon) this.cookieIcon.style.display = 'flex';
  }

  hideCookieIcon() {
    if (this.cookieIcon) this.cookieIcon.style.display = 'none';
  }

  preventBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  allowBodyScroll() {
    document.body.style.overflow = '';
  }

  setupEventListeners() {
    this.wrapper.addEventListener('click', (e) => {
      if (e.target.closest('.accept-all') || e.target.closest('.preferences-accept-all')) {
        this.handleCookieChoice(true);
      } else if (e.target.closest('.reject-all') || e.target.closest('.preferences-reject-all')) {
        this.handleCookieChoice(false);
      } else if (e.target.closest('.preferences')) {
        this.toggleModal(true);
      } else if (e.target.closest('.modal-close')) {
        this.toggleModal(false);
      } else if (e.target.closest('#silktide-cookie-icon')) {
        this.toggleModal(true);
      }
    });

    const checkboxes = this.wrapper.querySelectorAll('#cookie-preferences input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => this.updateCheckboxState(true));
    });
  }

  updateCookieBannerConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.destroyCookieBanner();
    this.init();
  }
}

// Global instance manager
window.silktideCookieBannerManager = {
  instance: null,
  init: function(config) {
    this.instance = new SilktideCookieBanner(config);
    return this.instance;
  },
  updateCookieBannerConfig: function(config) {
    if (this.instance) {
      this.instance.updateCookieBannerConfig(config);
    } else {
      this.init(config);
    }
  }
};
