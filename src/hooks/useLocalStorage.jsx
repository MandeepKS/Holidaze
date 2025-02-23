import { useState } from "react";
/**
 * Custom React hook for managing state with local storage.
 *
 * This hook allows you to store and retrieve values from local storage while keeping them in React state.
 * It automatically initializes the state from local storage (if available) and updates local storage
 * whenever the state changes.
 *
 * @function
 * @param {string} key - The key under which the value is stored in local storage.
 * @param {any} initialValue - The initial value to be used if no value is found in local storage.
 * @returns {[any, function]} A stateful value and a function to update it.
 *
 * @example
 * Store whether a user is a manager in local storage
 * const [isManager, setIsManager] = useLocalStorage("isManager", false);
 * setIsManager(true); // Updates the value in state and local storage
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  /**
   * Updates the stored value in both state and local storage.
   *
   * @param {any} value - The new value to store.
   */
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

export default useLocalStorage;