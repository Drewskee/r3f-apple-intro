import { Loader2Icon } from "lucide-react";

export default function Loader() {
  return (
      <div className="flex size-full h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col justify-center items-center space-x-1 text-2xl h-full">
          <Loader2Icon className="mt-4 size-12 animate-spin" />
        </div>
      </div>
  );
}
