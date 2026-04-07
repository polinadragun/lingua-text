import { User } from "./User";

export interface AuthSession {
    user: User;
    /** Deprecated: access JWT is in httpOnly cookie only. */
    token?: string | null;
}