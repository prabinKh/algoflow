import { Algorithm } from '../types';

export const DEMO_ALGORITHMS: Partial<Algorithm>[] = [
  {
    name: "Bubble Sort",
    category: "Sorting",
    description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    complexity: {
      time: "O(n²)",
      space: "O(1)",
      timeRating: "bad",
      spaceRating: "good",
    },
    code: {
      python: {
        classCode: `class BubbleSort:
    def sort(self, arr):
        n = len(arr)
        for i in range(n):
            for j in range(0, n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
        return arr`,
        functionCode: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
        recursiveCode: `def bubble_sort_recursive(arr, n=None):
    if n is None:
        n = len(arr)
    if n == 1:
        return arr
    for i in range(n - 1):
        if arr[i] > arr[i + 1]:
            arr[i], arr[i + 1] = arr[i + 1], arr[i]
    return bubble_sort_recursive(arr, n - 1)`,
        outcome: "[1, 2, 3, 4, 5]",
        runtime: "0.001ms"
      },
      cpp: {
        classCode: `class Sorter {
public:
    void bubbleSort(vector<int>& arr) {
        int n = arr.size();
        for (int i = 0; i < n-1; i++)
            for (int j = 0; j < n-i-1; j++)
                if (arr[j] > arr[j+1])
                    swap(arr[j], arr[j+1]);
    }
};`,
        functionCode: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(arr[j], arr[j+1]);
}`,
        recursiveCode: `void bubbleSort(int arr[], int n) {
    if (n == 1) return;
    for (int i=0; i<n-1; i++)
        if (arr[i] > arr[i+1])
            swap(arr[i], arr[i+1]);
    bubbleSort(arr, n-1);
}`,
        outcome: "1 2 3 4 5",
        runtime: "0.0005ms"
      },
      c: { classCode: '', functionCode: '', recursiveCode: '' },
      rust: { classCode: '', functionCode: '', recursiveCode: '' }
    },
    explanation: {
      problem: "Sorting an unordered list of elements.",
      intuition: "Think of larger elements 'bubbling' up to the end of the list.",
      walkthrough: "1. Compare adjacent elements. 2. Swap if out of order. 3. Repeat for all elements.",
      whenToUse: "Educational purposes or very small datasets where simplicity is preferred over performance.",
    }
  },
  {
    name: "Binary Search",
    category: "Searching",
    description: "An efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.",
    complexity: {
      time: "O(log n)",
      space: "O(1)",
      timeRating: "good",
      spaceRating: "good",
    },
    code: {
      python: {
        classCode: `class Searcher:
    def binary_search(self, arr, target):
        low, high = 0, len(arr) - 1
        while low <= high:
            mid = (low + high) // 2
            if arr[mid] == target: return mid
            elif arr[mid] < target: low = mid + 1
            else: high = mid - 1
        return -1`,
        functionCode: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`,
        recursiveCode: `def binary_search_recursive(arr, low, high, target):
    if high >= low:
        mid = (high + low) // 2
        if arr[mid] == target: return mid
        elif arr[mid] > target: return binary_search_recursive(arr, low, mid - 1, target)
        else: return binary_search_recursive(arr, mid + 1, high, target)
    return -1`,
        outcome: "Index: 3",
        runtime: "0.0002ms"
      },
      c: { classCode: '', functionCode: '', recursiveCode: '' },
      cpp: { classCode: '', functionCode: '', recursiveCode: '' },
      rust: { classCode: '', functionCode: '', recursiveCode: '' }
    },
    explanation: {
      problem: "Finding a target value within a sorted array.",
      intuition: "Like looking for a word in a dictionary by opening it in the middle.",
      walkthrough: "1. Find middle. 2. Compare with target. 3. Discard half. 4. Repeat.",
      whenToUse: "When searching in large, sorted datasets.",
    }
  },
  {
    name: "Merge Sort",
    category: "Sorting",
    description: "A divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
    complexity: {
      time: "O(n log n)",
      space: "O(n)",
      timeRating: "good",
      spaceRating: "average",
    },
    code: {
      python: {
        classCode: `class MergeSorter:
    def sort(self, arr):
        if len(arr) <= 1: return arr
        mid = len(arr) // 2
        left = self.sort(arr[:mid])
        right = self.sort(arr[mid:])
        return self.merge(left, right)
    
    def merge(self, left, right):
        result = []
        i = j = 0
        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        result.extend(left[i:])
        result.extend(right[j:])
        return result`,
        functionCode: `def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)`,
        recursiveCode: `def merge_sort(arr):
    # Merge sort is inherently recursive
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))`,
        outcome: "[1, 2, 5, 7, 9]",
        runtime: "0.005ms"
      },
      c: { classCode: '', functionCode: '', recursiveCode: '' },
      cpp: { classCode: '', functionCode: '', recursiveCode: '' },
      rust: { classCode: '', functionCode: '', recursiveCode: '' }
    },
    explanation: {
      problem: "Efficiently sorting large datasets.",
      intuition: "Divide the problem into smallest possible pieces, sort them, and combine.",
      walkthrough: "1. Split array. 2. Sort halves. 3. Merge sorted halves.",
      whenToUse: "When stable sorting is required or for linked lists.",
    }
  },
  {
    name: "Depth First Search (DFS)",
    category: "Graphs",
    description: "An algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)",
      timeRating: "average",
      spaceRating: "average",
    },
    code: {
      python: {
        classCode: `class GraphTraversal:
    def dfs(self, graph, start, visited=None):
        if visited is None: visited = set()
        visited.add(start)
        for next in graph[start] - visited:
            self.dfs(graph, next, visited)
        return visited`,
        functionCode: `def dfs(graph, start):
    visited, stack = set(), [start]
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            stack.extend(graph[vertex] - visited)
    return visited`,
        recursiveCode: `def dfs_recursive(graph, start, visited=None):
    if visited is None: visited = set()
    visited.add(start)
    for next in graph[start] - visited:
        dfs_recursive(graph, next, visited)
    return visited`,
        outcome: "{'A', 'B', 'C', 'D'}",
        runtime: "0.01ms"
      },
      c: { classCode: '', functionCode: '', recursiveCode: '' },
      cpp: { classCode: '', functionCode: '', recursiveCode: '' },
      rust: { classCode: '', functionCode: '', recursiveCode: '' }
    },
    explanation: {
      problem: "Exploring all nodes in a graph or tree.",
      intuition: "Go deep before you go wide.",
      walkthrough: "1. Mark current node visited. 2. Visit unvisited neighbors recursively.",
      whenToUse: "Pathfinding, topological sorting, or solving puzzles like mazes.",
    }
  },
  {
    name: "Dijkstra's Algorithm",
    category: "Graphs",
    description: "An algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks.",
    complexity: {
      time: "O((V+E) log V)",
      space: "O(V)",
      timeRating: "good",
      spaceRating: "average",
    },
    code: {
      python: {
        classCode: `import heapq
class ShortestPath:
    def dijkstra(self, graph, start):
        distances = {node: float('inf') for node in graph}
        distances[start] = 0
        pq = [(0, start)]
        while pq:
            curr_dist, curr_node = heapq.heappop(pq)
            if curr_dist > distances[curr_node]: continue
            for neighbor, weight in graph[curr_node].items():
                dist = curr_dist + weight
                if dist < distances[neighbor]:
                    distances[neighbor] = dist
                    heapq.heappush(pq, (dist, neighbor))
        return distances`,
        functionCode: `import heapq
def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    while pq:
        curr_dist, curr_node = heapq.heappop(pq)
        for neighbor, weight in graph[curr_node].items():
            dist = curr_dist + weight
            if dist < distances[neighbor]:
                distances[neighbor] = dist
                heapq.heappush(pq, (dist, neighbor))
    return distances`,
        recursiveCode: `def dijkstra_recursive(graph, start):
    # Typically implemented iteratively with a priority queue
    pass`,
        outcome: "{'A': 0, 'B': 5, 'C': 2}",
        runtime: "0.05ms"
      },
      c: { classCode: '', functionCode: '', recursiveCode: '' },
      cpp: { classCode: '', functionCode: '', recursiveCode: '' },
      rust: { classCode: '', functionCode: '', recursiveCode: '' }
    },
    explanation: {
      problem: "Finding shortest path in a weighted graph.",
      intuition: "Always pick the closest unvisited node.",
      walkthrough: "1. Set initial distances. 2. Use priority queue to pick min distance node. 3. Update neighbors.",
      whenToUse: "GPS navigation, network routing protocols.",
    }
  }
];
