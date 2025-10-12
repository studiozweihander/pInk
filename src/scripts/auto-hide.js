export class ControlsBarAutoHide {
  constructor() {
    this.controlsBar = document.querySelector('.controls-bar');
    this.container = document.querySelector('.container');
    this.scrollableContent = document.querySelector('.scrollable-content');

    if (!this.controlsBar || !this.container) return;

    this.lastScrollTop = 0;
    this.isHidden = false;
    this.scrollThreshold = 50;

    this.init();
  }

  init() {
    this.setupStyles();
    this.bindScrollListeners();
    window.addEventListener('resize', () => this.setupStyles());
  }

  setupStyles() {
    if (!this.controlsBar || !this.container) return;

    this.controlsBar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    this.container.style.transition = 'margin-top 0.3s ease';
    this.controlsBar.style.transform = 'translateY(0)';
    this.controlsBar.style.opacity = '1';
    this.container.style.marginTop = '';
  }

  bindScrollListeners() {
    const handleScroll = (scrollElement) => {
      const currentScrollTop = scrollElement === window
        ? window.pageYOffset || document.documentElement.scrollTop
        : scrollElement.scrollTop;

      this.onScroll(currentScrollTop);
    };

    if (this.scrollableContent) {
      this.scrollableContent.addEventListener('scroll', () => {
        handleScroll(this.scrollableContent);
      }, { passive: true });
    }
    window.addEventListener('scroll', () => {
      if (!this.scrollableContent || this.scrollableContent.scrollHeight <= this.scrollableContent.clientHeight) {
        handleScroll(window);
      }
    }, { passive: true });
  }

  onScroll(currentScrollTop) {
    if (currentScrollTop <= 10) {
      if (this.isHidden) {
        this.showControls();
      }
      this.lastScrollTop = currentScrollTop;
      return;
    }

    const scrollDifference = Math.abs(currentScrollTop - this.lastScrollTop);
    if (scrollDifference < this.scrollThreshold) {
      return;
    }

    const scrollDirection = currentScrollTop > this.lastScrollTop ? 'down' : 'up';

    if (scrollDirection === 'down' && !this.isHidden) {
      this.hideControls();
    } else if (scrollDirection === 'up' && this.isHidden) {
      this.showControls();
    }

    this.lastScrollTop = currentScrollTop;
  }

  hideControls() {
    if (!this.controlsBar || this.isHidden) return;

    const controlsBarHeight = this.controlsBar.offsetHeight - 16;

    this.controlsBar.style.transform = 'translateY(-100%)';
    this.controlsBar.style.opacity = '0';
    this.container.style.marginTop = `-${controlsBarHeight}px`;

    this.isHidden = true;
  }

  showControls() {
    if (!this.controlsBar || !this.isHidden) return;

    this.controlsBar.style.transform = 'translateY(0)';
    this.controlsBar.style.opacity = '1';
    this.container.style.marginTop = '';

    this.isHidden = false;
  }

  forceShow() {
    this.controlsBar.style.transform = 'translateY(0)';
    this.controlsBar.style.opacity = '1';
    this.container.style.marginTop = '';
    this.isHidden = false;
  }

  reset() {
    this.lastScrollTop = 0;
    this.isHidden = false;
    this.forceShow();
  }

  destroy() {
    if (this.controlsBar) {
      this.controlsBar.style.transform = '';
      this.controlsBar.style.opacity = '';
    }

    if (this.container) {
      this.container.style.marginTop = '';
    }
  }

  getState() {
    return {
      isHidden: this.isHidden,
      lastScrollTop: this.lastScrollTop,
      hasControlsBar: !!this.controlsBar,
      hasContainer: !!this.container,
      hasScrollableContent: !!this.scrollableContent
    };
  }

  setVisible(visible) {
    if (visible) {
      this.showControls();
    } else {
      this.hideControls();
    }
  }
}
