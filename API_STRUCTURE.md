# AlgoFlow API Structure - Complete Documentation

## Algorithm API Structure

### Complete Algorithm Object

```json
{
  "id": "bubble-sort",
  "name": "Bubble Sort",
  "category": "Sorting Algorithms",
  "icon": "ListOrdered",
  "description": "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  
  "complexity": {
    "time": "O(n²)",
    "space": "O(1)",
    "timeRating": "bad",
    "spaceRating": "good"
  },
  
  "code": {
    "python": {
      "classCode": "class BubbleSort:\n    def __init__(self, arr):\n        self.arr = arr\n    \n    def sort(self):\n        n = len(self.arr)\n        for i in range(n):\n            for j in range(0, n-i-1):\n                if self.arr[j] > self.arr[j+1]:\n                    self.arr[j], self.arr[j+1] = self.arr[j+1], self.arr[j]\n        return self.arr",
      
      "classOutcome": "[1, 2, 3, 4, 5]",
      "classRuntime": "24ms",
      
      "functionCode": "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr",
      
      "functionOutcome": "[1, 2, 3, 4, 5]",
      "functionRuntime": "18ms",
      
      "recursiveCode": "def bubble_sort_recursive(arr, n):\n    if n == 1:\n        return arr\n    for i in range(n-1):\n        if arr[i] > arr[i+1]:\n            arr[i], arr[i+1] = arr[i+1], arr[i]\n    return bubble_sort_recursive(arr, n-1)",
      
      "recursiveOutcome": "[1, 2, 3, 4, 5]",
      "recursiveRuntime": "32ms"
    },
    
    "cpp": {
      "classCode": "class BubbleSort {\nprivate:\n    vector<int> arr;\npublic:\n    BubbleSort(vector<int> a) : arr(a) {}\n    \n    vector<int> sort() {\n        int n = arr.size();\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n-i-1; j++) {\n                if (arr[j] > arr[j+1]) {\n                    swap(arr[j], arr[j+1]);\n                }\n            }\n        }\n        return arr;\n    }\n};",
      
      "classOutcome": "[1, 2, 3, 4, 5]",
      "classRuntime": "12ms",
      
      "functionCode": "void bubbleSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n-i-1; j++) {\n            if (arr[j] > arr[j+1]) {\n                swap(arr[j], arr[j+1]);\n            }\n        }\n    }\n}",
      
      "functionOutcome": "[1, 2, 3, 4, 5]",
      "functionRuntime": "10ms",
      
      "recursiveCode": "void bubbleSortRecursive(vector<int>& arr, int n) {\n    if (n == 1) return;\n    for (int i = 0; i < n-1; i++) {\n        if (arr[i] > arr[i+1]) {\n            swap(arr[i], arr[i+1]);\n        }\n    }\n    bubbleSortRecursive(arr, n-1);\n}",
      
      "recursiveOutcome": "[1, 2, 3, 4, 5]",
      "recursiveRuntime": "15ms"
    },
    
    "c": {
      "classCode": "// C doesn't support classes natively\n// Use struct-based approach instead",
      
      "classOutcome": "N/A",
      "classRuntime": "N/A",
      
      "functionCode": "void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n-i-1; j++) {\n            if (arr[j] > arr[j+1]) {\n                int temp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = temp;\n            }\n        }\n    }\n}",
      
      "functionOutcome": "[1, 2, 3, 4, 5]",
      "functionRuntime": "8ms",
      
      "recursiveCode": "void bubbleSortRecursive(int arr[], int n) {\n    if (n == 1) return;\n    for (int i = 0; i < n-1; i++) {\n        if (arr[i] > arr[i+1]) {\n            int temp = arr[i];\n            arr[i] = arr[i+1];\n            arr[i+1] = temp;\n        }\n    }\n    bubbleSortRecursive(arr, n-1);\n}",
      
      "recursiveOutcome": "[1, 2, 3, 4, 5]",
      "recursiveRuntime": "12ms"
    },
    
    "rust": {
      "classCode": "struct BubbleSort {\n    arr: Vec<i32>,\n}\n\nimpl BubbleSort {\n    fn new(arr: Vec<i32>) -> Self {\n        BubbleSort { arr }\n    }\n    \n    fn sort(&mut self) -> &Vec<i32> {\n        let n = self.arr.len();\n        for i in 0..n {\n            for j in 0..n-i-1 {\n                if self.arr[j] > self.arr[j+1] {\n                    self.arr.swap(j, j+1);\n                }\n            }\n        }\n        &self.arr\n    }\n}",
      
      "classOutcome": "[1, 2, 3, 4, 5]",
      "classRuntime": "6ms",
      
      "functionCode": "fn bubble_sort(arr: &mut Vec<i32>) {\n    let n = arr.len();\n    for i in 0..n {\n        for j in 0..n-i-1 {\n            if arr[j] > arr[j+1] {\n                arr.swap(j, j+1);\n            }\n        }\n    }\n}",
      
      "functionOutcome": "[1, 2, 3, 4, 5]",
      "functionRuntime": "5ms",
      
      "recursiveCode": "fn bubble_sort_recursive(arr: &mut Vec<i32>, n: usize) {\n    if n == 1 { return; }\n    for i in 0..n-1 {\n        if arr[i] > arr[i+1] {\n            arr.swap(i, i+1);\n        }\n    }\n    bubble_sort_recursive(arr, n-1);\n}",
      
      "recursiveOutcome": "[1, 2, 3, 4, 5]",
      "recursiveRuntime": "8ms"
    }
  },
  
  "explanation": {
    "problem": "Sorting a list of elements in ascending or descending order.",
    "intuition": "Imagine bubbles rising to the surface. In each pass, the largest unsorted element 'bubbles up' to its correct position at the end of the array.",
    "walkthrough": "1. Start from the first element.\n2. Compare it with the next element.\n3. If current > next, swap them.\n4. Move to the next pair.\n5. Repeat until the end of the array (the largest element is now at the end).\n6. Repeat the whole process for the remaining unsorted elements.",
    "whenToUse": "Rarely used in production due to O(n²) complexity. Good for educational purposes or very small, nearly sorted datasets.",
    "funFact": "Bubble sort is one of the oldest sorting algorithms, dating back to the late 1950s.",
    "researchLinks": [
      {
        "title": "Bubble Sort - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Bubble_sort"
      },
      {
        "title": "Sorting Algorithms Visualized",
        "url": "https://www.toptal.com/developers/sorting-algorithms/bubble-sort"
      }
    ]
  },
  
  "assets": [
    {
      "id": "asset-001",
      "name": "Bubble Sort Visualization.pdf",
      "type": "pdf",
      "data": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cKL1BhZ2VzIDIgMCBSPj4KZW5kb2JqCjIgMCBvYmoKPDwvVHlwZS9QYWdlcwovS2lkc1szIDAgUl0KL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3hbMCAwIDYxMiA3OTJdPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDQKL1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMTk4CiUlRU9G"
    },
    {
      "id": "asset-002",
      "name": "Bubble Sort Algorithm Diagram.png",
      "type": "image",
      "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    },
    {
      "id": "asset-003",
      "name": "Bubble Sort Tutorial Video.mp4",
      "type": "video",
      "data": "data:video/mp4;base64,AAAAIGZ0eXBlbXA0MgAAAAFpc29tYXZjMQAAAAQIZnJlZQAAACBtZGF0AAAC7wYFAB+qn3X..."
    },
    {
      "id": "asset-004",
      "name": "Algorithm Notes.txt",
      "type": "text",
      "data": "data:text/plain;base64,QnViYmxlIFNvcnQgTm90ZXM6Ci0gU2ltcGxlIGFsZ29yaXRobQotIE8obuKCKp0gdGltZSBjb21wbGV4aXR5Ci0gTm90IHN1aXRhYmxlIGZvciBsYXJnZSBkYXRhc2V0cw=="
    }
  ],
  
  "questions": [
    {
      "id": "q1-python",
      "text": "Implement the core swap logic for Bubble Sort in Python.",
      "answer": "if arr[j] > arr[j + 1]:\n    arr[j], arr[j + 1] = arr[j + 1], arr[j]",
      "language": "python",
      "explanation": "The core of bubble sort is comparing adjacent elements and swapping them if they are in the wrong order. Python's tuple unpacking makes this swap elegant."
    },
    {
      "id": "q2-cpp",
      "text": "What is the base condition for a recursive Bubble Sort in C++?",
      "answer": "if (n == 1) return;",
      "language": "cpp",
      "explanation": "In a recursive implementation, if the array size is 1, it is already sorted. This is the base case that stops the recursion."
    },
    {
      "id": "q3-c",
      "text": "How do you swap two elements in C for Bubble Sort?",
      "answer": "int temp = arr[j];\narr[j] = arr[j+1];\narr[j+1] = temp;",
      "language": "c",
      "explanation": "C requires a temporary variable to swap two elements. This is a classic three-step swap operation."
    },
    {
      "id": "q4-rust",
      "text": "What method does Rust use to swap elements in a vector?",
      "answer": "arr.swap(j, j+1);",
      "language": "rust",
      "explanation": "Rust provides a built-in swap() method for vectors, which is safer and more efficient than manual swapping."
    },
    {
      "id": "q5-python",
      "text": "What is the worst-case time complexity of Bubble Sort?",
      "answer": "O(n²)",
      "language": "python",
      "explanation": "In the worst case (reverse sorted array), Bubble Sort requires n-1 passes with n-1, n-2, ..., 1 comparisons, resulting in O(n²) time complexity."
    }
  ],
  
  "createdAt": "2026-03-15T10:30:00Z",
  "updatedAt": "2026-03-15T10:30:00Z"
}
```

---

## Django Model Structure

### Algorithm Model

```python
class Algorithm(models.Model):
    # Core identity
    algo_id = models.CharField(max_length=200, unique=True)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    icon = models.CharField(max_length=100, default='Sparkles')
    description = models.TextField()
    
    # Complexity
    complexity_time = models.CharField(max_length=50)
    complexity_space = models.CharField(max_length=50)
    complexity_time_rating = models.CharField(max_length=10, choices=TIME_RATING_CHOICES)
    complexity_space_rating = models.CharField(max_length=10, choices=TIME_RATING_CHOICES)
    
    # Code - JSONField for each language
    code_python = models.JSONField(default=dict)
    # {
    #   "classCode": "...",
    #   "classOutcome": "...",
    #   "classRuntime": "...",
    #   "functionCode": "...",
    #   "functionOutcome": "...",
    #   "functionRuntime": "...",
    #   "recursiveCode": "...",
    #   "recursiveOutcome": "...",
    #   "recursiveRuntime": "..."
    # }
    
    code_cpp = models.JSONField(default=dict)
    code_c = models.JSONField(default=dict)
    code_rust = models.JSONField(default=dict)
    
    # Explanation
    explanation_problem = models.TextField()
    explanation_intuition = models.TextField()
    explanation_walkthrough = models.TextField()
    explanation_when_to_use = models.TextField()
    explanation_fun_fact = models.TextField()
    explanation_research_links = models.JSONField(default=list)
    # [{"title": "...", "url": "..."}]
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Asset Model

```python
class Asset(models.Model):
    ASSET_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)
    asset_id = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=10, choices=ASSET_TYPE_CHOICES)
    data = models.TextField()  # Base64 encoded data
```

### Question Model

```python
class Question(models.Model):
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('cpp', 'C++'),
        ('c', 'C'),
        ('rust', 'Rust'),
    ]
    
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)
    question_id = models.CharField(max_length=100)
    text = models.TextField()
    answer = models.TextField()
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    explanation = models.TextField()
```

---

## API Endpoints

### GET /api/algorithms/

**Response:**
```json
[
  {
    "id": "bubble-sort",
    "name": "Bubble Sort",
    "category": "Sorting Algorithms",
    "icon": "ListOrdered",
    "description": "...",
    "complexity": {
      "time": "O(n²)",
      "space": "O(1)",
      "timeRating": "bad",
      "spaceRating": "good"
    },
    "code": {
      "python": { ... },
      "cpp": { ... },
      "c": { ... },
      "rust": { ... }
    },
    "assets": [ ... ],
    "questions": [ ... ],
    "createdAt": "2026-03-15T10:30:00Z",
    "updatedAt": "2026-03-15T10:30:00Z"
  }
]
```

### GET /api/algorithms/{id}/

**Response:**
```json
{
  "id": "bubble-sort",
  "name": "Bubble Sort",
  ...
}
```

### POST /api/algorithms/

**Request:**
```json
{
  "id": "bubble-sort",
  "name": "Bubble Sort",
  "category": "Sorting Algorithms",
  "icon": "ListOrdered",
  "description": "...",
  "complexity": {
    "time": "O(n²)",
    "space": "O(1)",
    "timeRating": "bad",
    "spaceRating": "good"
  },
  "code": {
    "python": {
      "classCode": "...",
      "classOutcome": "...",
      "classRuntime": "...",
      "functionCode": "...",
      "functionOutcome": "...",
      "functionRuntime": "...",
      "recursiveCode": "...",
      "recursiveOutcome": "...",
      "recursiveRuntime": "..."
    },
    "cpp": { ... },
    "c": { ... },
    "rust": { ... }
  },
  "explanation": {
    "problem": "...",
    "intuition": "...",
    "walkthrough": "...",
    "whenToUse": "...",
    "funFact": "...",
    "researchLinks": [...]
  },
  "assets": [
    {
      "id": "asset-001",
      "name": "Document.pdf",
      "type": "pdf",
      "data": "data:application/pdf;base64,..."
    }
  ],
  "questions": [
    {
      "id": "q1",
      "text": "Question text?",
      "answer": "Answer code",
      "language": "python",
      "explanation": "Explanation"
    }
  ]
}
```

**Response:**
```json
{
  "id": "bubble-sort",
  "name": "Bubble Sort",
  ...
}
```

---

## Field Descriptions

### Code Fields (Per Language)

| Field | Type | Description |
|-------|------|-------------|
| `classCode` | string | OOP implementation |
| `classOutcome` | string | Expected output for class implementation |
| `classRuntime` | string | Execution time for class (e.g., "24ms") |
| `functionCode` | string | Procedural implementation |
| `functionOutcome` | string | Expected output for function |
| `functionRuntime` | string | Execution time for function |
| `recursiveCode` | string | Recursive implementation |
| `recursiveOutcome` | string | Expected output for recursive |
| `recursiveRuntime` | string | Execution time for recursive |

### Asset Types

| Type | Description | Data Format |
|------|-------------|-------------|
| `pdf` | PDF documents | `data:application/pdf;base64,...` |
| `image` | Images (PNG, JPG, etc.) | `data:image/png;base64,...` |
| `video` | Video files (MP4, etc.) | `data:video/mp4;base64,...` |
| `text` | Text files | `data:text/plain;base64,...` |

### Question Languages

| Language | Value |
|----------|-------|
| Python | `python` |
| C++ | `cpp` |
| C | `c` |
| Rust | `rust` |

### Complexity Ratings

| Rating | Value |
|--------|-------|
| Good | `good` |
| Average | `average` |
| Bad | `bad` |

---

## Example: Complete Algorithm with All Fields

See the complete JSON example at the top of this document for a fully populated algorithm with:
- ✅ All 4 languages (Python, C++, C, Rust)
- ✅ 3 implementations per language (Class, Function, Recursive)
- ✅ Outcome and Runtime for each implementation
- ✅ 5 questions with different languages
- ✅ 4 assets (PDF, Image, Video, Text)
- ✅ Complete explanation with research links

---

**This is the complete API structure for AlgoFlow algorithms.**
