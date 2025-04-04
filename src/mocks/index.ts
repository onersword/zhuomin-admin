import { setupWorker } from 'msw/browser';
import { userHandlers } from './handlers/user';

// 导出所有 handlers
export const handlers = [...userHandlers];

// 创建 worker
export const worker = setupWorker(...handlers);

// 启动 worker
export const startMockService = async () => {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK === 'true') {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
        quiet: false,
      });
      console.log('MSW started successfully');
      console.log('Registered handlers:', handlers);
    } catch (error) {
      console.error('Failed to start MSW:', error);
    }
  } else {
    console.log('MSW is disabled');
  }
};

// 停止 worker
export const stopMockService = async () => {
  if (worker) {
    await worker.stop();
    console.log('MSW stopped successfully');
  }
}; 