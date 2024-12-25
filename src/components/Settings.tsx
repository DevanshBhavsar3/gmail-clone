import {
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useFirebase } from "../context/firebase";
import { MailType } from "../type";
import { handleDeleteMails } from "../utils/handleDeleteMails";

// Icons
import { BiError } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { MdDelete, MdLogout } from "react-icons/md";
import { RiArrowUpSLine } from "react-icons/ri";

interface SettingsProp {
  emails: MailType[];
}

export default function Settings({ emails }: SettingsProp) {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [settingsMenuVisibility, setSettingsMenuVisibility] =
    useState<boolean>(false);
  const [confirmPopupVisibility, setConfirmPopupVisibility] =
    useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const isGoogleUser = firebase.auth.currentUser?.providerData.some(
    (provider) => provider.providerId === "google.com"
  );

  const handleLogOut = async () => {
    await firebase.auth.signOut();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    navigate("/");
  };

  const handleDeleteAccount = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (firebase.auth.currentUser) {
        if (isGoogleUser) {
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(firebase.auth.currentUser, provider);
        } else {
          const userCredential = EmailAuthProvider.credential(
            firebase.auth.currentUser.email!,
            password
          );
          await reauthenticateWithCredential(
            firebase.auth.currentUser,
            userCredential
          );
        }
        await handleDeleteMails(emails, firebase);
        deleteDoc(doc(firebase.db, "users", firebase.auth.currentUser.email!));
        await deleteUser(firebase.auth.currentUser);
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid Password.");
    }
  };

  return (
    <>
      <motion.button
        animate={{ rotate: settingsMenuVisibility ? 180 : -180 }}
        transition={{ duration: 0.1 }}
        className="z-20 flex items-center bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200 fixed bottom-5 left-5"
        onClick={() => setSettingsMenuVisibility(!settingsMenuVisibility)}
      >
        {settingsMenuVisibility ? (
          <RiArrowUpSLine className="text-sm md:text-lg lg:text-xl" />
        ) : (
          <IoMdSettings className="text-sm md:text-lg lg:text-xl" />
        )}
      </motion.button>

      <AnimatePresence>
        {settingsMenuVisibility && (
          <motion.div
            key={Math.random()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="z-10 fixed h-36 bottom-5 left-5 p-2 bg-white text-black border-2 rounded-[16px] border-blue-500/50 flex flex-col gap-2"
          >
            <motion.button
              className="text-blue-500 border-2 border-blue-500 rounded-md sm:rounded-xl hover:bg-blue-500 hover:text-white transition duration-200"
              onClick={handleLogOut}
            >
              <div className="flex items-center w-full h-full p-2">
                <MdLogout />
                <p className="text-xs sm:text-sm w-full">Log out</p>
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="text-red-500 border-2 border-red-500/90 rounded-md sm:rounded-xl hover:bg-red-600 hover:text-white transition duration-200"
              onClick={() => setConfirmPopupVisibility(true)}
            >
              <div className="flex justify-between items-center w-full h-full p-2 gap-2">
                <MdDelete className="text-lg" />
                <p className="text-xs sm:text-sm w-full">Delete Account</p>
              </div>
            </motion.button>
          </motion.div>
        )}

        {confirmPopupVisibility && (
          <div className="z-30 fixed h-full w-full bg-black/30">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] border-2 border-black/10 rounded-md bg-white shadow-lg p-5 flex flex-col gap-3 justify-center items-center text-xs md:text-base text-center"
            >
              <BiError className="text-3xl sm:text-5xl text-red-500" />
              <p className="text-xl sm:text-2xl font-semibold text-red-500">
                Delete Account
              </p>

              <form
                className="flex flex-col items-center gap-3"
                onSubmit={handleDeleteAccount}
              >
                {!isGoogleUser && (
                  <div className="w-full text-left">
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-3 bg-gray-500/20 rounded-md focus:outline-none focus:ring-1 focus:ring-black shadow-sm"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                      <p className="text-red-500 text-xs ml-2">{error}</p>
                    )}
                  </div>
                )}

                <p>You'll permanently lose your:</p>
                <ul className="list-disc text-left">
                  <li>Accout</li>
                  <li>Email</li>
                  <li>Messages</li>
                </ul>

                <div className="flex gap-3 flex-col sm:flex-row w-full mt-5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="w-full sm:w-auto px-5 md:px-10 py-1 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md transition duration-200 shadow-lg order-2 sm:order-1"
                    onClick={() => setConfirmPopupVisibility(false)}
                  >
                    <p>Cancel</p>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full sm:w-auto px-1 md:px-2 py-1 bg-red-500 rounded-md hover:bg-red-800/90 text-white transition duration-200 shadow-lg order-1 sm:order-2"
                  >
                    <p>Delete Account</p>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
