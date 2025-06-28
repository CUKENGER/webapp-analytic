import { Mock } from 'vitest';

declare global {
  interface Window {
    fetch: Mock;
  }
  namespace NodeJS {
    interface Global {
      fetch: Mock;
    }
  }
}
