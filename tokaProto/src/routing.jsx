import { Routes, Route } from "react-router";

import Home from "./pages/Home/Home";
import Memberships from "./pages/Memberships/Memberships";
import Auth from "./pages/Auth/Auth";
import Chat from "./pages/Chat/Chat";

export default function Pages() {
    return(
        <Routes>
            <Route index element={<Home/>} />
            <Route path="memberships" element={<Memberships/>} />
            <Route path="auth" element={<Auth/>} />
            <Route path="chat" element={<Chat/>} />
        </Routes>
    )
}