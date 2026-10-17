function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-[3px] border-slate-200"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-blue-600"></div>
        </div>
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}

export default LoadingState;
