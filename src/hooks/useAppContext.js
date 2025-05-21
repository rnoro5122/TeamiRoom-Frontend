import { useContext } from "react";
import { AppContext } from "../context/context";

// Custom hook for using context
export function useAppContext() {
  return useContext(AppContext);
}
