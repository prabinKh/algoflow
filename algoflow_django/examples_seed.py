# ===  examples_seed.py ===
# Run with: python manage.py shell < examples_seed.py
#     or paste into the shell interactively

from django.db import transaction
from algorithms.models import Category, Algorithm, Question, Asset

import json


def create_category(name, icon='Box'):
    cat, created = Category.objects.get_or_create(
        name=name,
        defaults={'icon': icon}
    )
    if created:
        print(f"Created category: {name}")
    return cat


def create_algorithm(category, algo_id, name, description="", icon="Sparkles",
                     time="O(n log n)", space="O(n)", time_rating="good", space_rating="average",
                     python_code=None):

    algo, created = Algorithm.objects.get_or_create(
        algo_id=algo_id,
        defaults={
            'name': name,
            'category': category,
            'icon': icon,
            'description': description.strip(),
            'complexity_time': time,
            'complexity_space': space,
            'complexity_time_rating': time_rating,
            'complexity_space_rating': space_rating,
            'code_python': python_code or {},
        }
    )

    if created:
        print(f"→ Created algorithm: {name}  ({algo_id})")
    else:
        print(f"→ Algorithm already exists: {name}")

    return algo


def add_question(algo, qid, text, answer, language='python', explanation=""):
    Question.objects.create(
        algorithm=algo,
        question_id=qid,
        text=text.strip(),
        answer=answer.strip(),
        language=language,
        explanation=explanation.strip()
    )
    print(f"  Added question {qid} ({language})")


@transaction.atomic
def seed_examples():
    # ───────────────────────────────────────────────
    # 1. Sorting → Quick Sort
    # ───────────────────────────────────────────────
    cat_sort = create_category("Sorting", icon="ArrowUpDown")

    quicksort = create_algorithm(
        category=cat_sort,
        algo_id="quick-sort",
        name="Quick Sort",
        description="Efficient divide-and-conquer sorting algorithm using pivots.",
        icon="Zap",
        time="O(n log n) average, O(n²) worst",
        space="O(log n) average",
        time_rating="good",
        space_rating="average",
        python_code={
            "functionCode": """def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr)//2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)"""
        }
    )

    add_question(quicksort, "q1",
        "What is the average time complexity of Quick Sort?",
        "O(n log n)",
        explanation="Achieved when the pivot splits the array into roughly equal halves."
    )

    add_question(quicksort, "q2",
        "How can we make Quick Sort more reliable (avoid worst-case often)?",
        "Use random pivot, median-of-three, or switch to heapsort/insertion sort for small partitions.",
        explanation="Randomization or good pivot selection greatly reduces probability of O(n²)."
    )

    # ───────────────────────────────────────────────
    # 2. Graphs → Dijkstra
    # ───────────────────────────────────────────────
    cat_graph = create_category("Graphs", "Network")

    dijkstra = create_algorithm(
        category=cat_graph,
        algo_id="dijkstra",
        name="Dijkstra's Algorithm",
        description="Finds shortest paths from one node to all others in a weighted graph (non-negative weights).",
        icon="Navigation",
        time="O((V + E) log V) with binary heap",
        space="O(V)",
        time_rating="good",
        space_rating="average"
    )

    add_question(dijkstra, "q1",
        "Can Dijkstra handle negative edge weights?",
        "No",
        explanation="Negative weights break the greedy assumption → use Bellman-Ford instead."
    )

    # ───────────────────────────────────────────────
    # 3. Dynamic Programming → Fibonacci
    # ───────────────────────────────────────────────
    cat_dp = create_category("Dynamic Programming", "Calculator")

    fib = create_algorithm(
        category=cat_dp,
        algo_id="fibonacci-dp",
        name="Fibonacci (DP / Memoization)",
        description="Classic DP example — computing Fibonacci efficiently.",
        time="O(n)",
        space="O(n) or O(1) optimized",
        time_rating="good",
        space_rating="good",
        python_code={
            "functionCode": """def fib(n, memo={}):
    if n in memo: return memo[n]
    if n <= 2: return 1
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]"""
        }
    )

    add_question(fib, "q1",
        "What's the time complexity of naive recursive Fibonacci?",
        "O(2^n) ≈ O(φ^n)",
        explanation="Exponential due to repeated computation of same subproblems."
    )

    # ───────────────────────────────────────────────
    # 4. Searching → Binary Search
    # ───────────────────────────────────────────────
    cat_search = create_category("Searching", "Search")

    binary_search = create_algorithm(
        cat_search,
        "binary-search",
        "Binary Search",
        "Finds element in **sorted** array by repeatedly dividing search interval in half.",
        icon="BinarySearch",
        time="O(log n)",
        space="O(1) iterative / O(log n) recursive",
        time_rating="excellent",
        space_rating="good"
    )

    add_question(binary_search, "q1",
        "What precondition must be true for binary search to work correctly?",
        "The array must be sorted.",
        explanation="Without sorted order, we cannot discard half of the search space."
    )

    # ───────────────────────────────────────────────
    # 5. Trees → Binary Search Tree (basic operations)
    # ───────────────────────────────────────────────
    cat_tree = create_category("Trees", "BinaryTree")

    bst = create_algorithm(
        cat_tree,
        "binary-search-tree",
        "Binary Search Tree",
        "Sorted binary tree data structure with O(log n) average case operations.",
        time="O(log n) avg, O(n) worst",
        space="O(n)",
        time_rating="good",
        space_rating="average"
    )

    add_question(bst, "q1",
        "What is the worst-case time complexity for search/insert/delete in a BST?",
        "O(n)",
        explanation="Happens when tree degenerates into a linked list (sorted input)."
    )


if __name__ == "__main__":
    print("Seeding example algorithms...\n")
    seed_examples()
    print("\nDone! You now have 5 example algorithms with questions.")