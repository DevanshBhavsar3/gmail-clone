// Icons
import { RiErrorWarningLine } from "react-icons/ri";

type ErrorMessageProps = {
  error: string;
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="fixed flex items-center bg-red-400  p-2 w-auto rounded-md bottom-5 left-5">
      <RiErrorWarningLine className="text-xl sm:text-2xl mr-3" />
      <span className="text-sm sm:text-md">{error}</span>
    </div>
  );
}
