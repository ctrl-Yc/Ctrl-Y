import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { Keyword } from "./pages/Keyword.jsx";
import { Top } from "./pages/Top.jsx";
import { SignupPage } from "./pages/SignupPage.jsx";
import { ChildSignup } from "./pages/ChildSignup.jsx";
import { ChildUrl } from "./pages/ChildUrl.jsx";
import { ChildTop } from "./pages/ChildTop.jsx";
import { PasswordResetRequest } from "./pages/PasswordResetRequest.jsx";
import { PasswordReset } from "./pages/PasswordReset.jsx";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/resetRequest" element={<PasswordResetRequest />} />
            <Route path="/reset" element={<PasswordReset />} />
            <Route path="/child/login/:childUUID" element={<Keyword />} />
            <Route path="/child/top/:childUUID" element={<ChildTop />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/top" element={<Top />} />
            <Route path="/childName" element={<ChildSignup />} />
            <Route path="/childUrl" element={<ChildUrl />} />
        </Routes>
    );
}
