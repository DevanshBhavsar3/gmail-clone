import { Route, Routes } from "react-router";
import Mail from "./components/Mail.tsx";
import MailsContainer from "./components/MailsContainer.tsx";
import NotFound from "./components/NotFound.tsx";
import HomePage from "./routes/HomePage.tsx";
import Inbox from "./routes/Inbox.tsx";
import Login from "./routes/Login.tsx";
import Signup from "./routes/Signup.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/inbox" element={<Inbox />}>
        <Route index element={<MailsContainer />} />
        <Route path=":mailId" element={<Mail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
