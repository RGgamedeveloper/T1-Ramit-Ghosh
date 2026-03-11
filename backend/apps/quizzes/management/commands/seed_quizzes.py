"""
Management command to seed demo quiz data.
Usage: python manage.py seed_quizzes
"""
from django.core.management.base import BaseCommand
from apps.quizzes.models import Category, Quiz, Question, Choice


SEED_DATA = [
    {
        "category": {"name": "Python", "slug": "python", "icon": "🐍", "color": "#3776ab"},
        "quizzes": [
            {
                "title": "Python Fundamentals",
                "description": "Test your understanding of core Python concepts including data types, control flow, and built-in functions.",
                "difficulty": "easy",
                "time_limit_seconds": 600,
                "questions": [
                    {
                        "text": "What is the output of print(type([])) in Python?",
                        "explanation": "An empty list [] is of type <class 'list'> in Python.",
                        "choices": [
                            ("&lt;class 'list'&gt;", True),
                            ("&lt;class 'array'&gt;", False),
                            ("&lt;class 'tuple'&gt;", False),
                            ("&lt;class 'dict'&gt;", False),
                        ],
                    },
                    {
                        "text": "Which keyword is used to define a function in Python?",
                        "explanation": "The 'def' keyword is used to define functions in Python.",
                        "choices": [
                            ("function", False),
                            ("def", True),
                            ("func", False),
                            ("define", False),
                        ],
                    },
                    {
                        "text": "What does the 'len()' function return?",
                        "explanation": "len() returns the number of items in a container.",
                        "choices": [
                            ("The last element", False),
                            ("The number of items", True),
                            ("The first element", False),
                            ("A boolean", False),
                        ],
                    },
                    {
                        "text": "Which of these is a mutable data type in Python?",
                        "explanation": "Lists are mutable in Python, unlike tuples and strings.",
                        "choices": [
                            ("Tuple", False),
                            ("String", False),
                            ("List", True),
                            ("Integer", False),
                        ],
                    },
                    {
                        "text": "What operator is used for exponentiation in Python?",
                        "explanation": "The ** operator raises a number to a power, e.g. 2**3 = 8.",
                        "choices": [
                            ("^", False),
                            ("**", True),
                            ("//", False),
                            ("%%", False),
                        ],
                    },
                ],
            },
            {
                "title": "Advanced Python Patterns",
                "description": "Explore advanced Python topics like decorators, generators, context managers, and metaclasses.",
                "difficulty": "hard",
                "time_limit_seconds": 900,
                "questions": [
                    {
                        "text": "What does the @property decorator do?",
                        "explanation": "@property allows a method to be accessed like an attribute.",
                        "choices": [
                            ("Makes a method static", False),
                            ("Allows attribute-style access to a method", True),
                            ("Makes a method private", False),
                            ("Caches the return value", False),
                        ],
                    },
                    {
                        "text": "What is a generator in Python?",
                        "explanation": "Generators use 'yield' to produce values lazily, one at a time.",
                        "choices": [
                            ("A function that returns a list", False),
                            ("A function that uses yield", True),
                            ("A class that implements __iter__", False),
                            ("A built-in data type", False),
                        ],
                    },
                    {
                        "text": "Which dunder method makes an object callable?",
                        "explanation": "__call__ allows an object to be used like a function.",
                        "choices": [
                            ("__init__", False),
                            ("__call__", True),
                            ("__enter__", False),
                            ("__get__", False),
                        ],
                    },
                    {
                        "text": "What does 'with' statement use under the hood?",
                        "explanation": "The 'with' statement uses __enter__ and __exit__ for context management.",
                        "choices": [
                            ("try/finally", False),
                            ("Decorators", False),
                            ("Context manager protocol (__enter__/__exit__)", True),
                            ("Generator protocol", False),
                        ],
                    },
                    {
                        "text": "What is the GIL in CPython?",
                        "explanation": "The Global Interpreter Lock prevents true parallel execution of Python bytecode.",
                        "choices": [
                            ("A garbage collection mechanism", False),
                            ("A global import loader", False),
                            ("A mutex preventing parallel thread execution", True),
                            ("A memory allocation strategy", False),
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": {"name": "JavaScript", "slug": "javascript", "icon": "⚡", "color": "#f7df1e"},
        "quizzes": [
            {
                "title": "JavaScript Essentials",
                "description": "Cover core JavaScript concepts including closures, prototypes, async/await, and the event loop.",
                "difficulty": "medium",
                "time_limit_seconds": 720,
                "questions": [
                    {
                        "text": "What is the result of typeof null?",
                        "explanation": "This is a well-known JavaScript bug — typeof null returns 'object'.",
                        "choices": [
                            ("'null'", False),
                            ("'undefined'", False),
                            ("'object'", True),
                            ("'boolean'", False),
                        ],
                    },
                    {
                        "text": "What does 'use strict' do?",
                        "explanation": "Strict mode catches common coding mistakes and prevents unsafe actions.",
                        "choices": [
                            ("Enables TypeScript features", False),
                            ("Enforces stricter parsing and error handling", True),
                            ("Disables console.log", False),
                            ("Enables ES6 modules", False),
                        ],
                    },
                    {
                        "text": "What is a closure in JavaScript?",
                        "explanation": "A closure is a function that retains access to its lexical scope.",
                        "choices": [
                            ("A self-invoking function", False),
                            ("A function bundled with its lexical environment", True),
                            ("A way to close a browser tab", False),
                            ("An arrow function", False),
                        ],
                    },
                    {
                        "text": "Which method converts JSON string to an object?",
                        "explanation": "JSON.parse() deserialises a JSON string into a JavaScript value.",
                        "choices": [
                            ("JSON.stringify()", False),
                            ("JSON.parse()", True),
                            ("JSON.toObject()", False),
                            ("JSON.decode()", False),
                        ],
                    },
                    {
                        "text": "What is the event loop?",
                        "explanation": "The event loop handles async callbacks by polling the task queue.",
                        "choices": [
                            ("A for loop for DOM events", False),
                            ("A mechanism that handles async execution", True),
                            ("A React lifecycle method", False),
                            ("A Node.js module", False),
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": {"name": "React", "slug": "react", "icon": "⚛️", "color": "#61dafb"},
        "quizzes": [
            {
                "title": "React & Hooks Deep Dive",
                "description": "Master React hooks, component lifecycle, state management, and performance patterns.",
                "difficulty": "medium",
                "time_limit_seconds": 720,
                "questions": [
                    {
                        "text": "What hook is used for side effects in React?",
                        "explanation": "useEffect handles side effects like data fetching and subscriptions.",
                        "choices": [
                            ("useState", False),
                            ("useEffect", True),
                            ("useContext", False),
                            ("useReducer", False),
                        ],
                    },
                    {
                        "text": "What is the purpose of React.memo?",
                        "explanation": "React.memo prevents re-renders if props haven't changed.",
                        "choices": [
                            ("To create memoized values", False),
                            ("To skip re-rendering when props are the same", True),
                            ("To store data in memory", False),
                            ("To handle async operations", False),
                        ],
                    },
                    {
                        "text": "What does useRef return?",
                        "explanation": "useRef returns a mutable ref object with a .current property.",
                        "choices": [
                            ("A state variable", False),
                            ("A mutable ref object", True),
                            ("A callback function", False),
                            ("A DOM element", False),
                        ],
                    },
                    {
                        "text": "How do you share state between distant components?",
                        "explanation": "Context API (useContext) provides state to deeply nested components.",
                        "choices": [
                            ("Props drilling only", False),
                            ("Global variables", False),
                            ("Context API or state management library", True),
                            ("Local storage", False),
                        ],
                    },
                    {
                        "text": "What triggers a re-render in React?",
                        "explanation": "State or prop changes cause React to re-render a component.",
                        "choices": [
                            ("Calling a function", False),
                            ("State or prop changes", True),
                            ("DOM manipulation", False),
                            ("CSS changes", False),
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": {"name": "DevOps", "slug": "devops", "icon": "🚀", "color": "#e535ab"},
        "quizzes": [
            {
                "title": "Docker & Kubernetes Basics",
                "description": "Understand containerization fundamentals, Docker commands, and Kubernetes architecture.",
                "difficulty": "medium",
                "time_limit_seconds": 600,
                "questions": [
                    {
                        "text": "What is a Docker container?",
                        "explanation": "A container is a lightweight, isolated process running from an image.",
                        "choices": [
                            ("A virtual machine", False),
                            ("A lightweight isolated runtime from an image", True),
                            ("A database", False),
                            ("A network protocol", False),
                        ],
                    },
                    {
                        "text": "What file defines a Docker image?",
                        "explanation": "A Dockerfile contains instructions to build a Docker image.",
                        "choices": [
                            ("docker-compose.yml", False),
                            ("Dockerfile", True),
                            ("Makefile", False),
                            ("package.json", False),
                        ],
                    },
                    {
                        "text": "What is a Kubernetes Pod?",
                        "explanation": "A Pod is the smallest deployable unit, containing one or more containers.",
                        "choices": [
                            ("A virtual machine", False),
                            ("The smallest deployable unit in k8s", True),
                            ("A Docker image", False),
                            ("A load balancer", False),
                        ],
                    },
                    {
                        "text": "What command lists running Docker containers?",
                        "explanation": "'docker ps' shows currently running containers.",
                        "choices": [
                            ("docker list", False),
                            ("docker ps", True),
                            ("docker run", False),
                            ("docker images", False),
                        ],
                    },
                    {
                        "text": "What is the purpose of a Kubernetes Service?",
                        "explanation": "A Service exposes Pods to network traffic with a stable endpoint.",
                        "choices": [
                            ("To build containers", False),
                            ("To expose Pods to network traffic", True),
                            ("To store data", False),
                            ("To schedule cron jobs", False),
                        ],
                    },
                ],
            },
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample quizzes for demo purposes"

    def handle(self, *args, **options):
        for cat_data in SEED_DATA:
            category, _ = Category.objects.get_or_create(
                slug=cat_data["category"]["slug"],
                defaults=cat_data["category"],
            )
            self.stdout.write(f"  Category: {category.name}")

            for quiz_data in cat_data["quizzes"]:
                questions_data = quiz_data.pop("questions")
                quiz, created = Quiz.objects.get_or_create(
                    title=quiz_data["title"],
                    defaults={**quiz_data, "category": category, "is_published": True},
                )
                if not created:
                    self.stdout.write(f"    Quiz already exists: {quiz.title}")
                    quiz_data["questions"] = questions_data
                    continue

                for idx, q_data in enumerate(questions_data):
                    choices_data = q_data.pop("choices")
                    question = Question.objects.create(
                        quiz=quiz, text=q_data["text"],
                        explanation=q_data.get("explanation", ""), order=idx + 1,
                    )
                    for choice_text, is_correct in choices_data:
                        Choice.objects.create(
                            question=question, text=choice_text, is_correct=is_correct,
                        )

                quiz_data["questions"] = questions_data
                self.stdout.write(self.style.SUCCESS(f"    ✓ {quiz.title} ({len(questions_data)} questions)"))

        self.stdout.write(self.style.SUCCESS("\n✅ Seed data loaded successfully!"))
