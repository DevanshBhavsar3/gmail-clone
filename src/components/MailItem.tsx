import { motion } from "motion/react";
import React from "react";
import { MailType } from "../type";

// Icons
import { IoTrashOutline } from "react-icons/io5";

interface MailItemProps {
  mail: MailType;
  isSelected: boolean;
  onSelect: (mail: MailType) => void;
  onDelete: (mail: MailType) => void;
  onCheckboxChange: (mail: MailType) => void;
}

export default function MailItem({
  mail,
  isSelected,
  onSelect,
  onDelete,
  onCheckboxChange,
}: MailItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (
      (e.target as HTMLInputElement).type !== "checkbox" &&
      (e.target as HTMLElement).id !== "deleteMail" &&
      (e.target as HTMLElement).parentElement?.id !== "deleteMail"
    ) {
      onSelect(mail);
    }
  };

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        whileHover={{
          boxShadow:
            "0px -4px 6px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.2)",
        }}
        className={`flex border-b border-gray-500/40 px-3 py-1 sm:p-2 sm:px-4 items-center group select-none ${
          isSelected ? "bg-blue-300" : "bg-transparent"
        }`}
        key={mail.id}
        onClick={handleClick}
      >
        <td className="flex items-center justify-center">
          <input
            type="checkbox"
            className="md:scale-150 cursor-pointer"
            checked={isSelected}
            onChange={() => onCheckboxChange(mail)}
          />
        </td>

        <td className="min-w-[20%] max-w-[20%] mx-5 hidden sm:block">
          <p className="font-semibold text-xs md:text-md lg:text-base text-nowrap truncate">
            {mail.type === "sent" ? `To: ${mail.to}` : mail.from}
          </p>
        </td>
        <td className="overflow-hidden hidden sm:block w-[70%] mx-5">
          <p className="font-semibold text-xs md:text-md lg:text-base truncate">
            {mail.subject}
          </p>
        </td>
        <td className="hidden sm:flex text-center w-[10%] justify-center">
          <p className="group-hover:hidden font-semibold text-xs md:text-md lg:text-base hidden sm:block">
            {new Date(mail.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </p>
          <motion.div whileHover={{ scale: 1.3 }}>
            <IoTrashOutline
              className="group-hover:block hidden cursor-pointer text-md lg:text-xl hover:text-blue-500"
              id="deleteMail"
              onClick={() => onDelete(mail)}
            />
          </motion.div>
        </td>

        <td className="flex sm:hidden flex-col w-full mx-2 overflow-hidden">
          <span className="font-semibold text-xs text-nowrap flex justify-between my-1">
            {mail.type === "sent" ? `To: ${mail.to}` : mail.from}

            <p className="font-semibold text-[10px]">
              {new Date(mail.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </span>

          <p className="font-semibold text-xs truncate">{mail.subject}</p>
        </td>
      </motion.tr>
    </>
  );
}
