class TabController {
  static activeTab = 'explorer';
  static explorerScrollPosition = null;

  static init() {
    const tabButtons = document.querySelectorAll('.tab-button');

    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
      this.activateTab(activeTab);
    }

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.switchTab(button);
      });
    });
  }

  static activateTab(selectedButton) {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove(
        'active',
        'border-blue-500',
        'border-b-2',
        'text-blue-600'
      );
      button.classList.add(
        'text-gray-500',
        'hover:text-gray-700',
        'hover:border-gray-300'
      );
    });

    selectedButton.classList.add(
      'active',
      'border-blue-500',
      'border-b-2',
      'text-blue-600'
    );
    selectedButton.classList.remove(
      'text-gray-500',
      'hover:text-gray-700',
      'hover:border-gray-300'
    );
  }

  static switchTab(selectedButton) {
    this.activateTab(selectedButton);

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });

    const tabId = selectedButton.dataset.tab;
    const content = document.getElementById(tabId);
    content.classList.remove('hidden');

    if (tabId === 'explorer' && this.explorerScrollPosition !== null) {
      console.log('Restoring explorer scroll position', this.explorerScrollPosition);
      setTimeout(() => {
        window.scrollTo({
          top: this.explorerScrollPosition,
          behavior: 'smooth'
        });
      }, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.activeTab = tabId;
  }

  static switchToTab(tabId) {
    const button = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (button) {
      this.switchTab(button);
    }
  }

  static storeExplorerPosition() {
    console.log('Storing explorer position');
    this.explorerScrollPosition = window.scrollY;
    console.log('Stored position:', this.explorerScrollPosition);
  }
}
