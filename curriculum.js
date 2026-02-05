const curriculum = [
  {
    day: 1,
    title: "Python Setup & The Basics",
    description: "Welcome! Today is about getting your tools ready and learning the ABCs of Python.",
    subtopics: [
      {
        title: "Setting up the Environment",
        explanation: "To cook, you need a kitchen. For Data Science, our kitchen is usually 'Jupyter Notebooks' or 'Google Colab'. Google Colab is the easiest—it's like Google Docs but for code.",
        resources: [
          { type: "video", title: "Google Colab Tutorial (5 mins)", url: "https://www.youtube.com/embed/inN8seMm7UI" },
          { type: "read", title: "Getting Started with Colab", url: "https://colab.research.google.com/" }
        ],
        task: "Open Google Colab, create a new notebook, and rename it 'Day 1'."
      },
      {
        title: "Variables & Data Types",
        explanation: "Variables are like labeled boxes. You put data in them. 'x = 5' means put the number 5 in box 'x'. Types are just the kind of thing in the box: Number (Int/Float), Text (String), or Yes/No (Boolean).",
        resources: [
          { type: "video", title: "Python Variables (Mosh)", url: "https://www.youtube.com/embed/kqtD5dpn9C8" },
          { type: "read", title: "W3Schools Variables", url: "https://www.w3schools.com/python/python_variables.asp" }
        ],
        task: "In your notebook, create variables for your name, age, and a boolean for 'is_learning'. Print them."
      }
    ]
  },
  {
    day: 2,
    title: "Control Flow: Logic",
    description: "Making decisions and repeating tasks without getting tired.",
    subtopics: [
      {
        title: "If/Else Statements",
        explanation: "This is how code makes decisions. 'If it rains, take an umbrella'. In code: `if rain == True: take_umbrella()`.",
        resources: [
          { type: "video", title: "Python If/Else", url: "https://www.youtube.com/embed/Zp5MuPOtsSY" },
          { type: "read", title: "Real Python Conditional Statements", url: "https://realpython.com/python-conditional-statements/" }
        ],
        task: "Write a script that checks if a variable `age` is greater than 18. If so, print 'Adult', else 'Minor'."
      },
      {
        title: "Loops (For & While)",
        explanation: "Loops let you do the same thing to a list of items. 'For every shirt in the pile, fold it'.",
        resources: [
          { type: "video", title: "Python Loops", url: "https://www.youtube.com/embed/6iF8Xb7Z3wQ" },
          { type: "read", title: "W3Schools Loops", url: "https://www.w3schools.com/python/python_for_loops.asp" }
        ],
        task: "Write a loop that prints numbers from 1 to 10."
      }
    ]
  },
  {
    day: 3,
    title: "Data Structures & Functions",
    description: "Organizing data efficiently and reusing code.",
    subtopics: [
      {
        title: "Lists & Dictionaries",
        explanation: "A List is an ordered collection (like a grocery list). A Dictionary is a collection of pairs (like a real dictionary: Word -> Definition). In Python: `{'Name': 'Jules', 'Role': 'AI'}`.",
        resources: [
          { type: "video", title: "Lists & Dictionaries", url: "https://www.youtube.com/embed/R-HLU9Fl5ug" },
          { type: "read", title: "Data Structures Info", url: "https://docs.python.org/3/tutorial/datastructures.html" }
        ],
        task: "Create a list of 5 fruits. Create a dictionary with your details. Print the 2nd fruit and your name from the dictionary."
      },
      {
        title: "Functions",
        explanation: "A function is a mini-machine you build once and use many times. Takes input -> does magic -> returns output.",
        resources: [
          { type: "video", title: "Python Functions", url: "https://www.youtube.com/embed/NSbOtYzIQI0" },
          { type: "read", title: "W3Schools Functions", url: "https://www.w3schools.com/python/python_functions.asp" }
        ],
        task: "Write a function `square(x)` that returns x multiplied by x. Test it with the number 12."
      }
    ]
  },
  {
    day: 4,
    title: "Intro to NumPy",
    description: "The backbone of numerical computing in Python. Faster than lists!",
    subtopics: [
      {
        title: "NumPy Arrays",
        explanation: "NumPy arrays look like lists, but they are super-fast and allow you to do math on the whole list at once (Vectorization). `[1,2] * 2` in lists repeats it `[1,2,1,2]`, but in NumPy it becomes `[2, 4]`.",
        resources: [
          { type: "video", title: "NumPy Crash Course", url: "https://www.youtube.com/embed/GB9ByFAIAH4" },
          { type: "read", title: "NumPy Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html" }
        ],
        task: "Install numpy (`import numpy as np`). Create an array of numbers 1-10. Multiply the whole array by 5."
      }
    ]
  },
  {
    day: 5,
    title: "Pandas: The Dataframe",
    description: "Pandas is Excel for Python. The DataFrame is your spreadsheet.",
    subtopics: [
      {
        title: "Series & DataFrames",
        explanation: "A Series is a single column. A DataFrame is the whole table (rows and columns). It's the most important object you will use.",
        resources: [
          { type: "video", title: "Pandas DataFrame", url: "https://www.youtube.com/embed/zmdjNSmRXF4" },
          { type: "read", title: "10 Minutes to pandas", url: "https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html" }
        ],
        task: "Import pandas (`import pandas as pd`). Create a DataFrame from a dictionary of your friends' names and ages."
      }
    ]
  },
  {
    day: 6,
    title: "Pandas: Manipulation",
    description: "Slicing, dicing, and filtering your data.",
    subtopics: [
      {
        title: "Filtering & Selection",
        explanation: "You often only want specific rows (e.g., 'Customers from USA'). In Pandas, you ask: `df[df['Country'] == 'USA']`.",
        resources: [
          { type: "video", title: "Pandas Filtering", url: "https://www.youtube.com/embed/ZyhVh-qRZPA" },
          { type: "read", title: "Pandas Indexing", url: "https://pandas.pydata.org/docs/user_guide/indexing.html" }
        ],
        task: "Load a sample CSV (e.g., from a URL). Select only the rows where a numeric column is greater than its average."
      }
    ]
  },
  {
    day: 7,
    title: "Weekly Project 1",
    description: "Put it all together.",
    subtopics: [
      {
        title: "Analyze a Dataset",
        explanation: "Take a dataset (like Pokemon or Titanic). Load it. Inspect it. Find the average of a column. Filter it.",
        resources: [
          { type: "read", title: "Kaggle Datasets", url: "https://www.kaggle.com/datasets" }
        ],
        task: "Download the 'Pokemon' dataset from Kaggle (or raw github link). Load it. Find the strongest Pokemon (highest Attack). Find the average Speed."
      }
    ]
  },
  {
    day: 8,
    title: "Visualization: Matplotlib",
    description: "A picture is worth 1000 rows.",
    subtopics: [
      {
        title: "Basic Plotting",
        explanation: "Matplotlib is the grandfather of plotting. You build plots step by step. `plt.plot(x, y)` makes a line.",
        resources: [
          { type: "video", title: "Matplotlib Tutorial", url: "https://www.youtube.com/embed/DAQNHzOcO5A" },
          { type: "read", title: "Matplotlib Pyplot", url: "https://matplotlib.org/stable/tutorials/introductory/pyplot.html" }
        ],
        task: "Plot a line graph of the numbers 1 to 10 and their squares."
      }
    ]
  },
  {
    day: 9,
    title: "Visualization: Seaborn",
    description: "Making Matplotlib beautiful and easier.",
    subtopics: [
      {
        title: "Statistical Plots",
        explanation: "Seaborn is built on Matplotlib but looks better by default and handles DataFrames easily. `sns.scatterplot(data=df, x='A', y='B')`.",
        resources: [
          { type: "video", title: "Seaborn Tutorial", url: "https://www.youtube.com/embed/6GUZXDef2U0" },
          { type: "read", title: "Seaborn Gallery", url: "https://seaborn.pydata.org/examples/index.html" }
        ],
        task: "Use Seaborn to make a Scatter plot and a Histogram from your project dataset (Day 7)."
      }
    ]
  },
  {
    day: 10,
    title: "Exploratory Data Analysis (EDA)",
    description: "Being a detective with data.",
    subtopics: [
      {
        title: "EDA Principles",
        explanation: "EDA is about asking questions. What is the distribution? Are there outliers? How do columns relate? Don't model until you understand the data.",
        resources: [
          { type: "video", title: "What is EDA?", url: "https://www.youtube.com/embed/-o3AxdVc41E" },
          { type: "read", title: "EDA Guide", url: "https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15" }
        ],
        task: "Take your dataset. Write down 3 questions (e.g., 'Do Fire Pokemon have more attack?'). Answer them with plots."
      }
    ]
  },
  {
    day: 11,
    title: "Data Cleaning",
    description: "Real world data is messy.",
    subtopics: [
      {
        title: "Handling Missing Data",
        explanation: "Sometimes data is empty (NaN). You can Drop it (`dropna`) or Fill it (`fillna`). Filling with the mean is a common strategy.",
        resources: [
          { type: "video", title: "Pandas Missing Data", url: "https://www.youtube.com/embed/fCMrO_VzeL8" },
          { type: "read", title: "Working with Missing Data", url: "https://pandas.pydata.org/pandas-docs/stable/user_guide/missing_data.html" }
        ],
        task: "Introduce some NaNs into your dataframe (manually). Then write code to fill them with the column mean."
      }
    ]
  },
  {
    day: 12,
    title: "Feature Engineering",
    description: "Creating new value from existing data.",
    subtopics: [
      {
        title: "Creating Metrics",
        explanation: "Better features make better models. If you have 'Start Date' and 'End Date', the machine might not care, but 'Duration' (End - Start) is very useful.",
        resources: [
          { type: "read", title: "Feature Engineering 101", url: "https://www.kaggle.com/learn/feature-engineering" }
        ],
        task: "Create a new column in your dataset that is a combination of two others (e.g., `Total Stats = Attack + Defense`)."
      }
    ]
  },
  {
    day: 13,
    title: "Statistical Thinking",
    description: "The math behind the insights.",
    subtopics: [
      {
        title: "Central Tendency & Spread",
        explanation: "Mean is the average. Median is the middle. Standard Deviation is how 'spread out' the data is. A high spread means data is all over the place.",
        resources: [
          { type: "video", title: "StatQuest: Mean & Variance", url: "https://www.youtube.com/embed/SzZ6GpcfoQY" },
          { type: "read", title: "Khan Academy Stats", url: "https://www.khanacademy.org/math/statistics-probability" }
        ],
        task: "Calculate the Mean, Median, and Std Dev of a numeric column. Is the Mean far from the Median? Why?"
      }
    ]
  },
  {
    day: 14,
    title: "Weekly Project 2",
    description: "Deep Dive EDA.",
    subtopics: [
      {
        title: "Titanic EDA",
        explanation: "The classic Titanic dataset. Who survived? Women? Children? Rich people?",
        resources: [
          { type: "read", title: "Titanic Dataset", url: "https://www.kaggle.com/c/titanic/data" }
        ],
        task: "Perform a full EDA on the Titanic dataset. Clean missing ages. Visualize survival rates by Gender and Class. Summarize your findings."
      }
    ]
  },
  {
    day: 15,
    title: "Hypothesis Testing",
    description: "Proving you didn't just get lucky.",
    subtopics: [
      {
        title: "P-Values & T-Tests",
        explanation: "A p-value tells you the probability that your result happened by random chance. Low p-value (< 0.05) means it's likely real (Statistically Significant).",
        resources: [
          { type: "video", title: "StatQuest: P Values", url: "https://www.youtube.com/embed/wemZdwFFXMI" },
          { type: "read", title: "Hypothesis Testing Explained", url: "https://towardsdatascience.com/hypothesis-testing-explained-30-min-read-e89c09c25838" }
        ],
        task: "Run a T-test (using `scipy.stats`) to see if the average age of survivors is significantly different from non-survivors on Titanic."
      }
    ]
  },
  {
    day: 16,
    title: "Correlation vs Causation",
    description: "Ice cream sales and shark attacks are correlated, but ice cream doesn't cause shark attacks.",
    subtopics: [
      {
        title: "Correlation Matrices",
        explanation: "Correlation measures how two variables move together. 1 is perfect sync, -1 is perfect opposites. 0 is no relationship.",
        resources: [
          { type: "video", title: "Correlation", url: "https://www.youtube.com/embed/xZ_z8KWkhXE" }
        ],
        task: "Plot a heatmap of correlations for the Titanic numeric features."
      }
    ]
  },
  {
    day: 17,
    title: "SQL Basics",
    description: "Speaking to Databases.",
    subtopics: [
      {
        title: "SELECT, FROM, WHERE",
        explanation: "Databases hold data in tables. `SELECT name FROM users WHERE age > 18` is how you ask for data.",
        resources: [
          { type: "video", title: "SQL Basics", url: "https://www.youtube.com/embed/7S_tz1z_5bA" },
          { type: "read", title: "W3Schools SQL", url: "https://www.w3schools.com/sql/" }
        ],
        task: "Practice SQL online (SQLZoo or similar). Write a query to select all columns from a table where a condition is met."
      }
    ]
  },
  {
    day: 18,
    title: "SQL Joins",
    description: "Combining tables.",
    subtopics: [
      {
        title: "Inner & Left Joins",
        explanation: "Data is often split. Users in one table, Orders in another. A JOIN connects them by a common ID (like UserID).",
        resources: [
          { type: "video", title: "Visualizing SQL Joins", url: "https://www.youtube.com/embed/9yeOI08jGQ8" }
        ],
        task: "Draw a Venn diagram explaining Inner, Left, and Right joins."
      }
    ]
  },
  {
    day: 19,
    title: "SQL + Python",
    description: "The Power Couple.",
    subtopics: [
      {
        title: "SQLite & Pandas",
        explanation: "You can run SQL inside Python using `sqlite3` or load SQL query results directly into a Pandas DataFrame.",
        resources: [
          { type: "read", title: "Pandas read_sql", url: "https://pandas.pydata.org/docs/reference/api/pandas.read_sql.html" }
        ],
        task: "Create a temporary SQLite database in your notebook, create a table, insert data, and read it back into a Pandas DataFrame."
      }
    ]
  },
  {
    day: 20,
    title: "Web Scraping (Optional)",
    description: "Getting data when there's no CSV.",
    subtopics: [
      {
        title: "BeautifulSoup",
        explanation: "Web pages are HTML. Scraping is just parsing that HTML to find the info you want.",
        resources: [
          { type: "video", title: "Web Scraping Python", url: "https://www.youtube.com/embed/XVv6mJpFOb0" }
        ],
        task: "Scrape the titles of articles from a news homepage (check `robots.txt` first!)."
      }
    ]
  },
  {
    day: 21,
    title: "Weekly Project 3",
    description: "Database analysis.",
    subtopics: [
      {
        title: "SQL Analysis",
        explanation: "Use a public SQL playground or local DB. Answer business questions using aggregations (GROUP BY) and Joins.",
        resources: [],
        task: "Find a dataset with multiple tables (e.g., Sales & Customers). Calculate total revenue per Customer Country."
      }
    ]
  },
  {
    day: 22,
    title: "Machine Learning: Concepts",
    description: "Teaching computers to learn from patterns.",
    subtopics: [
      {
        title: "Supervised vs Unsupervised",
        explanation: "Supervised: You have the answer key (Labels). Example: Predicting house prices (you have past prices). Unsupervised: No answer key. Example: Grouping similar customers.",
        resources: [
          { type: "video", title: "ML Concepts", url: "https://www.youtube.com/embed/ukzFI9rgwfU" }
        ],
        task: "Classify 5 problem statements as Supervised or Unsupervised."
      }
    ]
  },
  {
    day: 23,
    title: "Linear Regression",
    description: "Drawing the best fit line.",
    subtopics: [
      {
        title: "Scikit-Learn Intro",
        explanation: "Scikit-Learn (sklearn) is the ML library. The workflow is always: Import -> Instantiate -> Fit -> Predict.",
        resources: [
          { type: "video", title: "Linear Regression", url: "https://www.youtube.com/embed/nk2CQB2XRYA" }
        ],
        task: "Use `sklearn.linear_model.LinearRegression` to predict a continuous variable in your dataset."
      }
    ]
  },
  {
    day: 24,
    title: "Logistic Regression",
    description: "It's actually for Classification!",
    subtopics: [
      {
        title: "Classification",
        explanation: "Predicting categories (Yes/No, Cat/Dog). Logistic Regression squashes the output between 0 and 1 (Probability).",
        resources: [
          { type: "video", title: "StatQuest: Logistic Regression", url: "https://www.youtube.com/embed/yIYKR4sgzI8" }
        ],
        task: "Use `LogisticRegression` to predict Survival on the Titanic dataset."
      }
    ]
  },
  {
    day: 25,
    title: "Evaluation Metrics",
    description: "How good is your model?",
    subtopics: [
      {
        title: "Accuracy, Precision, Recall",
        explanation: "Accuracy isn't everything. If 99% of people don't have a disease, a model that says 'No' every time is 99% accurate but useless. Precision and Recall help us understand the errors.",
        resources: [
          { type: "video", title: "Confusion Matrix", url: "https://www.youtube.com/embed/Kdsp6soqA7o" }
        ],
        task: "Calculate the Accuracy and Confusion Matrix for your Titanic model."
      }
    ]
  },
  {
    day: 26,
    title: "Decision Trees",
    description: "Flowchart-based learning.",
    subtopics: [
      {
        title: "Trees & Forests",
        explanation: "A Decision Tree asks a series of Yes/No questions to make a prediction. A Random Forest uses many trees and votes on the result (much more powerful).",
        resources: [
          { type: "video", title: "StatQuest: Decision Trees", url: "https://www.youtube.com/embed/7VeUPuFGJHk" }
        ],
        task: "Train a `RandomForestClassifier` on Titanic. Compare its accuracy to Logistic Regression."
      }
    ]
  },
  {
    day: 27,
    title: "Clustering (Unsupervised)",
    description: "Finding natural groups.",
    subtopics: [
      {
        title: "K-Means",
        explanation: "K-Means tries to find 'K' center points and groups data around them. Useful for customer segmentation.",
        resources: [
          { type: "video", title: "StatQuest: K-Means", url: "https://www.youtube.com/embed/4b5d3muPQmA" }
        ],
        task: "Use K-Means on the 'Iris' dataset (available in sklearn) to group flowers."
      }
    ]
  },
  {
    day: 28,
    title: "Final Capstone",
    description: "The beginning of your journey.",
    subtopics: [
      {
        title: "End-to-End Project",
        explanation: "Pick a dataset you love. Clean it. Visualize it. Train a model. Evaluate it. Tell a story.",
        resources: [
          { type: "read", title: "Project Ideas", url: "https://www.kaggle.com/code" }
        ],
        task: "Complete a full project notebook and upload it to GitHub. You are now a Data Scientist in the making!"
      }
    ]
  }
];

// Export for use in browser (attached to window) or module system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = curriculum;
} else {
  window.curriculum = curriculum;
}
