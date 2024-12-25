// Icons
import { RiErrorWarningLine } from "react-icons/ri";

type SuccessMessageProps = {
  message: string;
};

export default function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="z-40 fixed flex items-center bg-green-400 p-2 w-auto rounded-md bottom-5 left-5">
      <RiErrorWarningLine className="text-xl sm:text-2xl mr-3" />
      <span className="text-sm sm:text-md">{message}</span>
    </div>
  );
}
