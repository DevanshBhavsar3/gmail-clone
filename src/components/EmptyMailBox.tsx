// Icons
import { BsEnvelopeExclamation } from "react-icons/bs";

export default function EmptyMailBox() {
  return (
    <tr className="flex flex-col justify-center items-center h-full">
      <td>
        <BsEnvelopeExclamation className="text-6xl sm:text-9xl text-gray-200" />
        <p className="text-md sm:text-2xl text-gray-300">Nothing Here!</p>
      </td>
    </tr>
  );
}
