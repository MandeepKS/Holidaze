import { createContext} from "react";
import { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext();

export function AuthProvider  ({children}) {
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
    const [isManager, setIsManager] = useLocalStorage("isManager", false);
    const [token, setToken] = useLocalStorage("token", "");
    const [avatar, setAvatar] = useLocalStorage("avatar", "");
    const [name, setName] = useLocalStorage("name", "");
    const [email, setEmail] = useLocalStorage("email", "");

    if(isLoggedIn === false){
        localStorage.clear();
    }
    return (
        <AuthContext.Provider value={{ isLoggedIn,
            setIsLoggedIn,
            isManager,
            setIsManager,
            token,
            setToken,
            avatar,
            setAvatar,
            name,
            setName,
            email,
            setEmail}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useLoggedIn = () =>  useContext(AuthContext);