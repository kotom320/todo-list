import { TodoFilter } from "../types/todo";

type TodoFilterValue = (typeof TodoFilter)[keyof typeof TodoFilter];

interface TodoFilterProps {
  filter: TodoFilterValue;
  onFilterChange: (filter: TodoFilterValue) => void;
  total: number;
}

export function TodoFilterComponent({
  filter,
  onFilterChange,
  total,
}: TodoFilterProps) {
  return (
    <div className="flex justify-between items-center">
      <p>{total} tasks</p>
      <div className="flex gap-2">
        {[TodoFilter.ALL, TodoFilter.ACTIVE, TodoFilter.COMPLETED].map((f) => (
          <button
            key={f}
            type="button"
            className={`px-2 py-1 rounded border text-sm ${
              filter === f ? "bg-gray-100 font-semibold" : ""
            }`}
            onClick={() => onFilterChange(f)}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
