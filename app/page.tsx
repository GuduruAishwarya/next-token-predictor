// app/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";

type TokenData = {
  tokens: { token: string; probability: number }[];
  chosen: string | null;
};

export default function Home() {
  const [prompt, setPrompt] = useState("I am very");
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(3);
  
  // Consolidated state for prediction results
  const [prediction, setPrediction] = useState<TokenData>({ tokens: [], chosen: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optimized Effect: Resets when prompt is cleared
  useEffect(() => {
    if (prompt.trim() === "") {
      setPrediction({ tokens: [], chosen: null });
      setError(null);
    }
  }, [prompt]);

  // useCallback to prevent unnecessary function re-creation
  const generate = useCallback(async () => {
    if (isLoading || prompt.trim() === "") return;

    setIsLoading(true);
    setError(null);
    setPrediction({ tokens: [], chosen: null });

    try {
      const res = await fetch("/api/next-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, temperature, topK }),
      });

      if (!res.ok) throw new Error("Failed to generate tokens");

      const data = await res.json();
      
      setPrediction({
        tokens: data.tokens,
        chosen: data.tokens[0]?.token || null,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, temperature, topK, isLoading]);

  // ChartJS Data Formatting
  const chartData = {
    labels: prediction.tokens.map(t => `"${t.token.replace(/\n/g, '\\n')}"`),
    datasets: [{
      label: 'Probability',
      data: prediction.tokens.map(t => t.probability * 100),
      backgroundColor: 'rgba(34, 197, 94, 0.6)',
      borderColor: 'rgb(22, 163, 74)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true, max: 100 } },
    plugins: { legend: { display: false } },
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-green-700">🧠 Ollama Next-Token Playground</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium mb-2">Prompt</label>
        <textarea
          className="w-full p-3 border rounded-md"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Temperature: <b>{temperature}</b></label>
            <input type="range" min="0.1" max="1.5" step="0.1" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Top-K: <b>{topK}</b></label>
            <input type="range" min="1" max="6" step="1" value={topK} onChange={(e) => setTopK(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          disabled={isLoading || prompt.trim() === ""}
          onClick={generate}
        >
          {isLoading ? "Generating…" : "Predict Next Token"}
        </button>
      </div>

      {error && <div className="text-red-600 bg-red-100 p-3 rounded mb-6">❌ {error}</div>}

      {prediction.tokens.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Probability Distribution</h2>
         {prediction.tokens.map((t,i)=> <div key={i} className="token-row">
              <div className="token-label">
                "{t.token}" — {(t.probability * 100).toFixed(1)}%
              </div>
              <div
                className="bar"
                style={{ width: `${t.probability * 100}%` }}
              />
            </div>)}
        </div>
      )}

      {prediction.chosen && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Top Prediction: <span className="text-green-700">"{prediction.chosen}"</span></h3>
          <p className="text-sm text-gray-600 mt-2">Resulting Text:</p>
          <pre className="bg-gray-100 p-3 rounded mt-1 font-mono">{prompt + " " + prediction.chosen}</pre>
        </div>
      )}
    </main>
  );
}