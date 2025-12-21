import { Routes, Route } from "react-router-dom";
import { CatalogPage } from "../pages/CatalogPage";
import { TextPage } from "../pages/TextPage";
import { GroupPage } from "../pages/GroupPage";
import { ProfilePage } from "../pages/ProfilePage";
import { AuthPage } from "../pages/AuthPage";
import { CreateTextPage } from "../pages/CreateTextPage";
import { MyTextsPage } from "../pages/MyTextsPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => (
    <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/text/:id" element={<TextPage />} />
            <Route path="/group/:type/:value" element={<GroupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create" element={<CreateTextPage />} />
            <Route path="/my-texts" element={<MyTextsPage />} />
        </Route>
    </Routes>
);
