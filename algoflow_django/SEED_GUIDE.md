# 🌱 Database Seeding Guide

## Quick Start

### Run the Seed Script

```bash
cd algoflow_django

# Activate virtual environment
source ../../.venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Run the seed script
python manage.py shell < seed_algorithms.py
```

### What Gets Created

The seed script creates:

**2 Categories:**
- Sorting Algorithms
- Searching Algorithms

**2 Algorithms:**
1. Bubble Sort
2. Binary Search

**Each Algorithm Includes:**
- ✅ Code in 4 languages (Python, C++, C, Rust)
- ✅ 3 implementations per language (Class, Function, Recursive)
- ✅ Outcome and Runtime for EACH implementation
- ✅ 5 Questions with answers in different languages
- ✅ 2 Sample assets (PDF, Image)
- ✅ Complete explanation with research links

### Verify Data

```bash
# Open Django shell
python manage.py shell

# Check counts
>>> from algorithms.models import Algorithm, Category, Question, Asset
>>> print(f"Categories: {Category.objects.count()}")
>>> print(f"Algorithms: {Algorithm.objects.count()}")
>>> print(f"Questions: {Question.objects.count()}")
>>> print(f"Assets: {Asset.objects.count()}")
```

### View in Browser

1. Start the app: `./docker-control.sh start`
2. Go to: http://localhost
3. Browse algorithms
4. View code in all 4 languages
5. See questions and assets

---

## Script Details

### File: `seed_algorithms.py`

**Location:** `algoflow/algoflow_django/seed_algorithms.py`

**What it does:**
- Creates categories if they don't exist
- Creates algorithms with complete data
- Adds questions for each language
- Adds sample assets
- Prevents duplicates (uses `get_or_create`)

**Safe to run multiple times** - won't create duplicates!

---

## Algorithm Data Structure

Each algorithm includes:

```json
{
  "id": "bubble-sort",
  "name": "Bubble Sort",
  "category": "Sorting Algorithms",
  
  "code": {
    "python": {
      "classCode": "...",
      "classOutcome": "[1, 2, 3, 4, 5]",
      "classRuntime": "24ms",
      "functionCode": "...",
      "functionOutcome": "[1, 2, 3, 4, 5]",
      "functionRuntime": "18ms",
      "recursiveCode": "...",
      "recursiveOutcome": "[1, 2, 3, 4, 5]",
      "recursiveRuntime": "32ms"
    },
    "cpp": { ... },
    "c": { ... },
    "rust": { ... }
  },
  
  "questions": [
    {
      "id": "q1-py",
      "text": "Implement swap in Python",
      "answer": "arr[j], arr[j+1] = arr[j+1], arr[j]",
      "language": "python",
      "explanation": "Python's tuple unpacking"
    }
  ],
  
  "assets": [
    {
      "id": "asset-1",
      "name": "Notes.pdf",
      "type": "pdf",
      "data": "data:application/pdf;base64,..."
    }
  ]
}
```

---

## Adding More Algorithms

### Copy the Pattern

1. Copy `seed_bubble_sort()` function
2. Rename to your algorithm
3. Update all fields
4. Call in `if __name__ == "__main__":`

### Example Template

```python
def seed_your_algorithm():
    print("\n📦 Your Algorithm")
    print("─" * 50)
    
    category = create_category("Your Category", "Icon")
    
    code_python = {
        "classCode": "...",
        "classOutcome": "...",
        "classRuntime": "...",
        "functionCode": "...",
        "functionOutcome": "...",
        "functionRuntime": "...",
        "recursiveCode": "...",
        "recursiveOutcome": "...",
        "recursiveRuntime": "..."
    }
    
    # Add other languages...
    
    algo = create_algorithm(
        category=category,
        algo_id="your-algo-id",
        name="Your Algorithm",
        # ... other fields
    )
    
    # Add questions
    add_question(algo, "q1", "Question?", "Answer", "python", "Explanation")
    
    # Add assets
    add_asset(algo, "asset-1", "File.pdf", "pdf", "data:...")
```

---

## Troubleshooting

### Script Not Running?

```bash
# Make sure you're in the right directory
cd algoflow_django

# Make sure venv is activated
which python  # Should point to venv

# Try running shell directly
python manage.py shell
>>> exec(open('seed_algorithms.py').read())
```

### Data Not Showing?

```bash
# Check if script ran successfully
python manage.py shell
>>> from algorithms.models import Algorithm
>>> Algorithm.objects.all()

# Check for errors in seed script
python manage.py shell < seed_algorithms.py
```

### Reset Database

```bash
# WARNING: Deletes all data!
docker-compose down -v
docker-compose up -d
./docker-control.sh migrate
./docker-control.sh superuser

# Re-seed
python manage.py shell < seed_algorithms.py
```

---

## API Structure Reference

See `API_STRUCTURE.md` for complete API documentation including:
- All field names
- Data types
- Example JSON
- Django models
- API endpoints

---

**Happy Seeding! 🌱**
