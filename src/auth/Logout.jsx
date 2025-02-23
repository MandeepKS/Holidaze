import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
/**
 * Logout component that redirects the user to the home page upon rendering.
 *
 * This component is used to log out a user by navigating them to the homepage (`/`).
 * It utilizes `useEffect` to trigger navigation as soon as the component mounts.
 *
 * @component
 * @example
 * ```jsx
 * <Logout />
 * ```
 */
export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
   navigate("/");
  } ,[navigate]);
  return null;
}