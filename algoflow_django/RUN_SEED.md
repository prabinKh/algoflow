# 🌱 Seed Database - Quick Guide

## Run This Command

```bash
cd algoflow_django
source ../../.venv/bin/activate
python manage.py shell < seed_algorithms.py
```

## What You Get

✅ **2 Algorithms** with complete data:
- Bubble Sort
- Binary Search

✅ **Each has:**
- Code in 4 languages (Python, C++, C, Rust)
- 3 implementations each (Class, Function, Recursive)
- Outcome & Runtime for EACH implementation
- 5 Questions with answers
- 2 Sample assets
- Full explanations

## Verify

```bash
python manage.py shell
>>> from algorithms.models import Algorithm
>>> Algorithm.objects.count()
2
```

## Then View

1. Start app: `./docker-control.sh start`
2. Go to: http://localhost
3. Browse algorithms

---

For full details, see `SEED_GUIDE.md`
