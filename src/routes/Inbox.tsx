import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import CommandBar from "../components/CommandBar";
import Compose from "../components/Compose";
import Header from "../components/Header";
import Settings from "../components/Settings";
import SuccessMessage from "../components/SuccessMessage";
import { MailType } from "../type";

export default function Inbox() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [emails, setEmails] = useState<MailType[]>([]);
  const [selectAllEmails, setSelectAllEmails] = useState<boolean>(false);
  const [selectedEmails, setSelectedEmails] = useState<MailType[]>([]);
  const [reload, setReload] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (state?.successMsg) {
      setMessage(state.successMsg);
      setTimeout(() => setMessage(""), 3000);
      navigate(location.pathname, { state: {} });
    }
  }, [state, navigate, location.pathname]);

  return (
    <div className="flex flex-col h-dvh">
      {message ? <SuccessMessage message={message} /> : undefined}

      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <CommandBar
        selectAllEmails={selectAllEmails}
        setSelectAllEmails={setSelectAllEmails}
        setReload={setReload}
        selectedEmails={selectedEmails}
        setSelectedEmails={setSelectedEmails}
      />

      <div className="bg-blue-500 p-3 flex-grow">
        <div className="bg-white rounded-xl h-full overflow-hidden">
          <Outlet
            context={{
              emails,
              setEmails,
              selectAllEmails,
              setSelectAllEmails,
              selectedEmails,
              setSelectedEmails,
              reload,
              setReload,
              searchValue,
            }}
          />
        </div>
      </div>

      <Compose setReload={setReload} />
      <Settings emails={emails} />
    </div>
  );
}
