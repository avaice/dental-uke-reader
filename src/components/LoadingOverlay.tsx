import loading from "../assets/loading.svg";

export const LoadingOverlay = ({ message }: { message: string }) => {
  return (
    <div className="fixed top-0 left-0 z-10 flex size-full flex-col items-center justify-center gap-8 bg-black/70">
      <img src={loading} alt="loading" className="size-16" />
      <span className="text-2xl text-white">{message}</span>
    </div>
  );
};
