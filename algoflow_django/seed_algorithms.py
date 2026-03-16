# ═══════════════════════════════════════════════════════════
# Seed Database with Sample Algorithms
# Run with: python manage.py shell < seed_algorithms.py
# ═══════════════════════════════════════════════════════════

from algorithms.models import Category, Algorithm, Question, Asset
import json

def create_category(name, icon='Box'):
    """Create or get category"""
    cat, created = Category.objects.get_or_create(
        name=name,
        defaults={'icon': icon}
    )
    if created:
        print(f"✓ Created category: {name}")
    return cat

def create_algorithm(category, algo_id, name, description, icon, 
                     time_complexity, space_complexity, 
                     time_rating, space_rating,
                     code_python, code_cpp, code_c, code_rust,
                     explanation_problem, explanation_intuition,
                     explanation_walkthrough, explanation_when_to_use,
                     explanation_fun_fact, research_links):
    """Create algorithm with all fields"""
    
    algo, created = Algorithm.objects.get_or_create(
        algo_id=algo_id,
        defaults={
            'name': name,
            'category': category,
            'icon': icon,
            'description': description,
            'complexity_time': time_complexity,
            'complexity_space': space_complexity,
            'complexity_time_rating': time_rating,
            'complexity_space_rating': space_rating,
            'code_python': code_python,
            'code_cpp': code_cpp,
            'code_c': code_c,
            'code_rust': code_rust,
            'explanation_problem': explanation_problem,
            'explanation_intuition': explanation_intuition,
            'explanation_walkthrough': explanation_walkthrough,
            'explanation_when_to_use': explanation_when_to_use,
            'explanation_fun_fact': explanation_fun_fact,
            'explanation_research_links': research_links,
        }
    )
    
    if created:
        print(f"  ✓ Created algorithm: {name}")
    else:
        print(f"  → Algorithm exists: {name}")
    
    return algo

def add_question(algo, qid, text, answer, language, explanation=""):
    """Add question to algorithm"""
    question, created = Question.objects.get_or_create(
        algorithm=algo,
        question_id=qid,
        defaults={
            'text': text,
            'answer': answer,
            'language': language,
            'explanation': explanation,
        }
    )
    if created:
        print(f"    ✓ Added question {qid} ({language})")

def add_asset(algo, asset_id, name, asset_type, data):
    """Add asset to algorithm"""
    asset, created = Asset.objects.get_or_create(
        algorithm=algo,
        asset_id=asset_id,
        defaults={
            'name': name,
            'asset_type': asset_type,
            'data': data,
        }
    )
    if created:
        print(f"    ✓ Added asset: {name}")

# ═══════════════════════════════════════════════════════════
# ALGORITHM 1: BUBBLE SORT
# ═══════════════════════════════════════════════════════════

def seed_bubble_sort():
    print("\n📦 Bubble Sort")
    print("─" * 50)
    
    category = create_category("Sorting Algorithms", "ListOrdered")
    
    # Python Code
    code_python = {
        "classCode": """class BubbleSort:
    def __init__(self, arr):
        self.arr = arr
    
    def sort(self):
        n = len(self.arr)
        for i in range(n):
            for j in range(0, n-i-1):
                if self.arr[j] > self.arr[j+1]:
                    self.arr[j], self.arr[j+1] = self.arr[j+1], self.arr[j]
        return self.arr""",
        "classOutcome": "[1, 2, 3, 4, 5]",
        "classRuntime": "24ms",
        "functionCode": """def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr""",
        "functionOutcome": "[1, 2, 3, 4, 5]",
        "functionRuntime": "18ms",
        "recursiveCode": """def bubble_sort_recursive(arr, n):
    if n == 1:
        return arr
    for i in range(n-1):
        if arr[i] > arr[i+1]:
            arr[i], arr[i+1] = arr[i+1], arr[i]
    return bubble_sort_recursive(arr, n-1)""",
        "recursiveOutcome": "[1, 2, 3, 4, 5]",
        "recursiveRuntime": "32ms"
    }
    
    # C++ Code
    code_cpp = {
        "classCode": """class BubbleSort {
private:
    vector<int> arr;
public:
    BubbleSort(vector<int> a) : arr(a) {}
    
    vector<int> sort() {
        int n = arr.size();
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n-i-1; j++) {
                if (arr[j] > arr[j+1]) {
                    swap(arr[j], arr[j+1]);
                }
            }
        }
        return arr;
    }
};""",
        "classOutcome": "[1, 2, 3, 4, 5]",
        "classRuntime": "12ms",
        "functionCode": """void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}""",
        "functionOutcome": "[1, 2, 3, 4, 5]",
        "functionRuntime": "10ms",
        "recursiveCode": """void bubbleSortRecursive(vector<int>& arr, int n) {
    if (n == 1) return;
    for (int i = 0; i < n-1; i++) {
        if (arr[i] > arr[i+1]) {
            swap(arr[i], arr[i+1]);
        }
    }
    bubbleSortRecursive(arr, n-1);
}""",
        "recursiveOutcome": "[1, 2, 3, 4, 5]",
        "recursiveRuntime": "15ms"
    }
    
    # C Code
    code_c = {
        "classCode": "// C doesn't support classes natively",
        "classOutcome": "N/A",
        "classRuntime": "N/A",
        "functionCode": """void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}""",
        "functionOutcome": "[1, 2, 3, 4, 5]",
        "functionRuntime": "8ms",
        "recursiveCode": """void bubbleSortRecursive(int arr[], int n) {
    if (n == 1) return;
    for (int i = 0; i < n-1; i++) {
        if (arr[i] > arr[i+1]) {
            int temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
        }
    }
    bubbleSortRecursive(arr, n-1);
}""",
        "recursiveOutcome": "[1, 2, 3, 4, 5]",
        "recursiveRuntime": "12ms"
    }
    
    # Rust Code
    code_rust = {
        "classCode": """struct BubbleSort {
    arr: Vec<i32>,
}

impl BubbleSort {
    fn new(arr: Vec<i32>) -> Self {
        BubbleSort { arr }
    }
    
    fn sort(&mut self) -> &Vec<i32> {
        let n = self.arr.len();
        for i in 0..n {
            for j in 0..n-i-1 {
                if self.arr[j] > self.arr[j+1] {
                    self.arr.swap(j, j+1);
                }
            }
        }
        &self.arr
    }
}""",
        "classOutcome": "[1, 2, 3, 4, 5]",
        "classRuntime": "6ms",
        "functionCode": """fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..n-i-1 {
            if arr[j] > arr[j+1] {
                arr.swap(j, j+1);
            }
        }
    }
}""",
        "functionOutcome": "[1, 2, 3, 4, 5]",
        "functionRuntime": "5ms",
        "recursiveCode": """fn bubble_sort_recursive(arr: &mut Vec<i32>, n: usize) {
    if n == 1 { return; }
    for i in 0..n-1 {
        if arr[i] > arr[i+1] {
            arr.swap(i, i+1);
        }
    }
    bubble_sort_recursive(arr, n-1);
}""",
        "recursiveOutcome": "[1, 2, 3, 4, 5]",
        "recursiveRuntime": "8ms"
    }
    
    # Create Algorithm
    algo = create_algorithm(
        category=category,
        algo_id="bubble-sort",
        name="Bubble Sort",
        description="A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        icon="ListOrdered",
        time_complexity="O(n²)",
        space_complexity="O(1)",
        time_rating="bad",
        space_rating="good",
        code_python=code_python,
        code_cpp=code_cpp,
        code_c=code_c,
        code_rust=code_rust,
        explanation_problem="Sorting a list of elements in ascending or descending order.",
        explanation_intuition="Imagine bubbles rising to the surface. In each pass, the largest unsorted element 'bubbles up' to its correct position at the end of the array.",
        explanation_walkthrough="1. Start from the first element.\n2. Compare it with the next element.\n3. If current > next, swap them.\n4. Move to the next pair.\n5. Repeat until the end of the array.\n6. Repeat for remaining elements.",
        explanation_when_to_use="Educational purposes or very small, nearly sorted datasets.",
        explanation_fun_fact="Bubble sort is one of the oldest sorting algorithms, dating back to the late 1950s.",
        research_links=[
            {"title": "Bubble Sort - Wikipedia", "url": "https://en.wikipedia.org/wiki/Bubble_sort"},
            {"title": "Visual Sort", "url": "https://www.toptal.com/developers/sorting-algorithms"}
        ]
    )
    
    # Add Questions
    add_question(algo, "q1-py", "Implement swap logic in Python", 
                "if arr[j] > arr[j + 1]:\n    arr[j], arr[j + 1] = arr[j + 1], arr[j]",
                "python", "Python's tuple unpacking makes swap elegant")
    
    add_question(algo, "q2-cpp", "Base condition for recursive Bubble Sort in C++?",
                "if (n == 1) return;",
                "cpp", "Array of size 1 is already sorted")
    
    add_question(algo, "q3-c", "How to swap in C?",
                "int temp = arr[j];\narr[j] = arr[j+1];\narr[j+1] = temp;",
                "c", "C requires temporary variable")
    
    add_question(algo, "q4-rust", "Rust swap method?",
                "arr.swap(j, j+1);",
                "rust", "Built-in swap() is safer")
    
    add_question(algo, "q5-py", "Worst-case time complexity?",
                "O(n²)",
                "python", "Reverse sorted array requires n² comparisons")
    
    # Add Assets (Sample base64 data)
    add_asset(algo, "asset-1", "Bubble Sort Notes.pdf", "pdf",
              "data:application/pdf;base64,JVBERi0xLjQKJeLjz9M=")
    
    add_asset(algo, "asset-2", "Algorithm Diagram.png", "image",
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")

# ═══════════════════════════════════════════════════════════
# ALGORITHM 2: BINARY SEARCH
# ═══════════════════════════════════════════════════════════

def seed_binary_search():
    print("\n🔍 Binary Search")
    print("─" * 50)
    
    category = create_category("Searching Algorithms", "Search")
    
    code_python = {
        "classCode": """class BinarySearch:
    def search(self, arr, target):
        left, right = 0, len(arr) - 1
        while left <= right:
            mid = (left + right) // 2
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1""",
        "classOutcome": "2",
        "classRuntime": "2ms",
        "functionCode": """def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1""",
        "functionOutcome": "2",
        "functionRuntime": "1ms",
        "recursiveCode": """def binary_search_recursive(arr, target, left, right):
    if left > right:
        return -1
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)""",
        "recursiveOutcome": "2",
        "recursiveRuntime": "3ms"
    }
    
    code_cpp = {
        "classCode": """class BinarySearch {
public:
    int search(vector<int>& arr, int target) {
        int left = 0, right = arr.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
};""",
        "classOutcome": "2",
        "classRuntime": "1ms",
        "functionCode": """int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}""",
        "functionOutcome": "2",
        "functionRuntime": "1ms",
        "recursiveCode": """int binarySearchRecursive(vector<int>& arr, int target, int left, int right) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) 
        return binarySearchRecursive(arr, target, mid + 1, right);
    else 
        return binarySearchRecursive(arr, target, left, mid - 1);
}""",
        "functionOutcome": "2",
        "functionRuntime": "2ms"
    }
    
    code_c = {
        "classCode": "// C doesn't support classes",
        "classOutcome": "N/A",
        "classRuntime": "N/A",
        "functionCode": """int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}""",
        "functionOutcome": "2",
        "functionRuntime": "1ms",
        "recursiveCode": """int binarySearchRecursive(int arr[], int target, int left, int right) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target)
        return binarySearchRecursive(arr, target, mid + 1, right);
    else
        return binarySearchRecursive(arr, target, left, mid - 1);
}""",
        "recursiveOutcome": "2",
        "recursiveRuntime": "2ms"
    }
    
    code_rust = {
        "classCode": """struct BinarySearch;

impl BinarySearch {
    fn search(arr: &[i32], target: i32) -> Option<usize> {
        let mut left = 0;
        let mut right = arr.len();
        while left < right {
            let mid = left + (right - left) / 2;
            if arr[mid] == target {
                return Some(mid);
            } else if arr[mid] < target {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        None
    }
}""",
        "classOutcome": "Some(2)",
        "classRuntime": "1ms",
        "functionCode": """fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len();
    while left < right {
        let mid = left + (right - left) / 2;
        if arr[mid] == target {
            return Some(mid);
        } else if arr[mid] < target {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    None
}""",
        "functionOutcome": "Some(2)",
        "functionRuntime": "0ms",
        "recursiveCode": """fn binary_search_recursive(arr: &[i32], target: i32, left: usize, right: usize) -> Option<usize> {
    if left >= right { return None; }
    let mid = left + (right - left) / 2;
    if arr[mid] == target {
        return Some(mid);
    } else if arr[mid] < target {
        binary_search_recursive(arr, target, mid + 1, right)
    } else {
        binary_search_recursive(arr, target, left, mid)
    }
}""",
        "recursiveOutcome": "Some(2)",
        "recursiveRuntime": "1ms"
    }
    
    algo = create_algorithm(
        category=category,
        algo_id="binary-search",
        name="Binary Search",
        description="An efficient algorithm for finding an item from a sorted list of items by repeatedly dividing the search interval in half.",
        icon="Search",
        time_complexity="O(log n)",
        space_complexity="O(1)",
        time_rating="excellent",
        space_rating="good",
        code_python=code_python,
        code_cpp=code_cpp,
        code_c=code_c,
        code_rust=code_rust,
        explanation_problem="Finding a target value in a sorted array.",
        explanation_intuition="Like looking for a word in a dictionary. Open in middle, see if target is before or after, discard half.",
        explanation_walkthrough="1. Compare target with middle element.\n2. If equal, found it!\n3. If target < middle, search left half.\n4. If target > middle, search right half.\n5. Repeat until found or search space empty.",
        explanation_when_to_use="When data is sorted and you need fast lookups.",
        explanation_fun_fact="Binary search was first described in 1946, but the first correct implementation appeared 16 years later!",
        research_links=[
            {"title": "Binary Search - Wikipedia", "url": "https://en.wikipedia.org/wiki/Binary_search_algorithm"}
        ]
    )
    
    # Questions
    add_question(algo, "q1-py", "Calculate mid index without overflow",
                "mid = left + (right - left) // 2",
                "python", "Prevents integer overflow")
    
    add_question(algo, "q2-cpp", "Time complexity?",
                "O(log n)",
                "cpp", "Halves search space each iteration")
    
    add_question(algo, "q3-c", "Base case for recursive version?",
                "if (left > right) return -1;",
                "c", "Search space exhausted")
    
    add_question(algo, "q4-rust", "Return type in Rust?",
                "Option<usize>",
                "rust", "None if not found, Some(index) if found")
    
    add_question(algo, "q5-py", "Precondition for binary search?",
                "Array must be sorted",
                "python", "Algorithm relies on sorted order")

# ═══════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🌱 Seeding AlgoFlow Database")
    print("=" * 60)
    
    seed_bubble_sort()
    seed_binary_search()
    
    print("\n" + "=" * 60)
    print("✅ Database seeded successfully!")
    print("=" * 60)
    print("\n📊 Summary:")
    print(f"  Categories: {Category.objects.count()}")
    print(f"  Algorithms: {Algorithm.objects.count()}")
    print(f"  Questions: {Question.objects.count()}")
    print(f"  Assets: {Asset.objects.count()}")
    print("\n🎉 Done!\n")
