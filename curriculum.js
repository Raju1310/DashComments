const curriculum = [
  {
    week: 1,
    title: "Python Foundations",
    description: "Building the muscle memory for code.",
    days: [
      {
        day: 1,
        title: "The Environment & Variables",
        description: "Setting up your digital workspace.",
        subtopics: [
          {
            title: "IDE Setup (VS Code / Colab)",
            explanation: "We don't code in Word. We use IDEs (Integrated Development Environments). Google Colab is the easiest start—it runs in the cloud. VS Code is the pro tool for your laptop. \n\n**Key Concept:** Jupyter Notebooks (.ipynb) let you run code in 'cells' one chunk at a time, perfect for data science.",
            resources: [
              { type: "read", title: "Quick Guide", content: "1. Go to colab.research.google.com\n2. Click 'New Notebook'\n3. Type `print('Hello World')` and press Shift+Enter." },
              { type: "video", title: "VS Code Setup", url: "https://www.youtube.com/embed/BZnPdYX1Vpk" }
            ],
            task: "Install VS Code locally OR create a Google Colab notebook."
          },
          {
            title: "Variables & Types",
            explanation: "Data needs a container. Variables are those containers. \n\n- **String (str):** Text, wrapped in quotes. `'Hello'`\n- **Integer (int):** Whole numbers. `42`\n- **Float (float):** Decimals. `3.14`\n- **Boolean (bool):** Truth. `True` or `False`.\n\nPython figures out the type automatically (Dynamic Typing).",
            resources: [
              { type: "read", title: "Deep Dive", content: "To check a type, use `type(variable)`. e.g., `type(3.14)` returns `<class 'float'>`." },
              { type: "video", title: "Variables in 5 mins", url: "https://www.youtube.com/embed/cKzcRG0501A" }
            ],
            task: "Create variables for your `name` (str), `age` (int), and `height` (float). Print them."
          }
        ]
      },
      {
        day: 2,
        title: "Control Flow",
        description: "Teaching the computer to think.",
        subtopics: [
          {
            title: "Conditionals (If/Elif/Else)",
            explanation: "Logic is simple: If A is true, do B. Otherwise, do C.\n\n```python\nif age >= 18:\n    print('Vote')\nelse:\n    print('Wait')\n```\n\nIndentation (whitespace) matters in Python! It defines the block of code.",
            resources: [
               { type: "read", title: "Logic Tables", content: "True and True = True\nTrue and False = False\nTrue or False = True" },
               { type: "video", title: "Conditionals", url: "https://www.youtube.com/embed/Zp5MuPOtsSY" }
            ],
            task: "Write a script to grade a student based on marks (90+ A, 80+ B, etc.)."
          },
          {
            title: "Loops (For & While)",
            explanation: "Computers are great at boring, repetitive tasks. \n\n**For Loop:** Iterate over a known list. `for x in list:`\n**While Loop:** Keep going as long as a condition is true. `while hungry == True:`\n\nAvoid infinite while loops!",
            resources: [
              { type: "video", title: "Python Loops", url: "https://www.youtube.com/embed/6iF8Xb7Z3wQ" }
            ],
            task: "Print the first 10 numbers of the Fibonacci sequence."
          }
        ]
      },
      {
        day: 3,
        title: "Data Structures I",
        description: "Lists and Tuples.",
        subtopics: [
          {
            title: "Lists",
            explanation: "A mutable (changeable) sequence. Ordered. \n`my_list = [1, 2, 'apple']`\n\n**Indexing:** Computers start counting at 0. `my_list[0]` is 1.\n**Slicing:** `my_list[0:2]` gives the first two items.",
            resources: [
              { type: "video", title: "Lists", url: "https://www.youtube.com/embed/ohCDWZgNIU0" }
            ],
            task: "Create a list of 5 cities. Append a new one. Print the 3rd city."
          }
        ]
      },
      {
        day: 4,
        title: "Data Structures II",
        description: "Dictionaries and Sets.",
        subtopics: [
          {
            title: "Dictionaries",
            explanation: "Key-Value pairs. Fast lookups. \n`user = {'id': 1, 'name': 'Jules'}`\n\nThink of it like a JSON object. You access data by key, not index: `user['name']`.",
            resources: [
              { type: "video", title: "Dictionaries", url: "https://www.youtube.com/embed/xcJhQda5p98" }
            ],
            task: "Create a dictionary representing a Car (Make, Model, Year). Change the Year."
          }
        ]
      },
      {
        day: 5,
        title: "Functions",
        description: "Reusable logic blocks.",
        subtopics: [
          {
            title: "Defining Functions",
            explanation: "`def function_name(input):`\n\nFunctions keep code DRY (Don't Repeat Yourself). They take arguments and `return` a result. Variables created inside are 'local' (invisible outside).",
            resources: [
              { type: "video", title: "Functions", url: "https://www.youtube.com/embed/NE97ylAnrz4" }
            ],
            task: "Write a function `is_palindrome(text)` that returns True if text is same backwards."
          }
        ]
      },
      {
        day: 6,
        title: "Modules & Libraries",
        description: "Using other people's code.",
        subtopics: [
          {
            title: "Importing",
            explanation: "Python has a massive 'Standard Library'. \n`import math` lets you use `math.sqrt(4)`.\n`import random` lets you generate random numbers.\n\nYou can also import your own files.",
            resources: [
              { type: "read", title: "Std Lib", content: "Common imports: os, sys, math, datetime, random, json." }
            ],
            task: "Import `random`. Create a 'Guess the Number' game."
          }
        ]
      },
      {
        day: 7,
        title: "Week 1 Project",
        description: "Review and consolidation.",
        subtopics: [
          {
            title: "Text Analyzer",
            explanation: "Build a tool that takes a paragraph of text and calculates:\n1. Word count\n2. Sentence count\n3. Average word length\n4. Most common word",
            resources: [],
            task: "Build the Text Analyzer without using external libraries like NLTK."
          }
        ]
      }
    ]
  },
  {
    week: 2,
    title: "Advanced Python",
    description: "Leveling up: OOP and Errors.",
    days: [
      {
        day: 8,
        title: "List Comprehensions",
        description: "The Pythonic way.",
        subtopics: [
          {
            title: "One-liners",
            explanation: "Instead of a 3-line loop to create a list, do it in one.\n\nLoop:\n```python\nres = []\nfor x in range(10):\n  res.append(x*2)\n```\n\nComprehension:\n```python\nres = [x*2 for x in range(10)]\n```",
            resources: [
              { type: "video", title: "Comprehensions", url: "https://www.youtube.com/embed/AhSvKGTh28Q" }
            ],
            task: "Use a comprehension to create a list of squares for even numbers 0-20."
          }
        ]
      },
      {
        day: 9,
        title: "Error Handling",
        description: "Expecting the unexpected.",
        subtopics: [
          {
            title: "Try / Except",
            explanation: "Code breaks. Files are missing. Internet goes down. \nWrap risky code in `try` blocks.\n\n```python\ntry:\n  print(1/0)\nexcept ZeroDivisionError:\n  print('Cannot divide by zero')\n```",
            resources: [],
            task: "Write a function that asks for a number input and handles if the user types 'apple'."
          }
        ]
      },
      {
        day: 10,
        title: "File I/O",
        description: "Reading and Writing.",
        subtopics: [
          {
            title: "With Open",
            explanation: "Always use context managers (`with open(...)`) so files close automatically.\n\n`with open('data.txt', 'r') as f:`\n`  content = f.read()`",
            resources: [],
            task: "Write a script to read a text file, count the lines, and write the count to a new file."
          }
        ]
      },
      {
        day: 11,
        title: "OOP Basics",
        description: "Object Oriented Programming.",
        subtopics: [
          {
            title: "Classes & Objects",
            explanation: "A Class is a blueprint (e.g., 'Dog'). An Object is an instance ('Buddy').\nClasses have Attributes (data) and Methods (functions).",
            resources: [
               { type: "video", title: "OOP Python", url: "https://www.youtube.com/embed/JeznW_7DlB0" }
            ],
            task: "Create a `BankAccount` class with `deposit`, `withdraw`, and `balance` methods."
          }
        ]
      },
      {
        day: 12,
        title: "Lambda & Map/Filter",
        description: "Functional programming concepts.",
        subtopics: [
          {
            title: "Anonymous Functions",
            explanation: "`lambda x: x + 1` is a function without a name. Useful for passing short functions into `map` or `filter`.",
            resources: [],
            task: "Use `filter` and a `lambda` to extract all names starting with 'A' from a list."
          }
        ]
      },
      {
        day: 13,
        title: "APIs & JSON",
        description: "Talking to the web.",
        subtopics: [
          {
            title: "Requests Module",
            explanation: "Most data comes from APIs. Python's `requests` library is the standard.\n`r = requests.get('https://api.github.com')`\n`data = r.json()`",
            resources: [
               { type: "video", title: "Python Requests", url: "https://www.youtube.com/embed/qriL9Qe8cps" }
            ],
            task: "Fetch the current weather for your city using a free Weather API (e.g., OpenMeteo)."
          }
        ]
      },
      {
        day: 14,
        title: "Week 2 Project",
        description: "Portfolio Builder.",
        subtopics: [
           {
             title: "Weather Dashboard CLI",
             explanation: "Build a Command Line Interface tool that asks the user for a city and displays formatted weather info (Temp, Humidity, Condition).",
             resources: [],
             task: "Complete the CLI tool."
           }
        ]
      }
    ]
  },
  {
    week: 3,
    title: "NumPy & Pandas",
    description: "The Engine Room of Data Science.",
    days: [
      {
        day: 15,
        title: "Intro to NumPy",
        description: "Numerical Python.",
        subtopics: [
          {
            title: "The ndarray",
            explanation: "Standard Python lists are slow. NumPy arrays are fast (C-speed). They must contain the same data type.\n\nOperations are 'Vectorized' (applied to all elements at once).",
            resources: [
              { type: "video", title: "NumPy Intro", url: "https://www.youtube.com/embed/QUT1VHiLmmI" }
            ],
            task: "Create a 3x3 matrix of random numbers. Find the max value."
          }
        ]
      },
      {
        day: 16,
        title: "NumPy Operations",
        description: "Broadcasting and Indexing.",
        subtopics: [
          {
            title: "Broadcasting",
            explanation: "Magic that allows math between arrays of different shapes. If you add `[1, 2, 3] + 5`, NumPy broadcasts 5 to `[5, 5, 5]` and adds them.",
            resources: [],
            task: "Normalize a random 5x5 matrix (subtract mean, divide by std dev)."
          }
        ]
      },
      {
        day: 17,
        title: "Intro to Pandas",
        description: "Tabular Data.",
        subtopics: [
          {
            title: "DataFrame & Series",
            explanation: "DataFrame = Table. Series = Column.\n`pd.read_csv('file.csv')` is the most common starting point.",
            resources: [
              { type: "video", title: "Pandas Intro", url: "https://www.youtube.com/embed/vmEHCJofslg" }
            ],
            task: "Load a CSV. Print `.head()`, `.info()`, and `.describe()`."
          }
        ]
      },
      {
        day: 18,
        title: "Selecting Data",
        description: "Loc and Iloc.",
        subtopics: [
          {
            title: "Indexing",
            explanation: "**loc**: Label-based (Row name, Col name).\n**iloc**: Integer-based (Row index, Col index).\n\n`df.loc[df['Age'] > 25, 'Name']` is powerful filtering.",
            resources: [],
            task: "Filter the Titanic dataset for passengers who are Female AND Class 1."
          }
        ]
      },
      {
        day: 19,
        title: "Data Cleaning",
        description: "Handling the mess.",
        subtopics: [
          {
            title: "Missing Values",
            explanation: "`df.isna().sum()` shows holes. \nOptions:\n1. `dropna()` (Delete)\n2. `fillna(mean)` (Impute)",
            resources: [],
            task: "Find missing values in a dataset. Impute Age with the median."
          }
        ]
      },
      {
        day: 20,
        title: "Aggregation",
        description: "Group By.",
        subtopics: [
          {
            title: "Split-Apply-Combine",
            explanation: "`df.groupby('Category').mean()`\n\n1. Split data into groups.\n2. Apply a function (mean, sum, count).\n3. Combine results.",
            resources: [
               { type: "video", title: "Pandas GroupBy", url: "https://www.youtube.com/embed/qy0fDqoMJx8" }
            ],
            task: "Calculate the average survival rate by 'Class' in Titanic."
          }
        ]
      },
      {
        day: 21,
        title: "Merging & Joining",
        description: "SQL-style joins.",
        subtopics: [
          {
            title: "Concat & Merge",
            explanation: "**Concat**: Stacking tables (vertical).\n**Merge**: Joining tables on a key (horizontal).",
            resources: [],
            task: "Create two dataframes and merge them on a common ID column."
          }
        ]
      }
    ]
  },
  {
    week: 4,
    title: "Visualization",
    description: "Storytelling with Data.",
    days: [
      {
        day: 22,
        title: "Matplotlib Basics",
        description: "The foundation.",
        subtopics: [
          {
            title: "Figure & Axes",
            explanation: "Matplotlib plots on a 'Figure' (canvas). The 'Axes' is the plot itself.\n`fig, ax = plt.subplots()` is the modern way to start.",
            resources: [
              { type: "video", title: "Matplotlib", url: "https://www.youtube.com/embed/3Xc3CA655Y4" }
            ],
            task: "Plot a Sine wave and a Cosine wave on the same chart."
          }
        ]
      },
      {
        day: 23,
        title: "Seaborn Basics",
        description: "Beautiful statistical plots.",
        subtopics: [
          {
            title: "Integration with Pandas",
            explanation: "Seaborn loves DataFrames. \n`sns.scatterplot(data=df, x='col1', y='col2', hue='category')` automatically adds colors and legends.",
            resources: [],
            task: "Create a Scatterplot with 'Hue' to show clusters in data."
          }
        ]
      },
      {
        day: 24,
        title: "Distributions",
        description: "Histograms and KDE.",
        subtopics: [
          {
            title: "Understanding Spread",
            explanation: "`sns.histplot` shows how often values appear. KDE (Kernel Density Estimate) is the smooth line version.",
            resources: [],
            task: "Plot the distribution of 'Prices' in a housing dataset. Is it Normal or Skewed?"
          }
        ]
      },
      {
        day: 25,
        title: "Categorical Plots",
        description: "Boxplots and Barplots.",
        subtopics: [
          {
            title: "Boxplot",
            explanation: "Shows Median, Quartiles, and Outliers. Best way to spot anomalies.",
            resources: [],
            task: "Create a Boxplot of 'Salary' grouped by 'Job Title'."
          }
        ]
      },
      {
        day: 26,
        title: "Subplots",
        description: "Multiple charts.",
        subtopics: [
          {
            title: "Grid Layouts",
            explanation: "Sometimes you need a dashboard. `plt.subplots(2, 2)` creates a 2x2 grid.",
            resources: [],
            task: "Create a 2x2 grid showing 4 different insights about a dataset."
          }
        ]
      },
      {
        day: 27,
        title: "Customization",
        description: "Making it professional.",
        subtopics: [
          {
            title: "Titles, Labels, Annotations",
            explanation: "A plot without labels is useless. Always add `plt.title()`, `plt.xlabel()`, etc.",
            resources: [],
            task: "Take a previous plot. Add a title, axis labels, and an annotation pointing to an interesting data point."
          }
        ]
      },
      {
        day: 28,
        title: "Interactive Plots",
        description: "Plotly Intro.",
        subtopics: [
          {
            title: "Plotly Express",
            explanation: "Static plots are fine for papers. Web needs interactivity (zoom, hover). Plotly is the king here.\n`px.scatter(df, x='A', y='B')`.",
            resources: [
               { type: "video", title: "Plotly", url: "https://www.youtube.com/embed/GGL6U0k8WYA" }
            ],
            task: "Create an interactive scatter plot using Plotly Express."
          }
        ]
      }
    ]
  },
  {
    week: 5,
    title: "Statistics & Probability",
    description: "The Logic of Uncertainty.",
    days: [
       { day: 29, title: "Descriptive Stats", description: "Mean, Median, Mode, Variance.", subtopics: [{ title: "Central Tendency", explanation: "Summarizing data with a single number.", resources: [], task: "Calc mean/median of a skewed distribution." }] },
       { day: 30, title: "Probability Basics", description: "Independent & Dependent events.", subtopics: [{ title: "Bayes Theorem", explanation: "Updating beliefs with new evidence.", resources: [{type: "video", title: "Bayes Theorem", url: "https://www.youtube.com/embed/HZGCoVF3YvM"}], task: "Solve a basic probability problem." }] },
       { day: 31, title: "Distributions", description: "Normal, Binomial, Poisson.", subtopics: [{ title: "The Bell Curve", explanation: "Why the Normal distribution is everywhere (CLT).", resources: [], task: "Generate normal data using numpy and plot it." }] },
       { day: 32, title: "Sampling", description: "Populations vs Samples.", subtopics: [{ title: "Central Limit Theorem", explanation: "If you take enough samples, the means form a Bell Curve.", resources: [], task: "Demonstrate CLT with code." }] },
       { day: 33, title: "Hypothesis Testing I", description: "Null Hypothesis.", subtopics: [{ title: "H0 and H1", explanation: "Default assumption vs What you want to prove.", resources: [], task: "Formulate a hypothesis for a dataset." }] },
       { day: 34, title: "Hypothesis Testing II", description: "T-Tests and P-Values.", subtopics: [{ title: "Interpreting P", explanation: "P < 0.05? Reject the Null.", resources: [{type: "video", title: "P Values", url: "https://www.youtube.com/embed/wemZdwFFXMI"}], task: "Run a t-test on two groups." }] },
       { day: 35, title: "A/B Testing", description: "Stats in Production.", subtopics: [{ title: "Design", explanation: "Control vs Variant groups.", resources: [], task: "Design an A/B test for a website button color." }] }
    ]
  },
  {
    week: 6,
    title: "SQL & Databases",
    description: "Talking to Data.",
    days: [
       { day: 36, title: "SQL Basics", description: "SELECT *", subtopics: [{ title: "Queries", explanation: "Retrieving data.", resources: [], task: "Write a query to filter and sort data." }] },
       { day: 37, title: "Aggregations", description: "COUNT, SUM, AVG.", subtopics: [{ title: "Grouping", explanation: "Summarizing rows.", resources: [], task: "Calc total sales per region." }] },
       { day: 38, title: "Joins I", description: "Inner & Left.", subtopics: [{ title: "Connecting Tables", explanation: "Venn diagrams of data.", resources: [{type: "video", title: "SQL Joins", url: "https://www.youtube.com/embed/9yeOI08jGQ8"}], task: "Join Users and Orders tables." }] },
       { day: 39, title: "Joins II", description: "Advanced Joins.", subtopics: [{ title: "Self Joins", explanation: "Joining a table to itself.", resources: [], task: "Find employees who earn more than their managers." }] },
       { day: 40, title: "Window Functions", description: "Analytics inside SQL.", subtopics: [{ title: "Over & Partition By", explanation: "Running totals, Rankings.", resources: [], task: "Calculate a running total of sales." }] },
       { day: 41, title: "Database Design", description: "Normalization.", subtopics: [{ title: "Schemas", explanation: "Star vs Snowflake.", resources: [], task: "Draw a simple ERD (Entity Relationship Diagram)." }] },
       { day: 42, title: "SQL + Python", description: "SQLAlchemy.", subtopics: [{ title: "ORM", explanation: "Object Relational Mappers.", resources: [], task: "Query a DB using Python." }] }
    ]
  },
  {
    week: 7,
    title: "Machine Learning: Supervised",
    description: "Regression & Classification.",
    days: [
       { day: 43, title: "ML Workflow", description: "The 7 Steps.", subtopics: [{ title: "Preprocessing to Prediction", explanation: "Data > Clean > Split > Train > Eval.", resources: [], task: "Sketch the ML pipeline." }] },
       { day: 44, title: "Linear Regression", description: "Predicting Numbers.", subtopics: [{ title: "OLS", explanation: "Minimizing Error (Residuals).", resources: [{type: "video", title: "Linear Regression", url: "https://www.youtube.com/embed/nk2CQB2XRYA"}], task: "Predict House Prices." }] },
       { day: 45, title: "Logistic Regression", description: "Predicting Classes.", subtopics: [{ title: "Sigmoid", explanation: "S-Curve for probability.", resources: [], task: "Predict Titanic Survival." }] },
       { day: 46, title: "KNN", description: "K-Nearest Neighbors.", subtopics: [{ title: "Distance Metrics", explanation: "Euclidean vs Manhattan.", resources: [], task: "Classify Iris flowers." }] },
       { day: 47, title: "SVM", description: "Support Vector Machines.", subtopics: [{ title: "Margins", explanation: "Finding the widest street between classes.", resources: [], task: "Train an SVM." }] },
       { day: 48, title: "Decision Trees", description: "Flowcharts.", subtopics: [{ title: "Gini Impurity", explanation: "How splits are chosen.", resources: [], task: "Visualize a Decision Tree." }] },
       { day: 49, title: "Random Forests", description: "Ensemble Methods.", subtopics: [{ title: "Bagging", explanation: "Bootstrap Aggregating.", resources: [{type: "video", title: "Random Forests", url: "https://www.youtube.com/embed/J4Wdy0Wc_xQ"}], task: "Train a Random Forest." }] }
    ]
  },
  {
    week: 8,
    title: "Model Evaluation & Tuning",
    description: "Getting better results.",
    days: [
       { day: 50, title: "Metrics (Reg)", description: "MAE, MSE, RMSE.", subtopics: [{ title: "Error Types", explanation: "How wrong is the line?", resources: [], task: "Calculate RMSE." }] },
       { day: 51, title: "Metrics (Class)", description: "Precision, Recall, F1.", subtopics: [{ title: "Tradeoff", explanation: "Precision vs Recall tradeoff.", resources: [], task: "Plot a Precision-Recall curve." }] },
       { day: 52, title: "Cross Validation", description: "K-Fold.", subtopics: [{ title: "Robustness", explanation: "Testing on multiple cuts of data.", resources: [], task: "Implement 5-Fold CV." }] },
       { day: 53, title: "Bias vs Variance", description: "Underfitting vs Overfitting.", subtopics: [{ title: "The Sweet Spot", explanation: "Complexity vs Error.", resources: [], task: "Diagnose a model." }] },
       { day: 54, title: "Grid Search", description: "Hyperparameter Tuning.", subtopics: [{ title: "Brute Force", explanation: "Trying all combinations.", resources: [], task: "Tune a Random Forest." }] },
       { day: 55, title: "Pipelines", description: "Sklearn Pipelines.", subtopics: [{ title: "Automation", explanation: "Chaining steps prevents leakage.", resources: [], task: "Build a Scale -> Model pipeline." }] },
       { day: 56, title: "Week 8 Project", description: "Competition.", subtopics: [{ title: "Kaggle", explanation: "Join a playground competition.", resources: [], task: "Submit to Kaggle Titanic." }] }
    ]
  },
  {
    week: 9,
    title: "Unsupervised Learning",
    description: "Discovering Patterns.",
    days: [
       { day: 57, title: "K-Means", description: "Clustering.", subtopics: [{ title: "Centroids", explanation: "Moving centers to data density.", resources: [], task: "Cluster customers." }] },
       { day: 58, title: "Hierarchical", description: "Dendrograms.", subtopics: [{ title: "Agglomerative", explanation: "Bottom-up clustering.", resources: [], task: "Plot a dendrogram." }] },
       { day: 59, title: "PCA", description: "Dimensionality Reduction.", subtopics: [{ title: "Projections", explanation: "Squashing 3D to 2D.", resources: [{type: "video", title: "PCA", url: "https://www.youtube.com/embed/FgakZw6K1QQ"}], task: "Reduce dimensions of a dataset." }] },
       { day: 60, title: "Recommenders", description: "Content Based.", subtopics: [{ title: "Similarity", explanation: "Cosine Similarity.", resources: [], task: "Build a movie recommender." }] },
       { day: 61, title: "Collaborative Filtering", description: "User Based.", subtopics: [{ title: "Matrix Factorization", explanation: "Users who liked X also liked Y.", resources: [], task: "Use Surprise library." }] },
       { day: 62, title: "Association Rules", description: "Market Basket.", subtopics: [{ title: "Apriori", explanation: "Bread -> Milk.", resources: [], task: "Find association rules." }] },
       { day: 63, title: "Anomaly Detection", description: "Outliers.", subtopics: [{ title: "Isolation Forest", explanation: "Isolating odd points.", resources: [], task: "Detect credit card fraud." }] }
    ]
  },
  {
    week: 10,
    title: "Deep Learning Intro",
    description: "Neural Networks.",
    days: [
       { day: 64, title: "Perceptron", description: "The Neuron.", subtopics: [{ title: "Weights & Biases", explanation: "Linear equation + Activation.", resources: [], task: "Code a perceptron from scratch." }] },
       { day: 65, title: "Backpropagation", description: "How it learns.", subtopics: [{ title: "Gradient Descent", explanation: "Rolling down the hill.", resources: [{type: "video", title: "Gradient Descent", url: "https://www.youtube.com/embed/IHZwWFHWa-w"}], task: "Visualize Gradient Descent." }] },
       { day: 66, title: "TensorFlow/Keras", description: "The Framework.", subtopics: [{ title: "Sequential Model", explanation: "Stacking layers.", resources: [], task: "Build a simple NN in Keras." }] },
       { day: 67, title: "Dense Layers", description: "Fully Connected.", subtopics: [{ title: "Hidden Layers", explanation: "Adding capacity.", resources: [], task: "Train on MNIST (digits)." }] },
       { day: 68, title: "Activation Functions", description: "ReLU, Sigmoid.", subtopics: [{ title: "Non-linearity", explanation: "Why we need them.", resources: [], task: "Compare ReLU vs Sigmoid." }] },
       { day: 69, title: "Overfitting in DL", description: "Dropout.", subtopics: [{ title: "Regularization", explanation: "Randomly killing neurons.", resources: [], task: "Add Dropout to your model." }] },
       { day: 70, title: "Early Stopping", description: "Callbacks.", subtopics: [{ title: "Efficiency", explanation: "Stop when loss stops dropping.", resources: [], task: "Implement Early Stopping." }] }
    ]
  },
  {
    week: 11,
    title: "Time Series & NLP",
    description: "Specialized Data.",
    days: [
       { day: 71, title: "Time Series Basics", description: "Trends & Seasonality.", subtopics: [{ title: "Decomposition", explanation: "Breaking down the signal.", resources: [], task: "Decompose a stock price series." }] },
       { day: 72, title: "ARIMA", description: "Forecasting.", subtopics: [{ title: "AutoRegressive", explanation: "Past predicts future.", resources: [], task: "Forecast sales." }] },
       { day: 73, title: "NLP Basics", description: "Text Data.", subtopics: [{ title: "Tokenization", explanation: "Splitting text.", resources: [], task: "Tokenize a paragraph." }] },
       { day: 74, title: "Bag of Words", description: "Vectorization.", subtopics: [{ title: "CountVectorizer", explanation: "Counting words.", resources: [], task: "Vectorize text data." }] },
       { day: 75, title: "TF-IDF", description: "Importance.", subtopics: [{ title: "Term Frequency", explanation: "Weighting unique words.", resources: [], task: "Calculate TF-IDF." }] },
       { day: 76, title: "Word Embeddings", description: "Word2Vec.", subtopics: [{ title: "Context", explanation: "King - Man + Woman = Queen.", resources: [], task: "Explore pre-trained embeddings." }] },
       { day: 77, title: "Transformers", description: "BERT & GPT.", subtopics: [{ title: "Attention", explanation: "The revolution.", resources: [{type: "video", title: "Transformers", url: "https://www.youtube.com/embed/4Bdc55j80l8"}], task: "Use HuggingFace pipeline." }] }
    ]
  },
  {
    week: 12,
    title: "Deployment & Capstone",
    description: "The Real World.",
    days: [
       { day: 78, title: "Model Persistence", description: "Pickle.", subtopics: [{ title: "Serialization", explanation: "Saving the model to disk.", resources: [], task: "Save and Load a model." }] },
       { day: 79, title: "Flask/Streamlit", description: "Web Apps.", subtopics: [{ title: "Serving", explanation: "Putting model behind an API.", resources: [], task: "Build a Streamlit app." }] },
       { day: 80, title: "Docker", description: "Containers.", subtopics: [{ title: "Consistency", explanation: "Works on my machine.", resources: [{type: "video", title: "Docker", url: "https://www.youtube.com/embed/Gjnup-PuquQ"}], task: "Containerize your script." }] },
       { day: 81, title: "Cloud Basics", description: "AWS/GCP.", subtopics: [{ title: "Compute", explanation: "EC2 and S3.", resources: [], task: "Launch a free tier instance (optional)." }] },
       { day: 82, title: "Capstone: Definition", description: "Planning.", subtopics: [{ title: "Problem Statement", explanation: "Define the business value.", resources: [], task: "Choose your final project." }] },
       { day: 83, title: "Capstone: Data", description: "Collection.", subtopics: [{ title: "Sourcing", explanation: "APIs, Scraping, Kaggle.", resources: [], task: "Gather your dataset." }] },
       { day: 84, title: "Capstone: EDA", description: "Exploration.", subtopics: [{ title: "Insights", explanation: "Know your data.", resources: [], task: "Perform Deep EDA." }] },
       { day: 85, title: "Capstone: Modeling", description: "Training.", subtopics: [{ title: "Experiments", explanation: "Try multiple models.", resources: [], task: "Train candidate models." }] },
       { day: 86, title: "Capstone: Evaluation", description: "Testing.", subtopics: [{ title: "Validation", explanation: "Prove it works.", resources: [], task: "Evaluate on test set." }] },
       { day: 87, title: "Capstone: Story", description: "Presentation.", subtopics: [{ title: "Visualization", explanation: "Explain to non-techs.", resources: [], task: "Create final charts." }] },
       { day: 88, title: "Github Portfolio", description: "Documentation.", subtopics: [{ title: "README", explanation: "The most important file.", resources: [], task: "Polish your Repo." }] },
       { day: 89, title: "Resume & Interview", description: "Career.", subtopics: [{ title: "Preparation", explanation: "Leetcode and Behavioral.", resources: [], task: "Update Resume." }] },
       { day: 90, title: "Graduation", description: "The End & Beginning.", subtopics: [{ title: "Lifelong Learning", explanation: "Data Science never ends. Stay curious.", resources: [], task: "Share your journey on LinkedIn." }] }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = curriculum;
} else {
  window.curriculum = curriculum;
}
