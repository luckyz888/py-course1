export { module1 } from './module1';
export { module2 } from './module2';
export { module3 } from './module3';
export { module4 } from './module4';
export { module5 } from './module5';
export { module6 } from './module6';
import { module1 } from './module1';
import { module2 } from './module2';
import { module3 } from './module3';
import { module4 } from './module4';
import { module5 } from './module5';
import { module6 } from './module6';
import type { Module } from '../../types';

export const allModules: Module[] = [module1, module2, module3, module4, module5, module6];
