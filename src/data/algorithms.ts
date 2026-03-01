import { Algorithm, Category } from '../types';

export const categories: Category[] = [
  {
    name: 'Sorting Algorithms',
    icon: 'ListOrdered',
    algorithms: ['bubble-sort', 'merge-sort', 'quick-sort'],
  },
  {
    name: 'Searching Algorithms',
    icon: 'Search',
    algorithms: ['binary-search'],
  },
  {
    name: 'Graphs',
    icon: 'Share2',
    algorithms: ['dfs', 'bfs', 'dijkstra'],
  },
  {
    name: 'Dynamic Programming',
    icon: 'Layers',
    algorithms: ['knapsack-01'],
  }
];

export const algorithms: Algorithm[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting Algorithms',
    description: 'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
      timeRating: 'bad',
      spaceRating: 'good',
    },
    code: {
      python: {
        iterative: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
      },
      cpp: {
        iterative: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}`,
      },
      c: {
        iterative: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
      },
      rust: {
        iterative: `fn bubble_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..n - i - 1 {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}`,
      }
    },
    explanation: {
      problem: 'Sorting a list of elements in ascending or descending order.',
      intuition: 'Imagine bubbles rising to the surface. In each pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.',
      walkthrough: '1. Start from the first element.\n2. Compare it with the next element.\n3. If current > next, swap them.\n4. Move to the next pair.\n5. Repeat until the end of the array (the largest element is now at the end).\n6. Repeat the whole process for the remaining unsorted elements.',
      whenToUse: 'Rarely used in production due to O(n²) complexity. Good for educational purposes or very small, nearly sorted datasets.',
      funFact: 'Bubble sort is one of the oldest sorting algorithms, dating back to the late 1950s.',
      researchLinks: [
        { title: 'Bubble Sort - Wikipedia', url: 'https://en.wikipedia.org/wiki/Bubble_sort' },
        { title: 'Sorting Algorithms Visualized', url: 'https://www.toptal.com/developers/sorting-algorithms/bubble-sort' }
      ]
    }
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching Algorithms',
    description: 'An efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.',
    complexity: {
      time: 'O(log n)',
      space: 'O(1)',
      timeRating: 'good',
      spaceRating: 'good',
    },
    code: {
      python: {
        iterative: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
        recursive: `def binary_search_recursive(arr, low, high, target):
    if high >= low:
        mid = (high + low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] > target:
            return binary_search_recursive(arr, low, mid - 1, target)
        else:
            return binary_search_recursive(arr, mid + 1, high, target)
    else:
        return -1`
      },
      cpp: {
        iterative: `int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
      },
      c: {
        iterative: `int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
      },
      rust: {
        iterative: `fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut low = 0;
    let mut high = arr.len();

    while low < high {
        let mid = low + (high - low) / 2;
        if arr[mid] == target {
            return Some(mid);
        } else if arr[mid] < target {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    None
}`,
      }
    },
    explanation: {
      problem: 'Finding the position of a target value within a sorted array.',
      intuition: 'Like looking for a word in a dictionary. You open it in the middle, see if the word is before or after, and discard the other half.',
      walkthrough: '1. Compare target with the middle element.\n2. If equal, you found it!\n3. If target < middle, search the left half.\n4. If target > middle, search the right half.\n5. Repeat until found or the search space is empty.',
      whenToUse: 'When the data is sorted and you need fast lookups.',
      funFact: 'Although the idea is simple, implementing binary search correctly is notoriously tricky. The first correct version was published 16 years after the first description of the algorithm.',
      researchLinks: [
        { title: 'Binary Search - Wikipedia', url: 'https://en.wikipedia.org/wiki/Binary_search_algorithm' },
        { title: 'Knuth on Binary Search', url: 'https://archive.org/details/artofcomputerpro0003knut' }
      ]
    }
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Sorting Algorithms',
    description: 'A divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
      timeRating: 'good',
      spaceRating: 'average',
    },
    code: {
      python: {
        iterative: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)`,
      },
      cpp: {
        iterative: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      },
      c: {
        iterative: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      },
      rust: {
        iterative: `fn merge_sort(arr: &mut [i32]) {
    let mid = arr.len() / 2;
    if mid == 0 { return; }
    merge_sort(&mut arr[..mid]);
    merge_sort(&mut arr[mid..]);
    let mut ret = arr.to_vec();
    merge(&arr[..mid], &arr[mid..], &mut ret[..]);
    arr.copy_from_slice(&ret);
}`,
      }
    },
    explanation: {
      problem: 'Efficiently sorting large datasets.',
      intuition: 'Divide and conquer. Split the problem into smaller pieces, solve them, and combine the results.',
      walkthrough: '1. Divide the unsorted list into n sublists, each containing one element.\n2. Repeatedly merge sublists to produce new sorted sublists until there is only one sublist remaining.',
      whenToUse: 'When you need a stable sort and have extra memory. Excellent for linked lists.',
      funFact: 'Merge sort was invented by John von Neumann in 1945.',
      researchLinks: [
        { title: 'Merge Sort - Wikipedia', url: 'https://en.wikipedia.org/wiki/Merge_sort' },
        { title: 'Divide and Conquer - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/merge-sort/' }
      ]
    }
  },
  {
    id: 'dfs',
    name: 'Depth First Search',
    category: 'Graphs',
    description: 'An algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking.',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
      timeRating: 'good',
      spaceRating: 'average',
    },
    code: {
      python: {
        iterative: `def dfs(graph, start):
    visited, stack = set(), [start]
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            stack.extend(graph[vertex] - visited)
    return visited`,
        recursive: `def dfs_recursive(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    for next in graph[start] - visited:
        dfs_recursive(graph, next, visited)
    return visited`
      },
      cpp: {
        iterative: `void DFS(int v) {
    visited[v] = true;
    for (auto i = adj[v].begin(); i != adj[v].end(); ++i)
        if (!visited[*i])
            DFS(*i);
}`,
      },
      c: {
        iterative: `void DFS(struct Graph* graph, int vertex) {
    struct node* adjList = graph->adjLists[vertex];
    struct node* temp = adjList;
    graph->visited[vertex] = 1;
    while (temp != NULL) {
        int connectedVertex = temp->vertex;
        if (graph->visited[connectedVertex] == 0) {
            DFS(graph, connectedVertex);
        }
        temp = temp->next;
    }
}`,
      },
      rust: {
        iterative: `fn dfs(graph: &Graph, start: NodeId) {
    let mut visited = HashSet::new();
    let mut stack = vec![start];
    while let Some(node) = stack.pop() {
        if visited.insert(node) {
            for &neighbor in &graph[node] {
                stack.push(neighbor);
            }
        }
    }
}`,
      }
    },
    explanation: {
      problem: 'Exploring all nodes in a graph or tree.',
      intuition: 'Like exploring a maze. You go as deep as you can down one path, and when you hit a dead end, you backtrack to the last fork and try another path.',
      walkthrough: '1. Mark the current node as visited.\n2. For each unvisited neighbor, recursively call DFS.\n3. Repeat until all reachable nodes are visited.',
      whenToUse: 'Finding paths, cycle detection, topological sorting, and solving puzzles like mazes.',
      funFact: 'DFS was first investigated in the 19th century by French mathematician Charles Pierre Trémaux as a strategy for solving mazes.',
      researchLinks: [
        { title: 'DFS - Wikipedia', url: 'https://en.wikipedia.org/wiki/Depth-first_search' },
        { title: 'Graph Traversal - Khan Academy', url: 'https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/describing-graphs' }
      ]
    }
  },
  {
    id: 'bfs',
    name: 'Breadth First Search',
    category: 'Graphs',
    description: 'An algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
      timeRating: 'good',
      spaceRating: 'average',
    },
    code: {
      python: {
        iterative: `from collections import deque
def bfs(graph, start):
    visited, queue = {start}, deque([start])
    while queue:
        vertex = queue.popleft()
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return visited`,
      },
      cpp: {
        iterative: `void BFS(int s) {
    queue<int> q;
    visited[s] = true;
    q.push(s);
    while(!q.empty()) {
        s = q.front(); q.pop();
        for(auto i = adj[s].begin(); i != adj[s].end(); ++i) {
            if(!visited[*i]) {
                visited[*i] = true;
                q.push(*i);
            }
        }
    }
}`,
      },
      c: {
        iterative: `void bfs(struct Graph* graph, int startNode) {
    struct queue* q = createQueue();
    graph->visited[startNode] = 1;
    enqueue(q, startNode);
    while (!isEmpty(q)) {
        int currentNode = dequeue(q);
        struct node* temp = graph->adjLists[currentNode];
        while (temp) {
            int adjVertex = temp->vertex;
            if (graph->visited[adjVertex] == 0) {
                graph->visited[adjVertex] = 1;
                enqueue(q, adjVertex);
            }
            temp = temp->next;
        }
    }
}`,
      },
      rust: {
        iterative: `fn bfs(graph: &Graph, start: NodeId) {
    let mut visited = HashSet::new();
    let mut queue = VecDeque::new();
    visited.insert(start);
    queue.push_back(start);
    while let Some(node) = queue.pop_front() {
        for &neighbor in &graph[node] {
            if visited.insert(neighbor) {
                queue.push_back(neighbor);
            }
        }
    }
}`,
      }
    },
    explanation: {
      problem: 'Finding the shortest path in an unweighted graph.',
      intuition: 'Like a ripple in a pond. You visit all immediate neighbors first, then their neighbors, and so on, moving outwards in layers.',
      walkthrough: '1. Add the start node to a queue and mark it as visited.\n2. While the queue is not empty:\n3. Dequeue a node and visit all its unvisited neighbors.\n4. Mark each neighbor as visited and add it to the queue.',
      whenToUse: 'Finding the shortest path in unweighted graphs, social networking (friends of friends), and web crawling.',
      funFact: 'BFS was invented in 1945 by Konrad Zuse for his (unimplemented) Plankalkül programming language, but not published until 1972.',
      researchLinks: [
        { title: 'BFS - Wikipedia', url: 'https://en.wikipedia.org/wiki/Breadth-first_search' },
        { title: 'Breadth-First Search - Brilliant', url: 'https://brilliant.org/wiki/breadth-first-search-bfs/' }
      ]
    }
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'Graphs',
    description: "An algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks.",
    complexity: {
      time: 'O(E log V)',
      space: 'O(V)',
      timeRating: 'good',
      spaceRating: 'average',
    },
    code: {
      python: {
        iterative: `import heapq
def dijkstra(graph, start):
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
      },
      cpp: {
        iterative: `void dijkstra(int s) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, s});
    dist[s] = 0;
    while (!pq.empty()) {
        int u = pq.top().second; pq.pop();
        for (auto x : adj[u]) {
            int v = x.first, weight = x.second;
            if (dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`,
      },
      c: {
        iterative: `void dijkstra(int graph[V][V], int src) {
    int dist[V]; bool sptSet[V];
    for (int i = 0; i < V; i++) dist[i] = INT_MAX, sptSet[i] = false;
    dist[src] = 0;
    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, sptSet);
        sptSet[u] = true;
        for (int v = 0; v < V; v++)
            if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX && dist[u] + graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
    }
}`,
      },
      rust: {
        iterative: `fn dijkstra(graph: &Graph, start: NodeId) -> HashMap<NodeId, i32> {
    let mut distances = HashMap::new();
    let mut pq = BinaryHeap::new();
    distances.insert(start, 0);
    pq.push(Reverse((0, start)));
    while let Some(Reverse((dist, node))) = pq.pop() {
        if dist > *distances.get(&node).unwrap_or(&i32::MAX) { continue; }
        for &(neighbor, weight) in &graph[node] {
            let new_dist = dist + weight;
            if new_dist < *distances.get(&neighbor).unwrap_or(&i32::MAX) {
                distances.insert(neighbor, new_dist);
                pq.push(Reverse((new_dist, neighbor)));
            }
        }
    }
    distances
}`,
      }
    },
    explanation: {
      problem: 'Finding the shortest path between nodes in a weighted graph.',
      intuition: 'Greedy exploration. Always pick the closest unvisited node and update its neighbors distances.',
      walkthrough: '1. Set distance to start node as 0 and all others as infinity.\n2. Use a priority queue to always pick the node with the smallest distance.\n3. For the picked node, update the distances of all its neighbors.\n4. Repeat until all nodes are visited or the target is reached.',
      whenToUse: 'GPS navigation, network routing protocols (OSPF), and finding the cheapest flight path.',
      funFact: 'Edsger Dijkstra designed the algorithm in about 20 minutes while sitting at a cafe with his fiancée.',
      researchLinks: [
        { title: 'Dijkstra - Wikipedia', url: 'https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm' },
        { title: 'Shortest Path - MIT OCW', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-16-dijkstra/' }
      ]
    }
  }
];
