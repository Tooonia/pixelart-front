import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export interface CanvasSetupOptions {
  width: number;
  height: number;
  containerElement: HTMLElement;
  pixelData?: number[]; // RGBA pixel data from backend
  enableAutoResize?: boolean;
}

export interface CanvasSetupResult {
  scale: number;
  displayWidth: number;
  displayHeight: number;
  context: CanvasRenderingContext2D | null;
  cleanup?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private renderer: Renderer2;
  private resizeObservers = new Map<HTMLCanvasElement, ResizeObserver>();

  constructor(private rendererFactory: RendererFactory2) {
    // Create a renderer without a specific component
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Calculate the optimal scale to fit canvas in container
   * Uses 95% of available space for padding
   */
  calculateScale(
    canvasWidth: number,
    canvasHeight: number,
    containerWidth: number,
    containerHeight: number,
    padding: number = 0.95
  ): number {
    const availableWidth = containerWidth * padding;
    const availableHeight = containerHeight * padding;

    const scaleX = availableWidth / canvasWidth;
    const scaleY = availableHeight / canvasHeight;

    // Use smaller scale to ensure it fits both dimensions
    return Math.min(scaleX, scaleY);
  }

  /**
   * Set up canvas with proper sizing using CSS width/height
   * This method properly handles layout flow
   * Can automatically handle resize if enableAutoResize is true
   *
   * @param canvasElement - The HTML canvas element
   * @param options - Width, height, container dimensions, and optional pixel data
   * @returns - Setup result with scale and context
   */
  setupCanvas(
    canvasElement: HTMLCanvasElement,
    options: CanvasSetupOptions
  ): CanvasSetupResult {
    const { width, height, containerElement, pixelData, enableAutoResize = false } = options;

    // Set canvas pixel dimensions (for accurate drawing)
    canvasElement.width = width;
    canvasElement.height = height;

    // Get container size
    const containerRect = containerElement.getBoundingClientRect();

    // Calculate scale and display size
    const scale = this.calculateScale(width, height, containerRect.width, containerRect.height);
    const displayWidth = width * scale;
    const displayHeight = height * scale;

    // Apply CSS dimensions (this affects layout flow correctly)
    this.renderer.setStyle(canvasElement, 'width', `${displayWidth}px`);
    this.renderer.setStyle(canvasElement, 'height', `${displayHeight}px`);
    this.renderer.setStyle(canvasElement, 'display', 'block');

    // Get context
    const context = canvasElement.getContext('2d');

    // Render pixel data if provided
    if (pixelData && context) {
      this.renderPixelData(canvasElement, context, pixelData);
    }

    // Set up auto-resize if enabled
    let cleanup: (() => void) | undefined;
    if (enableAutoResize) {
      cleanup = this.enableAutoResize(canvasElement, containerElement);
    }

    return {
      scale,
      displayWidth,
      displayHeight,
      context,
      cleanup
    };
  }

  /**
   * Enable automatic resize handling
   * Returns cleanup function to stop observing
   */
  private enableAutoResize(
    canvasElement: HTMLCanvasElement,
    containerElement: HTMLElement
  ): () => void {
    // Check if ResizeObserver is available
    if (typeof ResizeObserver === 'undefined') {
      console.warn('ResizeObserver not supported. Auto-resize disabled.');
      return () => {};
    }

    // Clean up any existing observer for this canvas
    this.disableAutoResize(canvasElement);

    let resizeTimeout: any;

    // Create resize observer
    const observer = new ResizeObserver((entries) => {
      // Debounce - wait 150ms after resize stops
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        for (const entry of entries) {
          const containerRect = entry.contentRect;
          this.updateCanvasSize(
            canvasElement,
            containerRect.width,
            containerRect.height
          );
        }
      }, 150);
    });

    // Observe the container
    observer.observe(containerElement);

    // Store observer for cleanup
    this.resizeObservers.set(canvasElement, observer);

    // Return cleanup function
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      this.disableAutoResize(canvasElement);
    };
  }

  /**
   * Disable auto-resize for a canvas
   */
  disableAutoResize(canvasElement: HTMLCanvasElement): void {
    const observer = this.resizeObservers.get(canvasElement);
    if (observer) {
      observer.disconnect();
      this.resizeObservers.delete(canvasElement);
    }
  }

  /**
   * Render pixel data from backend onto canvas
   *
   * @param canvasElement - Canvas to render to
   * @param context - Canvas 2D context
   * @param pixelData - RGBA pixel data array from backend
   */
  renderPixelData(
    canvasElement: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    pixelData: number[]
  ): void {
    // Create ImageData with canvas dimensions
    const imageData = new ImageData(canvasElement.width, canvasElement.height);

    // Copy pixel data
    for (let i = 0; i < imageData.data.length && i < pixelData.length; i++) {
      if (pixelData[i] >= 0 && pixelData[i] <= 255) {
        imageData.data[i] = pixelData[i];
      }
    }

    // Draw to canvas
    context.putImageData(imageData, 0, 0);
  }

  /**
   * Create checkerboard grid background (gray/white pattern)
   * using ImageData for direct pixel manipulation.
   *
   * @param canvasElement - Canvas to draw grid on
   * @param context - Canvas 2D context
   * @param [lightRGB={ r: 255, g: 255, b: 255 }]
   * @param [darkRGB={ r: 211, g: 211, b: 211 }]
   */
  createCheckerboardGrid(
    canvasElement: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    // Applying 'white' and 'lightgrey' to pixel items with RGBA pixel data
    lightRGB: { r: number, g: number, b: number } = { r: 255, g: 255, b: 255 },
    darkRGB: { r: number, g: number, b: number } = { r: 211, g: 211, b: 211 }
  ): void {
    const width = canvasElement.width;
    const height = canvasElement.height;

    // Creating a buffer in memory
    const imageData = context.createImageData(width, height);
    // Creating a 1D array of [r, g, b, a, r, g, b, a...]
    const data = imageData.data;
    let i = 0;
    // We loop through every pixel by height (y) and width (x)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // The Logic: If the sum of X and Y is even, it's a light square.
        const isLight = (x + y) % 2 === 0;
        const color = isLight ? lightRGB : darkRGB;

        // Set Red, Green, Blue, and Alpha (0-255)
        data[i] = color.r;     // R
        data[i + 1] = color.g; // G
        data[i + 2] = color.b; // B
        data[i + 3] = 255;     // A (Alpha - fully opaque)
        if (i < imageData.data.length) {
          // Each next pixel index starts after the RGBA = 4 slots count
          i+= 4;
        }
      }
    }

    // Commit the entire buffer to the canvas at once
    context.putImageData(imageData, 0, 0);
  }

  /**
   * Update canvas display size (for window resize)
   * Only changes CSS size, preserves pixel data
   *
   * @param canvasElement - Canvas to resize
   * @param containerWidth - New container width
   * @param containerHeight - New container height
   * @returns Updated scale and dimensions
   */
  updateCanvasSize(
    canvasElement: HTMLCanvasElement,
    containerWidth: number,
    containerHeight: number
  ): CanvasSetupResult {
    const width = canvasElement.width;
    const height = canvasElement.height;

    const scale = this.calculateScale(width, height, containerWidth, containerHeight);
    const displayWidth = width * scale;
    const displayHeight = height * scale;

    // Update CSS dimensions
    this.renderer.setStyle(canvasElement, 'width', `${displayWidth}px`);
    this.renderer.setStyle(canvasElement, 'height', `${displayHeight}px`);

    return {
      scale,
      displayWidth,
      displayHeight,
      context: canvasElement.getContext('2d')
    };
  }

  /**
   * Convert mouse/touch coordinates to canvas pixel coordinates
   *
   * @param event - Mouse or touch event
   * @param canvasElement - Canvas element
   * @param oneIndexed - Return 1-indexed coordinates (default: true)
   * @returns Pixel coordinates (1-indexed by default)
   */
  getCanvasPixelCoordinates(
    event: MouseEvent | TouchEvent,
    canvasElement: HTMLCanvasElement,
    oneIndexed: boolean = true
  ): { x: number; y: number } {
    const rect = canvasElement.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    // Handle both mouse and touch events
    if (event instanceof TouchEvent) {
      if (event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        return { x: -100, y: -100 };
      }
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Get position relative to canvas
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Convert from CSS display coordinates to canvas pixel coordinates
    const scaleX = rect.width / canvasElement.width;
    const scaleY = rect.height / canvasElement.height;

    // Convert to canvas pixel coordinates (0-indexed)
    let canvasX = Math.floor(x / scaleX);
    let canvasY = Math.floor(y / scaleY);

    // Validate bounds
    if (canvasX < 0 || canvasX >= canvasElement.width ||
        canvasY < 0 || canvasY >= canvasElement.height) {
      return { x: -100, y: -100 };
    }

    // Convert to 1-indexed if requested
    if (oneIndexed) {
      canvasX += 1;
      canvasY += 1;
    }

    return { x: canvasX, y: canvasY };
  }

  /**
   * Get canvas pixel data as array (for saving to backend)
   *
   * @param canvasElement - Canvas to extract data from
   * @returns - RGBA pixel data array
   */
  getCanvasPixelData(canvasElement: HTMLCanvasElement): number[] {
    const context = canvasElement.getContext('2d');
    if (!context) {
      return [];
    }

    const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
    return Array.from(imageData.data);
  }

  /**
   * Clear canvas completely
   */
  clearCanvas(canvasElement: HTMLCanvasElement): void {
    const context = canvasElement.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
  }
}