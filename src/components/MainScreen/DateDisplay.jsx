import styled from "styled-components";
import { useState, useEffect } from "react";

// Styled components for the date display
const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
`;

const DateText = styled.div`
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 17px;
  text-align: center;
  line-height: 1.765em;
`;

const DateNumber = styled.div`
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 128px;
  text-align: center;
  line-height: 0.195em;
  margin-top: 30px;
`;

function DateDisplay() {
  const [currentDate, setCurrentDate] = useState({
    month: "",
    day: "",
  });

  useEffect(() => {
    // Function to get current date in Asia/Seoul timezone
    const getSeoulDate = () => {
      // Create a date object with the current time
      const now = new Date();

      // Format the date for Korea (Seoul timezone)
      const options = {
        timeZone: "Asia/Seoul",
        month: "long",
        day: "numeric",
      };

      const formatter = new Intl.DateTimeFormat("ko-KR", options);
      const formattedDate = formatter.format(now);

      // In Korean locale, the format is typically "M월 D일"
      // We need to split this into month and day
      const dateMatch = formattedDate.match(/(\d+)월 (\d+)일/);

      if (dateMatch) {
        // Extract month and day
        const month = dateMatch[1] + "월";
        const day = dateMatch[2];
        setCurrentDate({ month, day });
      } else {
        // Fallback in case the regex doesn't match
        const parts = formattedDate.split(" ");
        setCurrentDate({
          month: parts[0] || "?월",
          day: parts[1]?.replace("일", "") || "?",
        });
      }
    };

    // Set the date immediately
    getSeoulDate();

    // Update the date every minute to keep it current
    const intervalId = setInterval(getSeoulDate, 60000);

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DateContainer>
      <DateText>
        오늘은
        <br />
        {currentDate.month}
      </DateText>
      <DateNumber>{currentDate.day}</DateNumber>
    </DateContainer>
  );
}

export default DateDisplay;
