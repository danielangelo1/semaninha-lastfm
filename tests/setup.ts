import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock canvas methods for canvas tests
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Array(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
});

// Mock Image constructor for canvas image loading
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).Image = class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';
  alt = '';
  
  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 100);
  }
};

// Mock URL.createObjectURL and revokeObjectURL
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).URL.createObjectURL = vi.fn(() => 'mocked-url');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).URL.revokeObjectURL = vi.fn();
