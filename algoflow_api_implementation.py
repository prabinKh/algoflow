"""
AlgoFlow API - Complete Implementation
Django Models, Serializers, Views, and Data Management
"""

import json
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict, field
from enum import Enum

# ============================================================================
# ENUMS - Define all choice fields
# ============================================================================

class ComplexityRating(Enum):
    """Complexity rating options"""
    GOOD = "good"
    AVERAGE = "average"
    BAD = "bad"


class AssetType(Enum):
    """Asset file types"""
    PDF = "pdf"
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"


class ProgrammingLanguage(Enum):
    """Supported programming languages"""
    PYTHON = "python"
    CPP = "cpp"
    C = "c"
    RUST = "rust"


# ============================================================================
# DATA CLASSES - Define the data structures
# ============================================================================

@dataclass
class Complexity:
    """Algorithm complexity information"""
    time: str
    space: str
    time_rating: ComplexityRating
    space_rating: ComplexityRating

    def to_dict(self):
        return {
            "time": self.time,
            "space": self.space,
            "timeRating": self.time_rating.value,
            "spaceRating": self.space_rating.value,
        }


@dataclass
class CodeImplementation:
    """Single code implementation for a language"""
    class_code: str
    class_outcome: str
    class_runtime: str
    function_code: str
    function_outcome: str
    function_runtime: str
    recursive_code: str
    recursive_outcome: str
    recursive_runtime: str

    def to_dict(self):
        return {
            "classCode": self.class_code,
            "classOutcome": self.class_outcome,
            "classRuntime": self.class_runtime,
            "functionCode": self.function_code,
            "functionOutcome": self.function_outcome,
            "functionRuntime": self.function_runtime,
            "recursiveCode": self.recursive_code,
            "recursiveOutcome": self.recursive_outcome,
            "recursiveRuntime": self.recursive_runtime,
        }


@dataclass
class ResearchLink:
    """Research reference link"""
    title: str
    url: str

    def to_dict(self):
        return {"title": self.title, "url": self.url}


@dataclass
class Explanation:
    """Algorithm explanation and learning materials"""
    problem: str
    intuition: str
    walkthrough: str
    when_to_use: str
    fun_fact: str
    research_links: List[ResearchLink] = field(default_factory=list)

    def to_dict(self):
        return {
            "problem": self.problem,
            "intuition": self.intuition,
            "walkthrough": self.walkthrough,
            "whenToUse": self.when_to_use,
            "funFact": self.fun_fact,
            "researchLinks": [link.to_dict() for link in self.research_links],
        }


@dataclass
class Asset:
    """Algorithm asset (PDF, Image, Video, Text)"""
    id: str
    name: str
    asset_type: AssetType
    data: str  # Base64 encoded data

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.asset_type.value,
            "data": self.data,
        }


@dataclass
class Question:
    """Practice question for an algorithm"""
    id: str
    text: str
    answer: str
    language: ProgrammingLanguage
    explanation: str

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "answer": self.answer,
            "language": self.language.value,
            "explanation": self.explanation,
        }


@dataclass
class Algorithm:
    """Complete algorithm with all components"""
    id: str
    name: str
    category: str
    icon: str
    description: str
    complexity: Complexity
    code: Dict[str, CodeImplementation]  # language -> CodeImplementation
    explanation: Explanation
    assets: List[Asset] = field(default_factory=list)
    questions: List[Question] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat() + "Z")
    updated_at: str = field(default_factory=lambda: datetime.now().isoformat() + "Z")

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "icon": self.icon,
            "description": self.description,
            "complexity": self.complexity.to_dict(),
            "code": {lang: impl.to_dict() for lang, impl in self.code.items()},
            "explanation": self.explanation.to_dict(),
            "assets": [asset.to_dict() for asset in self.assets],
            "questions": [q.to_dict() for q in self.questions],
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }

    def to_json(self):
        """Convert to JSON string"""
        return json.dumps(self.to_dict(), indent=2)


# ============================================================================
# DATABASE - In-memory storage (replace with real database)
# ============================================================================

class AlgorithmDatabase:
    """In-memory database for algorithms"""

    def __init__(self):
        self.algorithms: Dict[str, Algorithm] = {}

    def add(self, algorithm: Algorithm) -> Algorithm:
        """Add or update algorithm"""
        self.algorithms[algorithm.id] = algorithm
        return algorithm

    def get(self, algo_id: str) -> Optional[Algorithm]:
        """Get algorithm by ID"""
        return self.algorithms.get(algo_id)

    def get_all(self) -> List[Algorithm]:
        """Get all algorithms"""
        return list(self.algorithms.values())

    def delete(self, algo_id: str) -> bool:
        """Delete algorithm by ID"""
        if algo_id in self.algorithms:
            del self.algorithms[algo_id]
            return True
        return False

    def get_by_category(self, category: str) -> List[Algorithm]:
        """Get algorithms by category"""
        return [a for a in self.algorithms.values() if a.category == category]


# ============================================================================
# SAMPLE DATA - Bubble Sort Algorithm with all components
# ============================================================================

def create_bubble_sort_algorithm() -> Algorithm:
    """Create complete Bubble Sort algorithm with all fields populated"""

    # Python implementations
    python_code = CodeImplementation(
        class_code="""class BubbleSort:
    def __init__(self, arr):
        self.arr = arr
    
    def sort(self):
        n = len(self.arr)
        for i in range(n):
            for j in range(0, n-i-1):
                if self.arr[j] > self.arr[j+1]:
                    self.arr[j], self.arr[j+1] = self.arr[j+1], self.arr[j]
        return self.arr""",
        class_outcome="[1, 2, 3, 4, 5]",
        class_runtime="24ms",
        function_code="""def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr""",
        function_outcome="[1, 2, 3, 4, 5]",
        function_runtime="18ms",
        recursive_code="""def bubble_sort_recursive(arr, n):
    if n == 1:
        return arr
    for i in range(n-1):
        if arr[i] > arr[i+1]:
            arr[i], arr[i+1] = arr[i+1], arr[i]
    return bubble_sort_recursive(arr, n-1)""",
        recursive_outcome="[1, 2, 3, 4, 5]",
        recursive_runtime="32ms",
    )

    # C++ implementations
    cpp_code = CodeImplementation(
        class_code="""class BubbleSort {
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
        class_outcome="[1, 2, 3, 4, 5]",
        class_runtime="12ms",
        function_code="""void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}""",
        function_outcome="[1, 2, 3, 4, 5]",
        function_runtime="10ms",
        recursive_code="""void bubbleSortRecursive(vector<int>& arr, int n) {
    if (n == 1) return;
    for (int i = 0; i < n-1; i++) {
        if (arr[i] > arr[i+1]) {
            swap(arr[i], arr[i+1]);
        }
    }
    bubbleSortRecursive(arr, n-1);
}""",
        recursive_outcome="[1, 2, 3, 4, 5]",
        recursive_runtime="15ms",
    )

    # C implementations
    c_code = CodeImplementation(
        class_code="// C doesn't support classes natively\n// Use struct-based approach instead",
        class_outcome="N/A",
        class_runtime="N/A",
        function_code="""void bubbleSort(int arr[], int n) {
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
        function_outcome="[1, 2, 3, 4, 5]",
        function_runtime="8ms",
        recursive_code="""void bubbleSortRecursive(int arr[], int n) {
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
        recursive_outcome="[1, 2, 3, 4, 5]",
        recursive_runtime="12ms",
    )

    # Rust implementations
    rust_code = CodeImplementation(
        class_code="""struct BubbleSort {
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
        class_outcome="[1, 2, 3, 4, 5]",
        class_runtime="6ms",
        function_code="""fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..n-i-1 {
            if arr[j] > arr[j+1] {
                arr.swap(j, j+1);
            }
        }
    }
}""",
        function_outcome="[1, 2, 3, 4, 5]",
        function_runtime="5ms",
        recursive_code="""fn bubble_sort_recursive(arr: &mut Vec<i32>, n: usize) {
    if n == 1 { return; }
    for i in 0..n-1 {
        if arr[i] > arr[i+1] {
            arr.swap(i, i+1);
        }
    }
    bubble_sort_recursive(arr, n-1);
}""",
        recursive_outcome="[1, 2, 3, 4, 5]",
        recursive_runtime="8ms",
    )

    # Create complexity info
    complexity = Complexity(
        time="O(n²)",
        space="O(1)",
        time_rating=ComplexityRating.BAD,
        space_rating=ComplexityRating.GOOD,
    )

    # Create explanation
    research_links = [
        ResearchLink(
            title="Bubble Sort - Wikipedia",
            url="https://en.wikipedia.org/wiki/Bubble_sort",
        ),
        ResearchLink(
            title="Sorting Algorithms Visualized",
            url="https://www.toptal.com/developers/sorting-algorithms/bubble-sort",
        ),
    ]

    explanation = Explanation(
        problem="Sorting a list of elements in ascending or descending order.",
        intuition="Imagine bubbles rising to the surface. In each pass, the largest unsorted element 'bubbles up' to its correct position at the end of the array.",
        walkthrough="""1. Start from the first element.
2. Compare it with the next element.
3. If current > next, swap them.
4. Move to the next pair.
5. Repeat until the end of the array (the largest element is now at the end).
6. Repeat the whole process for the remaining unsorted elements.""",
        when_to_use="Rarely used in production due to O(n²) complexity. Good for educational purposes or very small, nearly sorted datasets.",
        fun_fact="Bubble sort is one of the oldest sorting algorithms, dating back to the late 1950s.",
        research_links=research_links,
    )

    # Create assets
    assets = [
        Asset(
            id="asset-001",
            name="Bubble Sort Visualization.pdf",
            asset_type=AssetType.PDF,
            data="data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cKL1BhZ2VzIDIgMCBSPj4KZW5kb2JqCjIgMCBvYmoKPDwvVHlwZS9QYWdlcwovS2lkc1szIDAgUl0KL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3hbMCAwIDYxMiA3OTJdPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDQKL1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMTk4CiUlRU9G",
        ),
        Asset(
            id="asset-002",
            name="Bubble Sort Algorithm Diagram.png",
            asset_type=AssetType.IMAGE,
            data="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        ),
        Asset(
            id="asset-003",
            name="Bubble Sort Tutorial Video.mp4",
            asset_type=AssetType.VIDEO,
            data="data:video/mp4;base64,AAAAIGZ0eXBlbXA0MgAAAAFpc29tYXZjMQAAAAQIZnJlZQAAACBtZGF0AAAC7wYFAB+qn3X...",
        ),
        Asset(
            id="asset-004",
            name="Algorithm Notes.txt",
            asset_type=AssetType.TEXT,
            data="data:text/plain;base64,QnViYmxlIFNvcnQgTm90ZXM6Ci0gU2ltcGxlIGFsZ29yaXRobQotIE8obuKCKp0gdGltZSBjb21wbGV4aXR5Ci0gTm90IHN1aXRhYmxlIGZvciBsYXJnZSBkYXRhc2V0cw==",
        ),
    ]

    # Create questions
    questions = [
        Question(
            id="q1-python",
            text="Implement the core swap logic for Bubble Sort in Python.",
            answer="""if arr[j] > arr[j + 1]:
    arr[j], arr[j + 1] = arr[j + 1], arr[j]""",
            language=ProgrammingLanguage.PYTHON,
            explanation="The core of bubble sort is comparing adjacent elements and swapping them if they are in the wrong order. Python's tuple unpacking makes this swap elegant.",
        ),
        Question(
            id="q2-cpp",
            text="What is the base condition for a recursive Bubble Sort in C++?",
            answer="if (n == 1) return;",
            language=ProgrammingLanguage.CPP,
            explanation="In a recursive implementation, if the array size is 1, it is already sorted. This is the base case that stops the recursion.",
        ),
        Question(
            id="q3-c",
            text="How do you swap two elements in C for Bubble Sort?",
            answer="""int temp = arr[j];
arr[j] = arr[j+1];
arr[j+1] = temp;""",
            language=ProgrammingLanguage.C,
            explanation="C requires a temporary variable to swap two elements. This is a classic three-step swap operation.",
        ),
        Question(
            id="q4-rust",
            text="What method does Rust use to swap elements in a vector?",
            answer="arr.swap(j, j+1);",
            language=ProgrammingLanguage.RUST,
            explanation="Rust provides a built-in swap() method for vectors, which is safer and more efficient than manual swapping.",
        ),
        Question(
            id="q5-python",
            text="What is the worst-case time complexity of Bubble Sort?",
            answer="O(n²)",
            language=ProgrammingLanguage.PYTHON,
            explanation="In the worst case (reverse sorted array), Bubble Sort requires n-1 passes with n-1, n-2, ..., 1 comparisons, resulting in O(n²) time complexity.",
        ),
    ]

    # Create algorithm
    algorithm = Algorithm(
        id="bubble-sort",
        name="Bubble Sort",
        category="Sorting Algorithms",
        icon="ListOrdered",
        description="A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        complexity=complexity,
        code={
            ProgrammingLanguage.PYTHON.value: python_code,
            ProgrammingLanguage.CPP.value: cpp_code,
            ProgrammingLanguage.C.value: c_code,
            ProgrammingLanguage.RUST.value: rust_code,
        },
        explanation=explanation,
        assets=assets,
        questions=questions,
    )

    return algorithm


# ============================================================================
# API HANDLERS - Simulate REST API endpoints
# ============================================================================

class AlgorithmAPI:
    """API handler for algorithm operations"""

    def __init__(self):
        self.db = AlgorithmDatabase()

    def create_algorithm(self, algorithm: Algorithm) -> Dict:
        """POST /api/algorithms/"""
        saved = self.db.add(algorithm)
        return {
            "status": "success",
            "message": f"Algorithm '{algorithm.name}' created successfully",
            "data": saved.to_dict(),
        }

    def get_all_algorithms(self) -> Dict:
        """GET /api/algorithms/"""
        algorithms = self.db.get_all()
        return {
            "status": "success",
            "count": len(algorithms),
            "data": [algo.to_dict() for algo in algorithms],
        }

    def get_algorithm(self, algo_id: str) -> Dict:
        """GET /api/algorithms/{id}/"""
        algorithm = self.db.get(algo_id)
        if not algorithm:
            return {
                "status": "error",
                "message": f"Algorithm with ID '{algo_id}' not found",
                "data": None,
            }
        return {"status": "success", "data": algorithm.to_dict()}

    def update_algorithm(self, algo_id: str, updated_fields: Dict) -> Dict:
        """PUT /api/algorithms/{id}/"""
        algorithm = self.db.get(algo_id)
        if not algorithm:
            return {
                "status": "error",
                "message": f"Algorithm with ID '{algo_id}' not found",
                "data": None,
            }

        # Update timestamp
        algorithm.updated_at = datetime.now().isoformat() + "Z"

        # Update fields (simple update)
        for key, value in updated_fields.items():
            if hasattr(algorithm, key):
                setattr(algorithm, key, value)

        self.db.add(algorithm)
        return {
            "status": "success",
            "message": "Algorithm updated successfully",
            "data": algorithm.to_dict(),
        }

    def delete_algorithm(self, algo_id: str) -> Dict:
        """DELETE /api/algorithms/{id}/"""
        if self.db.delete(algo_id):
            return {
                "status": "success",
                "message": f"Algorithm '{algo_id}' deleted successfully",
            }
        return {
            "status": "error",
            "message": f"Algorithm with ID '{algo_id}' not found",
        }

    def get_algorithms_by_category(self, category: str) -> Dict:
        """GET /api/algorithms/category/{category}/"""
        algorithms = self.db.get_by_category(category)
        return {
            "status": "success",
            "count": len(algorithms),
            "category": category,
            "data": [algo.to_dict() for algo in algorithms],
        }


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main function to demonstrate the API"""

    print("=" * 80)
    print("AlgoFlow API - Complete Implementation Demo")
    print("=" * 80)
    print()

    # Initialize API
    api = AlgorithmAPI()

    # Create and add Bubble Sort algorithm
    print("1. Creating Bubble Sort Algorithm...")
    print("-" * 80)
    bubble_sort = create_bubble_sort_algorithm()
    response = api.create_algorithm(bubble_sort)
    print(f"Status: {response['status']}")
    print(f"Message: {response['message']}")
    print()

    # Get all algorithms
    print("2. Fetching All Algorithms...")
    print("-" * 80)
    response = api.get_all_algorithms()
    print(f"Status: {response['status']}")
    print(f"Count: {response['count']}")
    print()

    # Get specific algorithm
    print("3. Fetching Bubble Sort Algorithm (by ID)...")
    print("-" * 80)
    response = api.get_algorithm("bubble-sort")
    print(f"Status: {response['status']}")
    print(f"Algorithm Name: {response['data']['name']}")
    print(f"Category: {response['data']['category']}")
    print(f"Description: {response['data']['description'][:80]}...")
    print()

    # Display complexity
    print("4. Algorithm Complexity...")
    print("-" * 80)
    complexity = response["data"]["complexity"]
    print(f"Time Complexity: {complexity['time']} ({complexity['timeRating']})")
    print(f"Space Complexity: {complexity['space']} ({complexity['spaceRating']})")
    print()

    # Display code implementations
    print("5. Code Implementations (Python)...")
    print("-" * 80)
    python_code = response["data"]["code"]["python"]
    print("Function Implementation:")
    print(python_code["functionCode"])
    print(f"Expected Output: {python_code['functionOutcome']}")
    print(f"Runtime: {python_code['functionRuntime']}")
    print()

    # Display explanation
    print("6. Algorithm Explanation...")
    print("-" * 80)
    explanation = response["data"]["explanation"]
    print(f"Problem: {explanation['problem']}")
    print(f"Intuition: {explanation['intuition']}")
    print(f"Fun Fact: {explanation['funFact']}")
    print()

    # Display assets
    print("7. Algorithm Assets...")
    print("-" * 80)
    assets = response["data"]["assets"]
    print(f"Total Assets: {len(assets)}")
    for asset in assets:
        print(f"  - {asset['name']} ({asset['type']})")
    print()

    # Display questions
    print("8. Practice Questions...")
    print("-" * 80)
    questions = response["data"]["questions"]
    print(f"Total Questions: {len(questions)}")
    for q in questions:
        print(f"  - [{q['language']}] {q['text']}")
    print()

    # Display as JSON
    print("9. Complete Algorithm as JSON...")
    print("-" * 80)
    print(bubble_sort.to_json())
    print()

    # Save to file
    print("10. Saving to File...")
    print("-" * 80)
    with open("bubble_sort_algorithm.json", "w") as f:
        f.write(bubble_sort.to_json())
    print("✓ Saved to: bubble_sort_algorithm.json")
    print()

    print("=" * 80)
    print("Demo Complete!")
    print("=" * 80)


if __name__ == "__main__":
    main()
