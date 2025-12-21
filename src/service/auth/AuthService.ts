import {AuthCredentials} from "../../entity/AuthCredentials";
import {AuthSession} from "../../entity/AuthSession";

export interface AuthService {
    login(credentials: AuthCredentials): Promise<AuthSession>;
    register(credentials: AuthCredentials): Promise<AuthSession>;
    logout(): Promise<void>;
    getSession(): Promise<AuthSession | null>;
}