import { onAuthStateChanged } from "firebase/auth";
import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { useFirebase } from "../context/firebase";
import { MailType, MessageType, ThreadType } from "../type";

// Icons
import { GoReply } from "react-icons/go";

type ContextType = {
  reload: number;
  setReload: (randomNumber: number) => void;
};

export default function Mail() {
  const firebase = useFirebase();
  const location = useLocation();
  const navigate = useNavigate();

  const { reload, setReload }: ContextType = useOutletContext();
  const [emailData, setEmailData] = useState<MailType>();
  const [threadsData, setThreadsData] = useState<ThreadType>();
  const [replyMessage, setReplyMessage] = useState<string>("");

  useEffect(() => {
    const handleGetData = async () => {
      const userEmail = firebase.auth.currentUser?.email;
      try {
        const emailId = location.pathname.split("/")[2];

        const emailsSnapShot = await getDoc(
          doc(firebase.db, "emails", emailId)
        );
        const emailsData = emailsSnapShot.data();

        if (!emailsData) throw Error("Cannot get Mail.");

        const threadsSnapshot = await getDoc(
          doc(firebase.db, "threads", emailsData?.threadId)
        );
        const threadsData = threadsSnapshot.data();

        if (!threadsData) throw Error("Cannot get Threads.");

        setEmailData({
          ...emailsData,
          type: emailsData?.from === userEmail ? "sent" : "received",
        } as MailType);
        setThreadsData({
          messageCount: threadsData.messageCount,
          messages: threadsData.messages.sort(
            (a: MessageType, b: MessageType) => b.messageAt - a.messageAt
          ),
        });
      } catch (error) {
        console.error(error);
        navigate("/notfound");
      }
    };

    onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        handleGetData();
      } else {
        navigate("/login");
      }
    });
  }, [reload, firebase, location.pathname, navigate]);

  const handleReplySend = async (e: FormEvent) => {
    e.preventDefault();

    const userEmail = firebase.auth.currentUser?.email;

    try {
      const threadRef = doc(firebase.db, "threads", emailData!.threadId);

      await updateDoc(threadRef, {
        messageCount: increment(1),
        messages: arrayUnion({
          message: replyMessage,
          messageAt: Date.now(),
          sender: userEmail,
        }),
      });

      setReload(Math.random());
      setReplyMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 text-xs md:text-sm lg:text-base">
        {/* Mail Conatainer */}
        <h1 className="text-lg md:text-xl lg:text-2xl pb-4 font-semibold break-words">
          {emailData?.subject}
        </h1>
        <div className="flex flex-col gap-2 sm:flex-row justify-between pb-5">
          <span className="font-medium">
            {emailData?.from}

            <p className="text-black/40">
              {emailData?.type === "received"
                ? "to me,"
                : `to ${emailData?.to},`}
            </p>
          </span>
          <p className="text-gray-600 font-light">
            {new Date(Number(emailData?.createdAt)).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
        <div className="pb-4 break-words">{emailData?.body}</div>

        {/* Reply Container */}
        <div>
          <form onSubmit={handleReplySend} className="group">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 my-5 rounded-full hover:bg-blue-600 transition duration-200"
            >
              <GoReply className="text-sm md:text-lg lg:text-xl" />
              Reply
            </motion.button>
            <textarea
              id="replyMessage"
              className="group-focus-within:block hidden w-full h-[20vh] border-2 border-black/10 rounded-xl p-2 outline-none resize-none"
              required
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
          </form>
        </div>

        {/* Replies */}
        <h1 className="text-lg md:text-xl lg:text-2xl pb-4 font-semibold py-5">
          Replies ({threadsData?.messageCount})
        </h1>
        <div className="flex flex-col gap-2">
          {threadsData?.messages.map((message) => (
            <div
              className="flex flex-col gap-2 bg-gray-200/80 rounded-lg p-3"
              key={message.messageAt}
            >
              <div className="flex justify-between flex-col mb-2 sm:flex-row">
                <p className="font-">{message.sender}</p>
                <p className="text-gray-600 font-light">
                  {new Date(Number(message.messageAt)).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div>
                <p className="break-words">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
