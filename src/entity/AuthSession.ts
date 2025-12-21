import { User } from "./User";

export interface AuthSession {
    user: User;
    token: string;
}