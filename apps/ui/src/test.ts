import '@testing-library/jest-dom';
import { afterEach, expect } from 'vitest';


Object.defineProperty(globalThis, 'expect', {
  value: expect,
  writable: true,
  configurable: true
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
    return 0;
  };
}

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

afterEach(() => {
  document.body.innerHTML = '';
});