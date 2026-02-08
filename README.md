Here is the `README.md` file for your **Ollama Next-Token Playground** project.

---

# 🧠 Ollama Next-Token Playground

An interactive web application built with **Next.js** to visualize how Large Language Models (LLMs) predict the next token in a sequence. This project runs entirely locally using **Ollama**.

## 🛠️ Features

* **Local Inference:** Powered by Ollama (runs on your machine).
* **Logprobs Visualization:** Displays real-time probability distributions for the top  next tokens using `chart.js`.
* **Parameter Tuning:** Adjust **Temperature** and **Top-K** to see how they affect model output randomness.
* **Optimized UI:** Built with Next.js App Router and Tailwind CSS for a snappy experience.

## 🚀 Getting Started

### 1. Prerequisites

* **Node.js:** v18.x or higher installed.
* **Ollama:** Installed and running on your machine ([Download Ollama](https://ollama.com)).
* **LLM Model:** Pull a model to use (e.g., Llama 3):
```bash
ollama pull llama3

```



### 2. Installation

1. **Clone or Create the Project:**
```bash
npx create-next-app@latest ollama-next-token-playground
# Select: Yes to Tailwind, Yes to App Router, Yes to TypeScript
cd ollama-next-token-playground

```


2. **Install Dependencies:**
```bash
npm install chart.js react-chartjs-2

```


3. **Setup API Route:**
Create `app/api/next-token/route.ts` and paste the backend code provided in the project files.
4. **Setup Frontend:**
Replace the contents of `app/page.tsx` with the optimized frontend code provided.

### 3. Running the App

1. **Start Ollama** (if it's not already running in the background):
```bash
ollama serve

```


2. **Run the Next.js App:**
```bash
npm run dev

```


3. Open `http://localhost:3000` in your browser.

## 💡 How It Works

1. **Input:** You enter a prompt.
2. **Request:** The frontend sends the prompt, temperature, and top-k parameters to the Next.js backend API route.
3. **Local API Call:** The backend calls your local Ollama instance (`/v1/chat/completions`) requesting `logprobs`.
4. **Mathematical Calculation:** The model generates raw numerical scores (**logits**). These are converted into probabilities using the **Softmax** function, adjusted by your temperature setting.
5. **Visualization:** The percentages are sent back to the frontend and rendered in the bar chart.

## ⚙️ Configuration

You can change the model used in `app/api/next-token/route.ts`:

```typescript
const MODEL = 'llama3'; // Ensure this model is pulled in Ollama

```
