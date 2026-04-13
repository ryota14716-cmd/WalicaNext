type ToastProps = {
  message: string;
};

export const Toast = ({ message }: ToastProps) => (
  <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-soft">
    {message}
  </div>
);
