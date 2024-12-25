import { Auth } from "firebase/auth";
import { doc, Firestore, getDoc, writeBatch } from "firebase/firestore";
import { MailType } from "../type";

export async function handleDeleteMails(
  mails: MailType[] | MailType,
  firebase: {
    auth: Auth;
    db: Firestore;
  }
) {
  const userEmail = firebase.auth.currentUser?.email;

  try {
    const batch = writeBatch(firebase.db);
    const mailsArray = Array.isArray(mails) ? mails : [mails];

    for (const mail of mailsArray) {
      const mailRef = doc(firebase.db, "emails", mail.id);
      const threadRef = doc(firebase.db, "threads", mail.threadId);

      const mailDoc = await getDoc(mailRef);

      if (!mailDoc.exists()) {
        continue;
      }

      const mailData = mailDoc.data();

      const deletedBy = mailData.deletedBy || [];

      if (!deletedBy.includes(userEmail)) {
        deletedBy.push(userEmail);
      }

      if (deletedBy.length === 2) {
        batch.delete(mailRef);
        batch.delete(threadRef);
      } else {
        batch.update(mailRef, { deletedBy });
      }
    }

    await batch.commit();
    return { message: "Deleted Successfully." };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
