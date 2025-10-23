import { useState } from "react";

function App() {
  const [todos, setTodos] = useState<{ id: number; text: string }[]>([
    { id: 1, text: "할 일 1" },
    { id: 2, text: "할 일 2" },
    { id: 3, text: "할 일 3" },
  ]);
  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const text = formData.get("text") as string;

    setTodos((prev) => [...prev, { id: Date.now(), text }]);
  };
  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <header>
        <h1 className="text-2xl font-bold mb-6">TODO List</h1>
      </header>

      <main className="w-full bg-white rounded p-4 space-y-4">
        <form className="flex gap-2" onSubmit={handleAddTodo}>
          <input
            type="text"
            placeholder="할 일 추가"
            className="flex-1 border rounded px-3 py-2"
            name="text"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            추가
          </button>
        </form>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center">
              {todo.text}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
