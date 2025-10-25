import { useEffect, useState } from "react";
import { todoApi } from "./api/todoApi";
import { Pagination } from "./components/Pagination";
import { TodoFilterComponent } from "./components/TodoFilter";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import type { Todo } from "./types/todo";
import { TodoFilter } from "./types/todo";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

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

  const handleSaveEditTodo = async () => {
    const text = editTodoText.trim();
    if (text === "" || !editTodoId) return;

    const existing = new Set(todos.map((t) => t.id));
    const refs = draftRefs.filter(
      (id) => existing.has(id) && id !== editTodoId
    );

    try {
      const updatedTodo = await todoApi.updateTodo(editTodoId, {
        text,
        references: refs,
      });
      setTodos((prev) =>
        prev.map((t) => (t.id === editTodoId ? updatedTodo : t))
      );
      setEditTodoId(null);
      setEditTodoText("");
      setDraftRefs([]);
      setRefOpenId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tempText = formData.get("text") as string;
    const text = tempText.trim();
    if (text === "") return;

    try {
      const newTodo = await todoApi.createTodo(text);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos((prev) =>
        prev
          .map((t) =>
            t.references.includes(id)
              ? { ...t, references: t.references.filter((r) => r !== id) }
              : t
          )
          .filter((t) => t.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: number) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    // 참조된 할 일들이 모두 완료되었는지 확인
    if (!target.completed) {
      const allDone = target.references.every(
        (ref) => todos.find((t) => t.id === ref)?.completed
      );
      if (!allDone) {
        return;
      }
    }

    try {
      const updatedTodo = await todoApi.updateTodo(id, {
        completed: !target.completed,
      });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditTodoId(null);
    setEditTodoText("");
    setDraftRefs([]);
    setRefOpenId(null);
  };

  const handleEditTextChange = (text: string) => {
    setEditTodoText(text);
  };

  const handleDraftRefsChange = (refs: number[]) => {
    setDraftRefs(refs);
  };

  const handleRefOpenToggle = (id: number) => {
    setRefOpenId((prev) => (prev === id ? null : id));
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await todoApi.getAllTodos();
        setTodos(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadTodos();
  }, []);

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
        <TodoForm onAddTodo={handleAddTodo} />
        <TodoFilterComponent
          filter={filter}
          onFilterChange={setFilter}
          total={total}
        />
        <TodoList
          todos={pageTodos}
          allTodos={todos}
          editTodoId={editTodoId}
          editTodoText={editTodoText}
          draftRefs={draftRefs}
          refOpenId={refOpenId}
          onEditTodo={handleEditTodo}
          onSaveEditTodo={handleSaveEditTodo}
          onCancelEdit={handleCancelEdit}
          onEditTextChange={handleEditTextChange}
          onDraftRefsChange={handleDraftRefsChange}
          onRefOpenToggle={handleRefOpenToggle}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
        />
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}

export default App;
