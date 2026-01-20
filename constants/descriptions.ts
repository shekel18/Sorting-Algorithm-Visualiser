
import { SortingAlgorithm } from '../types';

export interface AlgorithmDetails {
  description: string;
  complexity: string; // Average case
  worstCase: string;
  spaceComplexity: string;
  pythonCode: string;
  lineMap?: Record<string, number>; // Maps internal event types to line indices
}

export const ALGORITHM_DESCRIPTIONS: Record<SortingAlgorithm, AlgorithmDetails> = {
  [SortingAlgorithm.BubbleSort]: {
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    complexity: "O(n²)",
    worstCase: "O(n²)",
    spaceComplexity: "O(1)",
    pythonCode: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
    lineMap: { compare: 3, swap: 4 }
  },
  [SortingAlgorithm.SelectionSort]: {
    description: "Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
    complexity: "O(n²)",
    worstCase: "O(n²)",
    spaceComplexity: "O(1)",
    pythonCode: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    lineMap: { compare: 5, swap: 7 }
  },
  [SortingAlgorithm.InsertionSort]: {
    description: "Builds the final sorted array one item at a time by inserting each new element into its correct position.",
    complexity: "O(n²)",
    worstCase: "O(n²)",
    spaceComplexity: "O(1)",
    pythonCode: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
    lineMap: { compare: 5, overwrite: 6 }
  },
  [SortingAlgorithm.MergeSort]: {
    description: "A divide and conquer algorithm that splits the array in half, sorts each half, and then merges them back together.",
    complexity: "O(n log n)",
    worstCase: "O(n log n)",
    spaceComplexity: "O(n)",
    pythonCode: `def merge(L, R, arr):
    i = j = k = 0
    while i < len(L) and j < len(R):
        if L[i] < R[j]:      # Compare
            arr[k] = L[i]    # Overwrite
            i += 1
        else:
            arr[k] = R[j]    # Overwrite
            j += 1
        k += 1`,
    lineMap: { compare: 3, overwrite: 4 }
  },
  [SortingAlgorithm.QuickSort]: {
    description: "Picks an element as a 'pivot' and partitions the array around it, such that smaller elements move to the left.",
    complexity: "O(n log n)",
    worstCase: "O(n²)",
    spaceComplexity: "O(log n)",
    pythonCode: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:   # Compare
            i += 1
            arr[i], arr[j] = arr[j], arr[i] # Swap
    arr[i+1], arr[high] = arr[high], arr[i+1] # Swap`,
    lineMap: { compare: 4, swap: 6, pivot: 1 }
  },
  [SortingAlgorithm.HeapSort]: {
    description: "Comparison-based sorting technique based on a Binary Heap data structure, repeatedly extracting the max element.",
    complexity: "O(n log n)",
    worstCase: "O(n log n)",
    spaceComplexity: "O(1)",
    pythonCode: `def heapify(arr, n, i):
    largest = i
    l, r = 2*i + 1, 2*i + 2
    if l < n and arr[l] > arr[largest]: largest = l # Compare
    if r < n and arr[r] > arr[largest]: largest = r # Compare
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i] # Swap
        heapify(arr, n, largest)`,
    lineMap: { compare: 3, swap: 6 }
  },
  [SortingAlgorithm.CountingSort]: {
    description: "A non-comparison sort that counts the occurrences of each unique element to determine their positions.",
    complexity: "O(n + k)",
    worstCase: "O(n + k)",
    spaceComplexity: "O(k)",
    pythonCode: `def counting_sort(arr):
    count = [0] * (max(arr) + 1)
    for x in arr: count[x] += 1
    for i in range(1, len(count)): count[i] += count[i-1]
    res = [0] * len(arr)
    for x in reversed(arr):
        res[count[x]-1] = x    # Placement
        count[x] -= 1`,
    lineMap: { overwrite: 7 }
  },
  [SortingAlgorithm.RadixSort]: {
    description: "Sorts integers by processing individual digits, typically from least significant to most significant.",
    complexity: "O(nk)",
    worstCase: "O(nk)",
    spaceComplexity: "O(n + k)",
    pythonCode: `def radix_sort(arr):
    max_val = max(arr); exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp) # Process
        exp *= 10`,
    lineMap: { overwrite: 4 }
  },
  [SortingAlgorithm.BogoSort]: {
    description: "Also known as 'Stupid Sort', it simply shuffles the array randomly and checks if it's sorted. It is highly inefficient.",
    complexity: "O((n+1)!)",
    worstCase: "Infinite",
    spaceComplexity: "O(1)",
    pythonCode: `def bogo_sort(arr):
    while not is_sorted(arr): # Check
        random.shuffle(arr)   # Shuffle`,
    lineMap: { compare: 1, swap: 2 }
  },
  [SortingAlgorithm.Timsort]: {
    description: "Python's default sorting algorithm. It's a stable hybrid sort derived from Merge Sort and Insertion Sort.",
    complexity: "O(n log n)",
    worstCase: "O(n log n)",
    spaceComplexity: "O(n)",
    pythonCode: `def timsort(arr):
    n = len(arr)
    for i in range(0, n, RUN):
        insertion_sort(arr, i, min(i+RUN-1, n-1))
    size = RUN
    while size < n:
        for left in range(0, n, 2*size):
            merge(arr, left, mid, right) # Merge runs
        size *= 2`,
    lineMap: { compare: 3, overwrite: 7, swap: 3 }
  }
};
