
import { AnimationStep } from '../types';

// --- Bubble Sort ---
export function getBubbleSortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push(['compare', j, j + 1]);
      const shouldSwap = isAsc ? array[j] > array[j + 1] : array[j] < array[j + 1];
      if (shouldSwap) {
        animations.push(['swap', j, j + 1]);
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
    animations.push(['sorted', n - 1 - i]);
  }
  animations.push(['sorted', 0]);
  return animations;
}

// --- Selection Sort ---
export function getSelectionSortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let targetIdx = i;
    for (let j = i + 1; j < n; j++) {
      animations.push(['compare', targetIdx, j]);
      const isBetter = isAsc ? array[j] < array[targetIdx] : array[j] > array[targetIdx];
      if (isBetter) {
        targetIdx = j;
      }
    }
    animations.push(['swap', i, targetIdx]);
    [array[i], array[targetIdx]] = [array[targetIdx], array[i]];
    animations.push(['sorted', i]);
  }
  animations.push(['sorted', n - 1]);
  return animations;
}

// --- Insertion Sort ---
export function getInsertionSortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const n = array.length;
  animations.push(['sorted', 0]);
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    animations.push(['compare', i, j]);
    const condition = () => j >= 0 && (isAsc ? array[j] > key : array[j] < key);
    while (condition()) {
      animations.push(['overwrite', j + 1, array[j]]);
      array[j + 1] = array[j];
      j = j - 1;
      if(j >= 0) animations.push(['compare', i, j]);
    }
    animations.push(['overwrite', j + 1, key]);
    array[j + 1] = key;
    for(let k = 0; k <= i; k++) {
        animations.push(['sorted', k]);
    }
  }
  return animations;
}

// --- Merge Sort ---
export function getMergeSortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
  const animations: AnimationStep[] = [];
  if (array.length <= 1) return animations;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations, isAsc);
  for(let i=0; i<array.length; i++) animations.push(['sorted', i]);
  return animations;
}

function mergeSortHelper(
  mainArray: number[],
  startIdx: number,
  endIdx: number,
  auxiliaryArray: number[],
  animations: AnimationStep[],
  isAsc: boolean
) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations, isAsc);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations, isAsc);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations, isAsc);
}

function doMerge(
  mainArray: number[],
  startIdx: number,
  middleIdx: number,
  endIdx: number,
  auxiliaryArray: number[],
  animations: AnimationStep[],
  isAsc: boolean
) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    animations.push(['compare', i, j]);
    const condition = isAsc ? auxiliaryArray[i] <= auxiliaryArray[j] : auxiliaryArray[i] >= auxiliaryArray[j];
    if (condition) {
      animations.push(['overwrite', k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push(['overwrite', k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    animations.push(['compare', i, i]);
    animations.push(['overwrite', k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    animations.push(['compare', j, j]);
    animations.push(['overwrite', k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}

// --- Quick Sort ---
export function getQuickSortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
    const animations: AnimationStep[] = [];
    if (array.length <= 1) return animations;
    quickSortHelper(array, 0, array.length - 1, animations, isAsc);
    return animations;
}

function quickSortHelper(
    array: number[],
    low: number,
    high: number,
    animations: AnimationStep[],
    isAsc: boolean
) {
    if (low < high) {
        const pi = partition(array, low, high, animations, isAsc);
        quickSortHelper(array, low, pi - 1, animations, isAsc);
        quickSortHelper(array, pi + 1, high, animations, isAsc);
    } else if (low === high) {
        animations.push(['sorted', low]);
    }
}

function partition(
    array: number[],
    low: number,
    high: number,
    animations: AnimationStep[],
    isAsc: boolean
): number {
    const pivot = array[high];
    animations.push(['pivot', high, low]);
    let i = low - 1;

    for (let j = low; j < high; j++) {
        animations.push(['compare', j, high]);
        const shouldMove = isAsc ? array[j] < pivot : array[j] > pivot;
        if (shouldMove) {
            i++;
            animations.push(['swap', i, j]);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    animations.push(['swap', i + 1, high]);
    [array[i + 1], array[high]] = [array[high], array[i + 1]];

    animations.push(['sorted', i + 1]);

    for (let k = low; k < i + 1; k++) {
      if (isPartitionSorted(array, low, i, isAsc)) {
        animations.push(['sorted', k]);
      }
    }

    for (let k = i + 2; k <= high; k++) {
      if (isPartitionSorted(array, i + 2, high, isAsc)) {
         animations.push(['sorted', k]);
      }
    }

    return i + 1;
}

function isPartitionSorted(array: number[], start: number, end: number, isAsc: boolean): boolean {
  for (let i = start; i < end; i++) {
    const condition = isAsc ? array[i] > array[i+1] : array[i] < array[i+1];
    if (condition) return false;
  }
  return true;
}

// --- Heap Sort ---
export function getHeapSortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const n = array.length;
  if (n <= 1) return animations;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i, animations, isAsc);
  }

  for (let i = n - 1; i > 0; i--) {
    animations.push(['swap', 0, i]);
    [array[0], array[i]] = [array[i], array[0]];
    animations.push(['sorted', i]);
    heapify(array, i, 0, animations, isAsc);
  }
  animations.push(['sorted', 0]);
  return animations;
}

function heapify(array: number[], n: number, i: number, animations: AnimationStep[], isAsc: boolean) {
  let extremum = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    animations.push(['compare', left, extremum]);
    const condition = isAsc ? array[left] > array[extremum] : array[left] < array[extremum];
    if (condition) {
      extremum = left;
    }
  }

  if (right < n) {
    animations.push(['compare', right, extremum]);
    const condition = isAsc ? array[right] > array[extremum] : array[right] < array[extremum];
    if (condition) {
      extremum = right;
    }
  }

  if (extremum !== i) {
    animations.push(['swap', i, extremum]);
    [array[i], array[extremum]] = [array[extremum], array[i]];
    heapify(array, n, extremum, animations, isAsc);
  }
}

// --- Counting Sort ---
export function getCountingSortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const n = array.length;
  if (n <= 1) return animations;

  let max = array[0];
  for (let i = 1; i < n; i++) {
    if (array[i] > max) max = array[i];
  }

  const count = new Array(max + 1).fill(0);
  for (let i = 0; i < n; i++) {
    animations.push(['compare', i, i]);
    count[array[i]]++;
  }

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  const output = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    const value = array[i];
    let position = count[value] - 1;
    output[position] = value;
    count[value]--;
  }

  if (!isAsc) {
      output.reverse();
  }

  for (let i = 0; i < n; i++) {
    animations.push(['overwrite', i, output[i]]);
    array[i] = output[i];
    animations.push(['sorted', i]);
  }
  
  return animations;
}

// --- Radix Sort ---
export function getRadixSortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
  const animations: AnimationStep[] = [];
  if (array.length <= 1) return animations;

  const max = Math.max(...array);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    radixCountingSort(array, exp, animations);
  }

  if (!isAsc) {
      const reversed = [...array].reverse();
      for (let i = 0; i < array.length; i++) {
          animations.push(['overwrite', i, reversed[i]]);
          array[i] = reversed[i];
      }
  }
  
  for(let i=0; i<array.length; i++) animations.push(['sorted', i]);
  return animations;
}

function radixCountingSort(array: number[], exp: number, animations: AnimationStep[]) {
  const n = array.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(array[i] / exp) % 10;
    animations.push(['compare', i, i]);
    count[digit]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(array[i] / exp) % 10;
    animations.push(['compare', i, i]);
    const position = count[digit] - 1;
    output[position] = array[i];
    count[digit]--;
  }

  for (let i = 0; i < n; i++) {
    animations.push(['overwrite', i, output[i]]);
    array[i] = output[i];
  }
}

// --- Bogo Sort ---
function isArraySorted(array: number[], isAsc: boolean): boolean {
  for (let i = 0; i < array.length - 1; i++) {
    const condition = isAsc ? array[i] > array[i + 1] : array[i] < array[i + 1];
    if (condition) return false;
  }
  return true;
}

function shuffleArray(array: number[], animations: AnimationStep[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    animations.push(['swap', i, j]);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function getBogoSortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const MAX_ATTEMPTS = 1000;
  let attempts = 0;

  while (!isArraySorted(array, isAsc) && attempts < MAX_ATTEMPTS) {
    for(let i=0; i < array.length - 1; i++) {
      animations.push(['compare', i, i + 1]);
      const condition = isAsc ? array[i] > array[i + 1] : array[i] < array[i + 1];
      if (condition) break;
    }
    shuffleArray(array, animations);
    attempts++;
  }

  if (isArraySorted(array, isAsc)) {
    for (let i = 0; i < array.length; i++) {
      animations.push(['sorted', i]);
    }
  }
  return animations;
}

// --- Timsort (Simplified) ---
export function getTimsortAnimations(array: number[], isAsc: boolean = true): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const n = array.length;
  const RUN = 32;

  // Small runs using insertion sort
  for (let i = 0; i < n; i += RUN) {
    const end = Math.min(i + RUN - 1, n - 1);
    const run = array.slice(i, end + 1);
    const runAnims = getInsertionSortAnimations(run, isAsc);
    // Map run animations back to the main array indices
    runAnims.forEach(anim => {
        const [type, arg1, arg2] = anim;
        if (type === 'compare') animations.push(['compare', i + arg1, i + (arg2 as number)]);
        else if (type === 'swap') animations.push(['swap', i + arg1, i + (arg2 as number)]);
        else if (type === 'overwrite') animations.push(['overwrite', i + arg1, arg2 as number]);
    });
    // Update local copy
    for (let k = i; k <= end; k++) array[k] = run[k - i];
  }

  // Merge runs
  let size = RUN;
  while (size < n) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) {
        doMerge(array, left, mid, right, array.slice(), animations, isAsc);
      }
    }
    size *= 2;
  }
  return animations;
}
