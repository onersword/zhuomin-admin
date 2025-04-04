import { setupWorker } from 'msw/browser';
import { userHandlers } from './handlers/user';

export const worker = setupWorker(...userHandlers); 