import { createContext} from "react";
import { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext();
/**
 * AuthProvider component that provides authentication-related state and actions to its children.
 *
 * This provider stores authentication details such as login status, user role, token, avatar, name, and email
 * using local storage. It also removes stored user data if the user is not logged in.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * @returns {JSX.Element} The authentication context provider component.
 */
export function AuthProvider  ({children}) {
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
    const [isManager, setIsManager] = useLocalStorage("isManager", false);
    const [token, setToken] = useLocalStorage("token", "");
    const [avatar, setAvatar] = useLocalStorage("avatar", "");
    const [name, setName] = useLocalStorage("name", "");
    const [email, setEmail] = useLocalStorage("email", "");
    // Clear stored user data if not logged in
    if (!isLoggedIn) {
        localStorage.removeItem("token");
        localStorage.removeItem("avatar");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("isManager");
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
/**
 * Custom hook to access authentication context.
 *
 * @function
 * @returns {Object} The authentication context, including login status, user data, and setter functions.
 *
 * @example
 * const { isLoggedIn, setIsLoggedIn } = useLoggedIn();
 */
export const useLoggedIn = () =>  useContext(AuthContext);