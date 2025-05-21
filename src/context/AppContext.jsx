import { useState } from "react";
import { AppContext } from "./context";
import { createPromise } from "../utils/api";

// Helper to load promise info from localStorage
const loadPromiseInfoFromStorage = () => {
  try {
    const stored = localStorage.getItem("promiseInfo");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date string back to Date object if it exists
      if (parsed.promiseDate) {
        parsed.promiseDate = new Date(parsed.promiseDate);
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error loading promise info from storage:", error);
  }
  return {
    numberOfPeople: "",
    promiseName: "",
    promiseDate: null,
  };
};

// Provider component
export function AppContextProvider({ children }) {
  // State for promise information - load from localStorage if available
  const [promiseInfo, setPromiseInfo] = useState(loadPromiseInfoFromStorage);

  // State for UI controls
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [showLinkScreen, setShowLinkScreen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [promiseIdMap, setPromiseIdMap] = useState({});

  // Function to update promise info and save to localStorage
  const updatePromiseInfo = (field, value) => {
    setPromiseInfo((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Save to localStorage
      try {
        // For date object, we need to convert to string for storage
        const storageData = {
          ...updated,
          promiseDate: updated.promiseDate
            ? updated.promiseDate.toISOString()
            : null,
        };
        localStorage.setItem("promiseInfo", JSON.stringify(storageData));
      } catch (error) {
        console.error("Error saving promise info to storage:", error);
      }

      return updated;
    });
  };

  // Function to generate promise link
  const generateLink = async () => {
    try {
      console.log("Generating link for:", promiseInfo);

      // Create a UUID for the promiseId (You could also let the backend generate this)
      const promiseId = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Prepare data for API
      const promiseData = {
        promiseId: promiseId,
        promiseName: promiseInfo.promiseName,
        numberOfPeople: parseInt(promiseInfo.numberOfPeople),
        promiseDate: promiseInfo.promiseDate.toISOString(),
      }; // Call the API to create a promise using the API utility function
      const responseData = await createPromise(promiseData);
      console.log("Promise created:", responseData);

      // For backwards compatibility, also save to localStorage
      try {
        // Save this specific promise data with its ID
        localStorage.setItem(
          `promise_${promiseId}`,
          JSON.stringify({
            ...promiseData,
            id: promiseId,
            createdAt: new Date().toISOString(),
          })
        );

        // Update the mapping
        const updatedMap = { ...promiseIdMap, [promiseId]: promiseData };
        setPromiseIdMap(updatedMap);
        localStorage.setItem("promiseIdMap", JSON.stringify(updatedMap));
      } catch (error) {
        console.error("Error saving promise data locally:", error);
      }

      // For development, we'll use the current URL as base
      // In production, this would be the actual domain
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/promise/${promiseId}`;

      setGeneratedLink(link);
      setShowLinkScreen(true);

      return link;
    } catch (error) {
      console.error("Error generating link:", error);
      alert(`약속 생성에 실패했습니다: ${error.message}`);
    }
  };

  // Function to get promise data by ID
  const getPromiseById = (promiseId) => {
    try {
      // First try to get directly from localStorage
      const stored = localStorage.getItem(`promise_${promiseId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date string back to Date object if it exists
        if (parsed.promiseDate) {
          parsed.promiseDate = new Date(parsed.promiseDate);
        }
        return parsed;
      }

      // Fallback: try to get from the promiseIdMap
      const mapStored = localStorage.getItem("promiseIdMap");
      if (mapStored) {
        const map = JSON.parse(mapStored);
        if (map[promiseId]) {
          const data = map[promiseId];
          // Convert date string back to Date object if it exists
          if (data.promiseDate) {
            data.promiseDate = new Date(data.promiseDate);
          }
          return data;
        }
      }
    } catch (error) {
      console.error("Error getting promise by ID:", error);
    }

    // If no data found, return null
    return null;
  };

  // Context value to be provided
  const value = {
    promiseInfo,
    updatePromiseInfo,
    isDatePickerOpen,
    setIsDatePickerOpen,
    generateLink,
    showLinkScreen,
    setShowLinkScreen,
    generatedLink,
    getPromiseById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
