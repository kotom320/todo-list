import { useEffect, useState } from "react";
import { Pagination } from "./components/Pagination";
import { TodoFilterComponent } from "./components/TodoFilter";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import {
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from "./hooks/useTodos";
import { TodoFilter } from "./types/todo";

function App() {
  // React Query hooks
  const { data: todos = [], isLoading, error } = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

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
      await updateTodoMutation.mutateAsync({
        id: editTodoId,
        updates: { text, references: refs },
      });
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
      await createTodoMutation.mutateAsync({ text });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodoMutation.mutateAsync(id);
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
      await updateTodoMutation.mutateAsync({
        id,
        updates: { completed: !target.completed },
      });
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

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-lg">로딩중</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-lg text-red-600">
          TODO List를 불러오는데 실패했습니다.
        </div>
        <div className="text-sm text-gray-600 mt-2">{error.message}</div>
      </div>
    );
  }

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
