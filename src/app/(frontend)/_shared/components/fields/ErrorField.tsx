export const ErrorField = ({ message }: { message: string | undefined }) =>
  message ? (
    <p className="mt-1 h-2 w-full text-[11px] text-red-600">{message}</p>
  ) : null;
