
import { SortingAlgorithm } from '../types';

const messages: Record<SortingAlgorithm, string[]> = {
  [SortingAlgorithm.BubbleSort]: [
    "Slow and steady wins the... wait, what were we doing?",
    "The turtle of sorting algorithms has finished its race.",
    "Inefficient, yet oddly satisfying to watch.",
    "Finally! I was starting to bubble with anticipation.",
  ],
  [SortingAlgorithm.SelectionSort]: [
    "Finding the minimum... effort required.",
    "One at a time. Patience is a virtue, right?",
    "Selected, sorted, satisfied.",
    "The most selective sort has made its choice.",
  ],
  [SortingAlgorithm.InsertionSort]: [
    "Sorted, one card at a time. Ready for Vegas.",
    "Sorted in place, like a well-behaved toddler.",
    "It just works. Eventually.",
    "That felt... methodical.",
  ],
  [SortingAlgorithm.MergeSort]: [
    "Order from chaos, one merge at a time.",
    "Divide and conquer? More like divide and Caffeinate.",
    "Successfully merged. Unlike my last pull request.",
    "So smooth, it's like butter.",
  ],
  [SortingAlgorithm.QuickSort]: [
    "That was quick... sort of.",
    "Chose a pivot wisely. My life choices? Not so much.",
    "Partitioned and conquered. Now, where's the pizza?",
    "Now that's what I call a quick sort!",
  ],
  [SortingAlgorithm.HeapSort]: [
    "Sorted with heap-loads of effort.",
    "Max-heap, more like max-neat!",
    "Building heaps and breaking sweats.",
    "This sort is on fire!",
  ],
  [SortingAlgorithm.CountingSort]: [
    "Counted, then sorted. As easy as 1, 2, 3.",
    "This only works if the numbers are small... like my patience.",
    "Sorted without a single comparison. Magic!",
    "It all adds up in the end.",
  ],
  [SortingAlgorithm.RadixSort]: [
    "Sorting by the digits. Numbers have never been so organized.",
    "No comparisons, no problem.",
    "Radically sorted!",
    "That was base-ically amazing.",
  ],
  [SortingAlgorithm.BogoSort]: [
    "I can't believe that actually worked.",
    "Sorted by pure, unadulterated luck.",
    "Never tell me the odds!",
    "The universe smiled upon us today.",
    "A triumph of chaos theory!",
  ],
  [SortingAlgorithm.Timsort]: [
    "Timsort completed! Python's default for a reason.",
    "A blend of merge and insertion. Very sophisticated.",
    "Gotta go fast (stably)!",
  ],
};

export const getRandomMessage = (algorithm: SortingAlgorithm): string => {
  const options = messages[algorithm];
  if (!options || options.length === 0) {
    return "Sort complete!";
  }
  return options[Math.floor(Math.random() * options.length)];
};
