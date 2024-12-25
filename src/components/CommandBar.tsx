import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useFirebase } from "../context/firebase";
import { MailType } from "../type";
import { handleDeleteMails } from "../utils/handleDeleteMails";
import CommandButton from "./CommandButton";
import ErrorMessage from "./ErrorMessage";

// Icons
import { GoArrowLeft } from "react-icons/go";
import { IoCheckmark, IoTrashOutline } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { TbReload } from "react-icons/tb";

type CommandBarProps = {
  selectAllEmails: boolean;
  setSelectAllEmails: (selectAllEmails: boolean) => void;
  setReload: (randomNumber: number) => void;
  selectedEmails: MailType[];
  setSelectedEmails: (selectedEmails: MailType[]) => void;
};

export default function CommandBar({
  selectAllEmails,
  setSelectAllEmails,
  setReload,
  selectedEmails,
  setSelectedEmails,
}: CommandBarProps) {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const MotionCommandButton = motion.create(CommandButton);

  const handelReload = () => {
    setReload(Math.random());
  };

  const handelDelete = async () => {
    try {
      navigate("/inbox");
      await handleDeleteMails(selectedEmails, firebase);
      setReload(Math.random());
      setSelectedEmails([]);
    } catch (error) {
      console.error(error);
      setError("Failed to delete emails.");
    }
  };

  const handelBack = () => {
    navigate("/inbox");
    setSelectedEmails([]);
  };

  const isInbox = location.pathname === "/inbox";

  return (
    <nav className="bg-blue-500 px-5 pt-3 text-white text-lg md:text-2xl flex gap-10">
      {error && <ErrorMessage error={error} />}

      {isInbox ? (
        // Select Box
        <CommandButton
          onClick={() => setSelectAllEmails(!selectAllEmails)}
          icon={
            selectAllEmails ? (
              <IoCheckmark className="text-sm md:text-lg border-2 border-white rounded-sm m-[2px] md:m-[3px] cursor-pointer" />
            ) : (
              <MdOutlineCheckBoxOutlineBlank className="cursor-pointer" />
            )
          }
        />
      ) : (
        // Back Button
        <MotionCommandButton
          whileTap={{ x: -5 }}
          onClick={handelBack}
          icon={<GoArrowLeft className="cursor-pointer" />}
        />
      )}

      {/* Reload Button */}
      <MotionCommandButton
        whileTap={{ rotate: 90 }}
        onClick={handelReload}
        icon={<TbReload className="cursor-pointer" />}
      />

      {/* Delete Button */}
      {selectedEmails.length > 0 && (
        <CommandButton
          onClick={handelDelete}
          icon={<IoTrashOutline className="cursor-pointer" />}
        />
      )}
    </nav>
  );
}
