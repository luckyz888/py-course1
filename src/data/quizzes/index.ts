export { quiz1 } from './quiz1';
export { quiz2 } from './quiz2';
export { quiz3 } from './quiz3';
export { quiz4 } from './quiz4';
export { quiz5 } from './quiz5';
export { quiz6 } from './quiz6';
import { quiz1 } from './quiz1';
import { quiz2 } from './quiz2';
import { quiz3 } from './quiz3';
import { quiz4 } from './quiz4';
import { quiz5 } from './quiz5';
import { quiz6 } from './quiz6';
import type { Quiz } from '../../types';

export const allQuizzes: Quiz[] = [quiz1, quiz2, quiz3, quiz4, quiz5, quiz6];
