import styled from "styled-components";
import { useAppContext } from "../../hooks/useAppContext";

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
  // We could use the current date in a real app
  // For now matching the Figma design with 5월 8일
  return (
    <DateContainer>
      <DateText>
        오늘은
        <br />
        5월
      </DateText>
      <DateNumber>21</DateNumber>
    </DateContainer>
  );
}

export default DateDisplay;
