// filepath: c:\Users\Home\Documents\GitHub\teamiroom-frontend\src\hooks\useAppContext.js
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

// Custom hook for using context
export function useAppContext() {
  return useContext(AppContext);
}
