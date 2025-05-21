// API utility functions for TeamiRoom

// Base URL for API calls
const API_BASE_URL = "http://58.120.14.135:8000/api"; // Adjust this to match your backend server

/**
 * Create a new promise
 * @param {Object} promiseData - The promise data object
 * @returns {Promise} - Response from the API
 */
export const createPromise = async (promiseData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/promises/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promiseData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "약속 생성에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating promise:", error);
    throw error;
  }
};

/**
 * Submit a promise with user's preferences
 * @param {Object} submissionData - The submission data object
 * @returns {Promise} - Response from the API
 */
export const submitPromise = async (submissionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/promises/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "약속서 제출에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting promise:", error);
    throw error;
  }
};

/**
 * Get promise details by ID
 * @param {string} promiseId - The promise ID
 * @returns {Promise} - Response from the API
 */
export const getPromiseById = async (promiseId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/promises/${promiseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "약속 정보를 불러오는데 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting promise:", error);
    throw error;
  }
};

/**
 * Get promise results by ID
 * @param {string} promiseId - The promise ID
 * @returns {Promise} - Response from the API with the final coordination document if available
 */
export const getPromiseResults = async (promiseId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/promises/${promiseId}/results`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // If the response status is 404, it means the results are not available yet
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "약속 결과를 불러오는데 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting promise results:", error);
    throw error;
  }
};
