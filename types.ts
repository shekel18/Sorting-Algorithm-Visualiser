
export enum SortingAlgorithm {
  BubbleSort = 'Bubble Sort',
  SelectionSort = 'Selection Sort',
  InsertionSort = 'Insertion Sort',
  MergeSort = 'Merge Sort',
  QuickSort = 'Quick Sort',
  HeapSort = 'Heap Sort',
  CountingSort = 'Counting Sort',
  RadixSort = 'Radix Sort',
  BogoSort = 'Bogo Sort',
}

export type SortDirection = 'asc' | 'desc';

export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  swap: string;
}

export type AnimationStep = 
  | ['compare', number, number]
  | ['swap', number, number]
  | ['overwrite', number, number]
  | ['sorted', number]
  | ['pivot', number, number]; // pivot index, range end index
