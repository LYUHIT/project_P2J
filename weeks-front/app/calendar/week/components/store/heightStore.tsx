import { proxy } from 'valtio';

export const heightStore = proxy({ 
    containerHeight: 0, 
    timeHeaderHeight: 20,
    weekRowHeight: 0,
 });