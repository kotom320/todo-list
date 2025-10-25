import type { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  editTodoId: number | null;
  editTodoText: string;
  draftRefs: number[];
  refOpenId: number | null;
  todos: Todo[];
  onEditTodo: (id: number, text: string) => void;
  onSaveEditTodo: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onDraftRefsChange: (refs: number[]) => void;
  onRefOpenToggle: (id: number) => void;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

export function TodoItem({
  todo,
  editTodoId,
  editTodoText,
  draftRefs,
  refOpenId,
  todos,
  onEditTodo,
  onSaveEditTodo,
  onCancelEdit,
  onEditTextChange,
  onDraftRefsChange,
  onRefOpenToggle,
  onToggleTodo,
  onDeleteTodo,
}: TodoItemProps) {
  if (editTodoId === todo.id) {
    return (
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex flex-col gap-2 w-full">
          <input
            autoFocus
            type="text"
            value={editTodoText}
            onChange={(e) => onEditTextChange(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSaveEditTodo();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                onCancelEdit();
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
              onClick={() => onRefOpenToggle(todo.id)}
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
                              onDraftRefsChange(
                                checked
                                  ? draftRefs.filter((id) => id !== c.id)
                                  : [...draftRefs, c.id]
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => onSaveEditTodo()}
          >
            저장
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => onCancelEdit()}
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleTodo(todo.id)}
          />
          <span className={`${todo.completed ? "line-through" : ""}`}>
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
          onClick={() => onEditTodo(todo.id, todo.text)}
        >
          수정
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => onDeleteTodo(todo.id)}
        >
          삭제
        </button>
      </div>
    </>
  );
}
