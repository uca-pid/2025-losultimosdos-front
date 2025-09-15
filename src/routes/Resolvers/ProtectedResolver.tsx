import { getUserIdFromToken } from "../../utils/auth";
import { useMemo, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
    redirectPath: string;
}

export const ProtectedResolver = ({ redirectPath }: Props) => {
    const [token] = useState<string | null>(() => localStorage.getItem('token'));
    const userId = useMemo(() => (token ? getUserIdFromToken(token) : null), [token]);
    if (userId === undefined) {
        return <Navigate to={redirectPath}/>;
    } else {
        return <Outlet />;
    }
}