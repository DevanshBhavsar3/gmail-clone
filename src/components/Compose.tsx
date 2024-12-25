import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import { useFirebase } from "../context/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Icons
import { CiMaximize1 } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";

type MessageType = {
  error?: string;
  message?: string;
};

type ComposeProps = {
  setReload: (randomNumber: number) => void;
};

export default function Compose({ setReload }: ComposeProps) {
  const firebase = useFirebase();

  const [message, setMessage] = useState<MessageType>({});

  const [composeVisibility, setComposeVisibility] = useState<boolean>(false);
  const [to, setTo] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [maximize, setMaximize] = useState<boolean>(true);

  useEffect(() => {
    document.getElementById("to")?.focus();
  }, []);

  const handleSendMail = async (e: FormEvent) => {
    e.preventDefault();
    const userEmail = firebase.auth.currentUser?.email;

    try {
      if (to === userEmail) {
        setMessage({ error: "Can't Email Yourself" });
        return;
      }

      const receiverSnapshot = await getDoc(doc(firebase.db, "users", to));
      if (!receiverSnapshot.exists()) {
        setMessage({ error: `Can't Email ${to}` });
        return;
      }

      const threadId = v4();

      await setDoc(doc(firebase.db, "emails", v4()), {
        from: userEmail,
        to,
        subject,
        body,
        createdAt: Date.now(),
        threadId,
        deletedBy: [],
      });

      await setDoc(doc(firebase.db, "threads", threadId), {
        messageCount: 0,
        messages: [],
      });

      setTo("");
      setSubject("");
      setBody("");
      setMessage({ message: "Mail sent Successfully." });
      setReload(Math.random());
    } catch (error) {
      console.error(error);
      setMessage({ error: "Fail Sending Email." });
    } finally {
      setTimeout(() => setMessage({}), 3000);
    }
  };

  return (
    <>
      {/* Compose Button */}
      <button
        className={`items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200 fixed bottom-5 right-5 ${
          composeVisibility ? "hidden" : "flex"
        }`}
        onClick={() => {
          if (window.innerWidth < 640) {
            setMaximize(true);
          } else {
            setMaximize(false);
          }

          setComposeVisibility(!composeVisibility);
        }}
      >
        <GoPencil className="text-sm md:text-lg lg:text-xl" />
        <p className="font-Lato text-xs sm:text-sm md:text-md lg:text-lg">
          Compose
        </p>
      </button>

      <AnimatePresence>
        {/* Compose Box */}
        {composeVisibility ? (
          <motion.div
            className={`z-30 fixed text-xs md:text-md lg:text-base ${
              maximize
                ? "w-full h-full bg-black/40"
                : "w-1/3 h-2/3 bottom-5 right-5"
            }
            `}
          >
            <motion.div
              className="relative w-full h-full"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "keyframes" }}
            >
              <form
                onSubmit={handleSendMail}
                className={`flex flex-col bg-white font-Lato overflow-hidden border-2 border-black/10 rounded-md
        ${
          maximize
            ? "h-[80%] w-[80%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            : "w-full h-full"
        } `}
              >
                <div className="p-2 rounded-tl-md text-white flex items-center justify-between bg-blue-500">
                  <p>New Message</p>
                  <div className="flex gap-3">
                    <CiMaximize1
                      id="maximize"
                      className="cursor-pointer hidden sm:block"
                      onClick={() => setMaximize(!maximize)}
                    />
                    <RxCross2
                      id="close"
                      className="cursor-pointer"
                      onClick={() => {
                        setComposeVisibility(false);
                        setMaximize(false);
                      }}
                    />
                  </div>
                </div>
                <div className="w-full flex">
                  <label htmlFor="to" className="p-2 text-gray-600">
                    To
                  </label>
                  <input
                    type="email"
                    id="to"
                    value={to}
                    className="w-full outline-none rounded-tr-md"
                    onChange={(e) => setTo(e.target.value)}
                    required
                  />
                </div>

                <hr />

                <div className="w-full flex">
                  <label
                    htmlFor="subject"
                    className="p-2 bg-white text-gray-600"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    className="w-full outline-none"
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <hr />
                <div className={`bg-white flex flex-1`}>
                  <textarea
                    className="w-full flex-1 outline-none p-2 resize-none"
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="bg-white p-2 rounded-b-md flex items-center justify-between">
                  <button
                    id="send"
                    type="submit"
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition duration-200"
                  >
                    <GoPencil className="text-xl" />
                    <span className="font-Lato">Send</span>
                  </button>
                  <p
                    className={`text-sm text-nowrap  ${
                      message?.error ? "text-red-400" : "text-green-500"
                    }`}
                  >
                    {message?.message || message?.error}
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : undefined}
      </AnimatePresence>
    </>
  );
}
