import { useRef, useState } from "react";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<
    { id: number; text: string; completed: boolean }[]
  >([
    { id: 1, text: "할 일 1", completed: false },
    { id: 2, text: "할 일 2", completed: false },
    { id: 3, text: "할 일 3", completed: false },
  ]);

  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoText, setEditTodoText] = useState<string>("");

  const handleEditTodo = (id: number, text: string) => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  const handleSaveEditTodo = () => {
    const text = editTodoText.trim();
    if (text === "") return;

    setTodos((prev) =>
      prev.map((todo) => (todo.id === editTodoId ? { ...todo, text } : todo))
    );
    setEditTodoId(null);
    setEditTodoText("");
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tempText = formData.get("text") as string;
    const text = tempText.trim();
    if (text === "") return;

    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
    inputRef.current!.value = "";
    inputRef.current?.focus();
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id: number) => {
    // todo: 참조가 있을 경우 완료상태 변경 필요
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
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
            ref={inputRef}
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
              {editTodoId === todo.id ? (
                <div className="flex items-center gap-2 justify-between w-full">
                  <input
                    autoFocus
                    type="text"
                    value={editTodoText}
                    onChange={(e) => setEditTodoText(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveEditTodo();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setEditTodoId(null);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleSaveEditTodo()}
                    >
                      저장
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => setEditTodoId(null)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                    />
                    <span className={`${todo.completed ? "line-through" : ""}`}>
                      {todo.text}
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleEditTodo(todo.id, todo.text)}
                    >
                      수정
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
