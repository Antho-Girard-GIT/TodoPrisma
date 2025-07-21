
"use client"
import React from "react";

type Todo = {
  id: number;
  liste: string;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function fetchTodos() {
    setLoading(true);
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) {
        setTodos([]);
        setLoading(false);
        return;
      }
      const text = await res.text();
      if (!text) {
        setTodos([]);
        setLoading(false);
        return;
      }
      const data = JSON.parse(text);
      setTodos(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setTodos([]);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    fetchTodos();
  }, []);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liste: input }),
    });
    setInput("");
    fetchTodos();
  }

  async function deleteTodo(id: number) {
    setLoading(true);
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-slate-900 to-sky-900 flex flex-col items-center p-4 transition-all duration-500">
      <header className="w-full max-w-md mb-8 text-center animate-fade-in">
        <p className="text-4xl text-yellow-600 font-black">Let&apos;s Go!</p>
      </header>
      <form onSubmit={addTodo} className="flex flex-col w-full max-w-md mb-6 gap-3 bg-black/50 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Qu'est-ce que ta à pas oublier?"
          className="flex-1 px-4 py-3 rounded-xl border-2 border-yellow-400 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-300 outline-none text-lg text-white transition-all duration-300"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-sky-900 via-slate-900 to-yellow-900 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-yellow-900 hover:to-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Ajout..." : "Oublie pas!"}
        </button>
      </form>
      <ul className="w-full max-w-md space-y-4">
        {loading ? (
          <li className="text-center text-yellow-500 animate-pulse">Chargement...</li>
        ) : todos.length === 0 ? (
          <li className="text-center text-yellow-600">Aweille ajoute dequoi!!</li>
        ) : (
          todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-black/30 p-4 rounded-xl shadow-xl border-l-8 border-black-900 hover:border-yellow-800 transition-all duration-300 animate-fade-in"
            >
              <span className="flex-1 text-gray-400 text-lg font-medium">{todo.liste}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-4 bg-gradient-to-r from-gray-800 to-yellow-800 text-yellow-500 px-4 py-2 rounded-lg font-bold shadow hover:scale-110 transition-all duration-300"
                aria-label="Supprimer"
              >
                ✖
              </button>
            </li>
          ))
        )}
      </ul>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s ease; }
      `}</style>
    </div>
  );
}
