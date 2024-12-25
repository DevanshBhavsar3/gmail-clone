import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import EmptyMailBox from "../components/EmptyMailBox";
import MailItem from "../components/MailItem";
import { useFirebase } from "../context/firebase";
import { MailContextType, MailType } from "../type";
import { handleDeleteMails } from "../utils/handleDeleteMails";
import ErrorMessage from "./ErrorMessage";

export default function MailsContainer() {
  const {
    emails,
    setEmails,
    selectAllEmails,
    setSelectAllEmails,
    selectedEmails,
    setSelectedEmails,
    reload,
    setReload,
    searchValue,
  }: MailContextType = useOutletContext();

  const firebase = useFirebase();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const emailId = firebase.auth.currentUser?.email;

      try {
        const emailsRef = collection(firebase.db, "emails");

        const q = query(
          emailsRef,
          where("from", "==", emailId),
          where("deletedBy", "not-in", [[emailId]])
        );
        const q2 = query(
          emailsRef,
          where("to", "==", emailId),
          where("deletedBy", "not-in", [[emailId]])
        );

        const [sentSnapshot, recievedSnapshot] = await Promise.all([
          getDocs(q),
          getDocs(q2),
        ]);

        const emails: MailType[] = [
          ...sentSnapshot.docs.map((doc) => ({
            id: doc.id as string,
            from: doc.data().from as string,
            to: doc.data().to as string,
            subject: doc.data().subject as string,
            body: doc.data().body as string,
            createdAt: doc.data().createdAt as number,
            type: "sent",
            threadId: doc.data().threadId as string,
          })),
          ...recievedSnapshot.docs.map((doc) => ({
            id: doc.id as string,
            from: doc.data().from as string,
            to: doc.data().to as string,
            subject: doc.data().subject as string,
            body: doc.data().body as string,
            createdAt: doc.data().createdAt as number,
            type: "received",
            threadId: doc.data().threadId as string,
          })),
        ];
        setEmails(emails);
      } catch (error) {
        console.log(error);
        setError("An error occurred");
      }
    };

    onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        fetchEmails();
      } else {
        navigate("/login");
      }
    });
  }, [reload, firebase, setEmails, navigate]);

  useEffect(() => {
    if (selectAllEmails) {
      setSelectedEmails(emails);
    } else if (selectedEmails.length === emails.length && emails.length > 1) {
      setSelectedEmails([]);
    }
  }, [selectAllEmails, setSelectedEmails, emails, selectedEmails.length]);

  const handleCheckboxClick = useCallback(
    (mail: MailType) => {
      setSelectedEmails((prev: MailType[]) => {
        const isSelected = prev.includes(mail);
        const updatedSelection = isSelected
          ? prev.filter((email) => email !== mail)
          : [...prev, mail];

        setSelectAllEmails(updatedSelection.length === emails.length);

        return updatedSelection;
      });
    },
    [setSelectAllEmails, setSelectedEmails, emails.length]
  );

  const handleMailSelect = (mail: MailType) => {
    if (selectAllEmails) setSelectAllEmails(false);
    setSelectedEmails([mail]);
    navigate(`/inbox/${mail.id}`);
  };

  const handelMailDelete = async (mail: MailType) => {
    try {
      await handleDeleteMails(mail, firebase);
      setSelectAllEmails(false);
      setReload(Math.random());
    } catch (error) {
      console.log(error);
      setError("Failed to delete email");
    }
  };

  return (
    <>
      {error && <ErrorMessage error={error} />}
      <table className="w-full table-fixed overflow-y-auto overflow-x-hidden h-full rounded-xl">
        <tbody>
          {(() => {
            const filteredEmails = emails
              .filter((mail) =>
                mail.subject.toLowerCase().includes(searchValue.toLowerCase())
              )
              .sort((a, b) => b.createdAt - a.createdAt);

            if (emails.length === 0 || filteredEmails.length === 0) {
              return <EmptyMailBox />;
            }

            return filteredEmails.map((mail) => (
              <MailItem
                key={mail.id}
                mail={mail}
                isSelected={selectedEmails.includes(mail)}
                onSelect={handleMailSelect}
                onDelete={handelMailDelete}
                onCheckboxChange={handleCheckboxClick}
              />
            ));
          })()}
        </tbody>
      </table>
    </>
  );
}
