import { useEffect, useRef, useState } from "react";
import type { Todo } from "./types/todo";
import { TodoFilter } from "./types/todo";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "할 일 1",
      completed: false,
      references: [2, 3],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      text: "할 일 2",
      completed: false,
      references: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      text: "할 일 3",
      completed: false,
      references: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoText, setEditTodoText] = useState<string>("");
  const [draftRefs, setDraftRefs] = useState<number[]>([]);
  const [refOpenId, setRefOpenId] = useState<number | null>(null);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.ALL);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = todos.filter((t) =>
    filter === TodoFilter.ALL
      ? true
      : filter === TodoFilter.ACTIVE
      ? !t.completed
      : t.completed
  );
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const pageTodos = filtered.slice(start, end);

  const handleEditTodo = (id: number, text: string) => {
    setEditTodoId(id);
    setEditTodoText(text);
    const current = todos.find((t) => t.id === id);
    setDraftRefs(current?.references ?? []);
    setRefOpenId(null);
  };

  const handleSaveEditTodo = () => {
    const text = editTodoText.trim();
    if (text === "") return;

    const existing = new Set(todos.map((t) => t.id));
    const refs = draftRefs.filter(
      (id) => existing.has(id) && id !== editTodoId
    );
    const nextTodos = todos.map((t) =>
      t.id === editTodoId
        ? { ...t, text, references: refs, updatedAt: new Date().toISOString() }
        : t
    );

    setTodos(nextTodos);
    setEditTodoId(null);
    setEditTodoText("");
    setDraftRefs([]);
    setRefOpenId(null);
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tempText = formData.get("text") as string;
    const text = tempText.trim();
    if (text === "") return;

    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        completed: false,
        references: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    inputRef.current!.value = "";
    inputRef.current?.focus();
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prev) =>
      prev
        .map((t) =>
          t.references.includes(id)
            ? { ...t, references: t.references.filter((r) => r !== id) } // ✅ 정리
            : t
        )
        .filter((t) => t.id !== id)
    );
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;
      if (!target.completed) {
        const allDone = target.references.every(
          (ref) => prev.find((t) => t.id === ref)?.completed
        );
        if (!allDone) {
          return prev;
        }
      }
      return prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: new Date().toISOString(),
            }
          : todo
      );
    });
  };

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

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
        <div className="flex justify-between items-center">
          <p>{total} tasks</p>
          <div className="flex gap-2">
            {[TodoFilter.ALL, TodoFilter.ACTIVE, TodoFilter.COMPLETED].map(
              (f) => (
                <button
                  key={f}
                  type="button"
                  className={`px-2 py-1 rounded border text-sm ${
                    filter === f ? "bg-gray-100 font-semibold" : ""
                  }`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              )
            )}
          </div>
        </div>
        <ul className="space-y-2">
          {pageTodos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center">
              {editTodoId === todo.id ? (
                <div className="flex items-center gap-2 justify-between w-full">
                  <div className="flex flex-col gap-2 w-full">
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
                    <div className="flex items-center justify-between relative">
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {draftRefs.length
                          ? `${draftRefs.map((id) => `@${id}`).join(", ")}`
                          : ""}
                      </span>
                      <button
                        type="button"
                        className="px-2 py-1 rounded border text-sm hover:bg-gray-50 flex-shrink-0"
                        aria-expanded={refOpenId === todo.id}
                        onClick={() =>
                          setRefOpenId((prev) =>
                            prev === todo.id ? null : todo.id
                          )
                        }
                      >
                        참조 선택
                      </button>
                      {refOpenId === todo.id && (
                        <div className="absolute right-0 top-full mt-1 w-52 bg-white border rounded z-10">
                          <div className="max-h-48 overflow-y-auto p-2">
                            {todos
                              .filter((t) => t.id !== todo.id)
                              .map((c) => {
                                const checked = draftRefs.includes(c.id);
                                return (
                                  <label
                                    key={c.id}
                                    className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-gray-50 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        setDraftRefs((prev) =>
                                          checked
                                            ? prev.filter((id) => id !== c.id)
                                            : [...prev, c.id]
                                        );
                                      }}
                                    />
                                    <span>{c.text}</span>
                                  </label>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 "
                      onClick={() => handleSaveEditTodo()}
                    >
                      저장
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 "
                      onClick={() => setEditTodoId(null)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-start gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id)}
                      />
                      <span
                        className={`${todo.completed ? "line-through" : ""}`}
                      >
                        {todo.text}
                      </span>
                    </label>
                    {todo.references.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {todo.references.map((ref) => `@${ref}`).join(", ")}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
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
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              이전
            </button>

            <span className="text-sm">
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              다음
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
