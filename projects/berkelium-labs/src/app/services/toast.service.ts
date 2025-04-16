import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export enum ToastType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum ToastPosition {
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_LEFT = 'bottom-left',
}

export interface ToastOptions {
  title: string;
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private renderer: Renderer2;
  private toastContainers: Map<ToastPosition, HTMLElement> = new Map();
  private defaultDuration = 1000000; // 10 seconds
  private defaultPosition = ToastPosition.TOP_RIGHT;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeContainers();
  }

  private initializeContainers(): void {
    // Create containers for each position
    Object.values(ToastPosition).forEach((position) => {
      const container = this.renderer.createElement('div');

      // Set positioning classes based on position
      this.renderer.addClass(container, 'fixed');
      this.renderer.addClass(container, 'z-50');
      this.renderer.addClass(container, 'flex');
      this.renderer.addClass(container, 'flex-col');
      this.renderer.addClass(container, 'gap-2');
      this.renderer.addClass(container, 'p-4');
      this.renderer.addClass(container, 'pointer-events-none');

      // Position-specific classes
      switch (position) {
        case ToastPosition.TOP_RIGHT:
          this.renderer.addClass(container, 'top-0');
          this.renderer.addClass(container, 'right-0');
          break;
        case ToastPosition.TOP_LEFT:
          this.renderer.addClass(container, 'top-0');
          this.renderer.addClass(container, 'left-0');
          break;
        case ToastPosition.BOTTOM_RIGHT:
          this.renderer.addClass(container, 'bottom-0');
          this.renderer.addClass(container, 'right-0');
          break;
        case ToastPosition.BOTTOM_LEFT:
          this.renderer.addClass(container, 'bottom-0');
          this.renderer.addClass(container, 'left-0');
          break;
      }

      // Add container to the document body
      this.renderer.appendChild(document.body, container);
      this.toastContainers.set(position, container);
    });
  }

  show(options: ToastOptions): void {
    const {
      title,
      message,
      type = ToastType.SUCCESS,
      duration = this.defaultDuration,
      position = this.defaultPosition,
    } = options;

    // Create the toast element
    const toast = this.renderer.createElement('div');
    //toast.popover = 'manual'; // Set as popover

    // Add styles for the toast
    this.renderer.addClass(toast, 'bg-gray-100');
    this.renderer.addClass(toast, 'dark:bg-gray-700');
    this.renderer.addClass(toast, 'rounded-lg');
    this.renderer.addClass(toast, 'shadow-lg');
    this.renderer.addClass(toast, 'p-4');
    this.renderer.addClass(toast, 'mb-3');
    this.renderer.addClass(toast, 'w-80');
    this.renderer.addClass(toast, 'pointer-events-auto');
    this.renderer.addClass(toast, 'flex');
    this.renderer.addClass(toast, 'flex-col');

    // Create toast content container
    const contentContainer = this.renderer.createElement('div');
    this.renderer.addClass(contentContainer, 'flex');
    this.renderer.addClass(contentContainer, 'items-start');

    // Create icon container
    const iconContainer = this.renderer.createElement('div');
    this.renderer.addClass(iconContainer, 'flex-shrink-0');

    // Icon circle with appropriate color
    const iconCircle = this.renderer.createElement('div');
    this.renderer.addClass(iconCircle, 'flex');
    this.renderer.addClass(iconCircle, 'items-center');
    this.renderer.addClass(iconCircle, 'justify-center');
    this.renderer.addClass(iconCircle, 'w-8');
    this.renderer.addClass(iconCircle, 'h-8');
    this.renderer.addClass(iconCircle, 'rounded-full');

    // Create icon element
    const icon = this.renderer.createElement('span');
    this.renderer.addClass(icon, 'material-icons');
    this.renderer.addClass(icon, 'text-white');
    // this.renderer.addClass(icon, '!text-lg');

    // Set icon and color based on type
    switch (type) {
      case ToastType.SUCCESS:
        this.renderer.addClass(iconCircle, 'bg-green-500');
        this.renderer.setProperty(icon, 'textContent', 'check_circle');
        break;
      case ToastType.WARNING:
        this.renderer.addClass(iconCircle, 'bg-yellow-500');
        this.renderer.setProperty(icon, 'textContent', 'warning');
        break;
      case ToastType.ERROR:
        this.renderer.addClass(iconCircle, 'bg-red-500');
        this.renderer.setProperty(icon, 'textContent', 'error');
        break;
    }

    // Append icon to circle and circle to container
    this.renderer.appendChild(iconCircle, icon);
    this.renderer.appendChild(iconContainer, iconCircle);
    this.renderer.appendChild(contentContainer, iconContainer);

    // Create text content
    const textContainer = this.renderer.createElement('div');
    this.renderer.addClass(textContainer, 'ml-3');
    this.renderer.addClass(textContainer, 'w-0');
    this.renderer.addClass(textContainer, 'flex-1');

    const titleElement = this.renderer.createElement('p');
    this.renderer.addClass(titleElement, 'text-sm');
    this.renderer.addClass(titleElement, 'font-medium');
    this.renderer.setProperty(titleElement, 'textContent', title);

    const messageElement = this.renderer.createElement('p');
    this.renderer.addClass(messageElement, 'mt-1');
    this.renderer.addClass(messageElement, 'text-sm');
    this.renderer.setProperty(messageElement, 'textContent', message);

    // Append title and message to text container
    this.renderer.appendChild(textContainer, titleElement);
    this.renderer.appendChild(textContainer, messageElement);
    this.renderer.appendChild(contentContainer, textContainer);

    // Create close button
    const closeButtonContainer = this.renderer.createElement('div');
    this.renderer.addClass(closeButtonContainer, 'ml-4');
    this.renderer.addClass(closeButtonContainer, 'flex-shrink-0');
    this.renderer.addClass(closeButtonContainer, 'flex');

    const closeButton = this.renderer.createElement('button');
    this.renderer.addClass(closeButton, 'bg-transparent');
    this.renderer.addClass(closeButton, 'rounded-full');
    this.renderer.addClass(closeButton, 'inline-flex');
    this.renderer.addClass(closeButton, 'text-gray-500');
    this.renderer.addClass(closeButton, 'dark:text-gray-400');
    this.renderer.addClass(closeButton, 'hover:bg-gray-200');
    this.renderer.addClass(closeButton, 'dark:hover:bg-gray-100');
    this.renderer.addClass(closeButton, 'cursor-pointer');
    this.renderer.addClass(closeButton, 'focus:outline-none');

    const closeIcon = this.renderer.createElement('span');
    this.renderer.addClass(closeIcon, 'material-icons');
    this.renderer.setProperty(closeIcon, 'textContent', 'close');
    // this.renderer.addClass(closeIcon, '!text-lg');

    this.renderer.appendChild(closeButton, closeIcon);
    this.renderer.appendChild(closeButtonContainer, closeButton);
    this.renderer.appendChild(contentContainer, closeButtonContainer);

    // Add content to toast
    this.renderer.appendChild(toast, contentContainer);

    // Get container based on position
    const container = this.toastContainers.get(position);

    // Prepend toast to container (newest on top)
    this.renderer.insertBefore(container, toast, container?.firstChild);

    // Show the toast using Popover API
    toast.showPopover();

    // Set up close button event
    closeButton.addEventListener('click', () => {
      toast.hidePopover();
      this.removeToast(toast, container);
    });

    // Auto hide after duration
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.hidePopover();
        this.removeToast(toast, container);
      }
    }, duration);
  }

  private removeToast(
    toast: HTMLElement,
    container: HTMLElement | undefined
  ): void {
    // Add fade-out animation
    this.renderer.addClass(toast, 'opacity-0');
    this.renderer.setStyle(toast, 'transition', 'opacity 150ms ease-out');

    // Remove from DOM after animation
    setTimeout(() => {
      if (container?.contains(toast)) {
        this.renderer.removeChild(container, toast);
      }
    }, 150);
  }

  // Helper methods for common toast types
  success(
    title: string,
    message: string,
    options?: Partial<Omit<ToastOptions, 'title' | 'message' | 'type'>>
  ): void {
    this.show({
      title,
      message,
      type: ToastType.SUCCESS,
      ...options,
    });
  }

  warning(
    title: string,
    message: string,
    options?: Partial<Omit<ToastOptions, 'title' | 'message' | 'type'>>
  ): void {
    this.show({
      title,
      message,
      type: ToastType.WARNING,
      ...options,
    });
  }

  error(
    title: string,
    message: string,
    options?: Partial<Omit<ToastOptions, 'title' | 'message' | 'type'>>
  ): void {
    this.show({
      title,
      message,
      type: ToastType.ERROR,
      ...options,
    });
  }

  // Set default properties
  setDefaultDuration(duration: number): void {
    this.defaultDuration = duration;
  }

  setDefaultPosition(position: ToastPosition): void {
    this.defaultPosition = position;
  }
}
