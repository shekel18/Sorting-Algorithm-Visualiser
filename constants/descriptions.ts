
import { SortingAlgorithm } from '../types';

export interface AlgorithmDetails {
  description: string;
  complexity: string; // Average case
  worstCase: string;
  spaceComplexity: string;
  pythonCode: string;
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
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`
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
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`
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
        arr[j + 1] = key`
  },
  [SortingAlgorithm.MergeSort]: {
    description: "A divide and conquer algorithm that splits the array in half, sorts each half, and then merges them back together.",
    complexity: "O(n log n)",
    worstCase: "O(n log n)",
    spaceComplexity: "O(n)",
    pythonCode: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L, R = arr[:mid], arr[mid:]
        merge_sort(L); merge_sort(R)
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]; i += 1
            else:
                arr[k] = R[j]; j += 1
            k += 1
        while i < len(L):
            arr[k] = L[i]; i += 1; k += 1
        while j < len(R):
            arr[k] = R[j]; j += 1; k += 1`
  },
  [SortingAlgorithm.QuickSort]: {
    description: "Picks an element as a 'pivot' and partitions the array around it, such that smaller elements move to the left.",
    complexity: "O(n log n)",
    worstCase: "O(n²)",
    spaceComplexity: "O(log n)",
    pythonCode: `def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`
  },
  [SortingAlgorithm.HeapSort]: {
    description: "Comparison-based sorting technique based on a Binary Heap data structure, repeatedly extracting the max element.",
    complexity: "O(n log n)",
    worstCase: "O(n log n)",
    spaceComplexity: "O(1)",
    pythonCode: `def heapify(arr, n, i):
    largest = i
    l, r = 2*i + 1, 2*i + 2
    if l < n and arr[i] < arr[l]: largest = l
    if r < n and arr[largest] < arr[r]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1): heapify(arr, n, i)
    for i in range(n-1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)`
  },
  [SortingAlgorithm.CountingSort]: {
    description: "A non-comparison sort that counts the occurrences of each unique element to determine their positions.",
    complexity: "O(n + k)",
    worstCase: "O(n + k)",
    spaceComplexity: "O(k)",
    pythonCode: `def counting_sort(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)
    for x in arr: count[x] += 1
    for i in range(1, len(count)): count[i] += count[i-1]
    res = [0] * len(arr)
    for x in reversed(arr):
        res[count[x]-1] = x
        count[x] -= 1
    return res`
  },
  [SortingAlgorithm.RadixSort]: {
    description: "Sorts integers by processing individual digits, typically from least significant to most significant.",
    complexity: "O(nk)",
    worstCase: "O(nk)",
    spaceComplexity: "O(n + k)",
    pythonCode: `def counting_sort_for_radix(arr, exp):
    n = len(arr); output = [0] * n; count = [0] * 10
    for i in range(n):
        idx = arr[i] // exp
        count[idx % 10] += 1
    for i in range(1, 10): count[i] += count[i-1]
    i = n - 1
    while i >= 0:
        idx = arr[i] // exp
        output[count[idx % 10] - 1] = arr[i]
        count[idx % 10] -= 1; i -= 1
    for i in range(n): arr[i] = output[i]

def radix_sort(arr):
    max_val = max(arr); exp = 1
    while max_val // exp > 0:
        counting_sort_for_radix(arr, exp)
        exp *= 10`
  },
  [SortingAlgorithm.BogoSort]: {
    description: "Also known as 'Stupid Sort', it simply shuffles the array randomly and checks if it's sorted. It is highly inefficient.",
    complexity: "O((n+1)!)",
    worstCase: "Infinite",
    spaceComplexity: "O(1)",
    pythonCode: `import random
def is_sorted(arr):
    return all(arr[i] <= arr[i+1] for i in range(len(arr)-1))

def bogo_sort(arr):
    while not is_sorted(arr):
        random.shuffle(arr)`
  }
};
