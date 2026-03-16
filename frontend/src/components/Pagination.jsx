const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 py-6">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        Previous
      </button>

      <span className="text-sm font-medium text-gray-700">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
