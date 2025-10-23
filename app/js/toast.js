const Toast = {
  init() {
    this.container = document.getElementById('toastContainer');
  },

  show(message, type = 'info', duration = 3000) {
    const toast = this.createToast(message, type);
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 50);

    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  },

  error(message, duration = 3000) {
    this.show(message, 'error', duration);
  },

  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  },

  warn(message, duration = 3000) {
    this.show(message, 'warning', duration);
  },

  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  },

  createToast(message, type) {
    const toast = document.createElement('div');

    const baseClasses = [
      'transform', 'transition-all', 'duration-300', 'ease-in-out',
      'translate-x-full', 'opacity-0',
      'flex', 'items-center', 'gap-2', 'p-4', 'rounded-lg', 'shadow-lg',
      'min-w-[200px]', 'max-w-[300px]'
    ];

    const typeClasses = {
      success: ['bg-green-500', 'text-white'],
      error: ['bg-red-500', 'text-white'],
      warning: ['bg-yellow-500', 'text-white'],
      info: ['bg-blue-500', 'text-white']
    };

    const icons = {
      success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                     </svg>`,
      error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>`,
      warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                     </svg>`,
      info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                   </svg>`
    };

    toast.className = [...baseClasses, ...typeClasses[type]].join(' ');
    toast.innerHTML = `
            ${icons[type]}
            <span class="text-sm font-medium">${message}</span>
        `;

    return toast;
  }
};
