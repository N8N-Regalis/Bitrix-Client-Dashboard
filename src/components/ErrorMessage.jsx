export function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <p className="font-medium">Error</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
