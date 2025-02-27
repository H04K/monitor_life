// src/global.d.ts
declare global {
    interface ServiceWorkerGlobalScope {
      __WB_MANIFEST: string[];
    }
  }
  
  export {};