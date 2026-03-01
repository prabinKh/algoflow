from django.core.management.base import BaseCommand
from algorithms.models import Category, Algorithm


class Command(BaseCommand):
    help = 'Seed the database with initial algorithm data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')
        
        # Create categories
        categories_data = [
            {'name': 'Sorting Algorithms', 'icon': 'ListOrdered'},
            {'name': 'Searching Algorithms', 'icon': 'Search'},
            {'name': 'Graphs', 'icon': 'Share2'},
            {'name': 'Dynamic Programming', 'icon': 'Layers'},
            {'name': 'Data Structures', 'icon': 'Database'},
        ]
        
        for cat_data in categories_data:
            Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'icon': cat_data['icon']}
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(categories_data)} categories'))
        
        # Create sample algorithms
        algorithms_data = [
            {
                'id': 'bubble-sort',
                'name': 'Bubble Sort',
                'category': 'Sorting Algorithms',
                'description': 'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
                'icon': 'ListOrdered',
                'complexity': {
                    'time': 'O(n²)',
                    'space': 'O(1)',
                    'timeRating': 'bad',
                    'spaceRating': 'good',
                },
                'code': {
                    'python': {
                        'iterative': '''def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr''',
                    },
                    'cpp': {
                        'iterative': '''void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}''',
                    },
                    'c': {
                        'iterative': '''void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}''',
                    },
                    'rust': {
                        'iterative': '''fn bubble_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..n - i - 1 {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}''',
                    },
                },
                'explanation': {
                    'problem': 'Sorting a list of elements in ascending or descending order.',
                    'intuition': 'Imagine bubbles rising to the surface. In each pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.',
                    'walkthrough': '1. Start from the first element.\n2. Compare it with the next element.\n3. If current > next, swap them.\n4. Move to the next pair.\n5. Repeat until the end of the array (the largest element is now at the end).\n6. Repeat the whole process for the remaining unsorted elements.',
                    'whenToUse': 'Rarely used in production due to O(n²) complexity. Good for educational purposes or very small, nearly sorted datasets.',
                    'funFact': 'Bubble sort is one of the oldest sorting algorithms, dating back to the late 1950s.',
                    'researchLinks': [
                        {'title': 'Bubble Sort - Wikipedia', 'url': 'https://en.wikipedia.org/wiki/Bubble_sort'},
                    ]
                },
                'assets': []
            },
            {
                'id': 'binary-search',
                'name': 'Binary Search',
                'category': 'Searching Algorithms',
                'description': 'An efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.',
                'icon': 'Search',
                'complexity': {
                    'time': 'O(log n)',
                    'space': 'O(1)',
                    'timeRating': 'good',
                    'spaceRating': 'good',
                },
                'code': {
                    'python': {
                        'iterative': '''def binary_search(arr, target):
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
    return -1''',
                        'recursive': '''def binary_search_recursive(arr, low, high, target):
    if high >= low:
        mid = (high + low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] > target:
            return binary_search_recursive(arr, low, mid - 1, target)
        else:
            return binary_search_recursive(arr, mid + 1, high, target)
    else:
        return -1''',
                    },
                    'cpp': {
                        'iterative': '''int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}''',
                    },
                    'c': {
                        'iterative': '''int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}''',
                    },
                    'rust': {
                        'iterative': '''fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
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
}''',
                    },
                },
                'explanation': {
                    'problem': 'Finding the position of a target value within a sorted array.',
                    'intuition': 'Like looking for a word in a dictionary. You open it in the middle, see if the word is before or after, and discard the other half.',
                    'walkthrough': '1. Compare target with the middle element.\n2. If equal, you found it!\n3. If target < middle, search the left half.\n4. If target > middle, search the right half.\n5. Repeat until found or the search space is empty.',
                    'whenToUse': 'When the data is sorted and you need fast lookups.',
                    'funFact': 'Although the idea is simple, implementing binary search correctly is notoriously tricky. The first correct version was published 16 years after the first description of the algorithm.',
                    'researchLinks': [
                        {'title': 'Binary Search - Wikipedia', 'url': 'https://en.wikipedia.org/wiki/Binary_search_algorithm'},
                    ]
                },
                'assets': []
            },
        ]
        
        created_count = 0
        for algo_data in algorithms_data:
            category = Category.objects.get(name=algo_data['category'])
            complexity = algo_data.pop('complexity')
            
            algorithm, created = Algorithm.objects.update_or_create(
                id=algo_data['id'],
                defaults={
                    'name': algo_data['name'],
                    'category': category,
                    'description': algo_data['description'],
                    'icon': algo_data['icon'],
                    'complexity_time': complexity['time'],
                    'complexity_space': complexity['space'],
                    'complexity_time_rating': complexity['timeRating'],
                    'complexity_space_rating': complexity['spaceRating'],
                    'code': algo_data['code'],
                    'explanation': algo_data['explanation'],
                    'assets': algo_data['assets'],
                }
            )
            if created:
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {created_count} algorithms'))
        self.stdout.write(self.style.SUCCESS('Database seeding complete!'))
