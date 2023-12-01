export default function CheckboxInput() {
  return (
    <div className="my-1">
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id="comments"
            aria-describedby="comments-description"
            name="comments"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor="comments" className="font-medium text-gray-900">
            New comments
          </label>{" "}
          <span id="comments-description" className="text-gray-500">
            <span className="sr-only">New comments </span>so you always know happening.
          </span>
        </div>
      </div>
    </div>
  );
}
