interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center pt-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-3 py-1 rounded border disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          이전
        </button>

        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          className="px-3 py-1 rounded border disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        >
          다음
        </button>
      </div>
    </div>
  );
}
