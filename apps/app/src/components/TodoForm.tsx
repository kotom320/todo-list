import { useRef } from "react";

interface TodoFormProps {
  onAddTodo: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onAddTodo(e);
    // 입력 필드 초기화 및 포커스
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
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
  );
}
