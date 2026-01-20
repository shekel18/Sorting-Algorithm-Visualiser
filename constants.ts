
import { SortingAlgorithm, ColorConfig } from './types';

export const DEFAULT_ARRAY_SIZE = 50;
export const MIN_ARRAY_SIZE = 10;
export const MAX_ARRAY_SIZE = 100;

export const DEFAULT_SPEED = 50;
export const MIN_SPEED = 1;
export const MAX_SPEED = 200;

export const PRIMARY_COLOR = 'var(--color-primary)';
export const SECONDARY_COLOR = 'var(--color-secondary)';
export const ACCENT_COLOR = 'var(--color-accent)';
export const SWAP_COLOR = 'var(--color-swap)';

export const THEME_DEFAULTS: Record<'light' | 'dark' | 'penguin', ColorConfig> = {
  light: {
    primary: '#6366F1',
    secondary: '#10B981',
    accent: '#F87171',
    swap: '#F59E0B',
  },
  dark: {
    primary: '#6366F1',
    secondary: '#10B981',
    accent: '#F87171',
    swap: '#F59E0B',
  },
  penguin: {
    primary: '#006994',
    secondary: '#FFA500',
    accent: '#00BFFF',
    swap: '#FFD700',
  }
};

export const COLOR_PRESETS = [
  '#6366F1', // Indigo
  '#3B82F6', // Blue
  '#0EA5E9', // Sky
  '#10B981', // Emerald
  '#22C55E', // Green
  '#EAB308', // Yellow
  '#F59E0B', // Amber
  '#F97316', // Orange
  '#EF4444', // Red
  '#F43F5E', // Rose
  '#D946EF', // Fuchsia
  '#8B5CF6', // Violet
  '#64748B', // Slate
];

export const FONT_OPTIONS = [
  { name: 'Modern', value: "'Inter', sans-serif" },
  { name: 'Monospace', value: "'JetBrains Mono', monospace" },
  { name: 'Friendly', value: "'Quicksand', sans-serif" },
  { name: 'Elegant', value: "'Playfair Display', serif" },
  { name: 'Tech', value: "'Space Grotesk', sans-serif" },
];

export const PENGUIN_ICON_URI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZD0iTTIwLDIgQzEyLDIgOCwxMiA4LDIwIEM4LDMyIDE0LDM4IDIwLDM4IEMyNiwzOCAzMiwzMiAzMiwyMCBDMzIsMTIgMjgsMiAyMCwyIFoiIGZpbGw9IiMyRjRGNEYiLz48cGF0aCBkPSJNMjAsOCBDMTYsOCAxNCwxNCAxNCwyMCBDMTQsMjggMTYsMzQgMjAsMzQgQzI0LDM0IDI2LDI4IDI2LDIwIEMyNiwxNCAyNCw4IDIwLDggWiIgZmlsbD0iI0ZGRkZGRiIvPjxjaXJjbGUgY3g9IjE3IiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0iIzJGNEY0RiIvPjxjaXJjbGUgY3g9IjIzIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0iIzJGNEY0RiIvPjxwb2x5Z29uIHBvaW50cz0iMTksMTggMjEsMTggMjAsMjEiIGZpbGw9IiNGRkE1MCIvPjxwYXRoIGQ9Ik0xNSwzNyBDMTMsMzcgMTMsMzkgMTUsMzkgQzE3LDM5IDE3LDM3IDE1LDM3IFoiIGZpbGw9IiNGRkE1MCIvPjxwYXRoIGQ9Ik0yNSwzNyBDMjMsMzcgMjMsMzkgMjUsMzkgQzI3LDM5IDI3LDM7IDI1LDM3IFoiIGZpbGw9IiNGRkE1MCIvPjwvc3ZnPg==';


export const ALGORITHMS: { value: SortingAlgorithm; label: string }[] = [
  // Comparison Sorts
  { value: SortingAlgorithm.MergeSort, label: 'Merge Sort' },
  { value: SortingAlgorithm.QuickSort, label: 'Quick Sort' },
  { value: SortingAlgorithm.HeapSort, label: 'Heap Sort' },
  { value: SortingAlgorithm.BubbleSort, label: 'Bubble Sort' },
  { value: SortingAlgorithm.SelectionSort, label: 'Selection Sort' },
  { value: SortingAlgorithm.InsertionSort, label: 'Insertion Sort' },
  // Non-Comparison Sorts
  { value: SortingAlgorithm.RadixSort, label: 'Radix Sort' },
  { value: SortingAlgorithm.CountingSort, label: 'Counting Sort' },
];

export const BOGO_SORT_ALGORITHM = { value: SortingAlgorithm.BogoSort, label: 'Bogo Sort' };
