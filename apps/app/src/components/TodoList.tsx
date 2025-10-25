import type { Todo } from "../types/todo";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  allTodos: Todo[];
  editTodoId: number | null;
  editTodoText: string;
  draftRefs: number[];
  refOpenId: number | null;
  onEditTodo: (id: number, text: string) => void;
  onSaveEditTodo: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onDraftRefsChange: (refs: number[]) => void;
  onRefOpenToggle: (id: number) => void;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

export function TodoList({
  todos,
  allTodos,
  editTodoId,
  editTodoText,
  draftRefs,
  refOpenId,
  onEditTodo,
  onSaveEditTodo,
  onCancelEdit,
  onEditTextChange,
  onDraftRefsChange,
  onRefOpenToggle,
  onToggleTodo,
  onDeleteTodo,
}: TodoListProps) {
  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id} className="flex justify-between items-center">
          <TodoItem
            todo={todo}
            editTodoId={editTodoId}
            editTodoText={editTodoText}
            draftRefs={draftRefs}
            refOpenId={refOpenId}
            todos={allTodos}
            onEditTodo={onEditTodo}
            onSaveEditTodo={onSaveEditTodo}
            onCancelEdit={onCancelEdit}
            onEditTextChange={onEditTextChange}
            onDraftRefsChange={onDraftRefsChange}
            onRefOpenToggle={onRefOpenToggle}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}
