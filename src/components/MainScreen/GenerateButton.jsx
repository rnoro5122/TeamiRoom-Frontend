import styled from "styled-components";
import { useAppContext } from "../../context/AppContext";

const ButtonContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  max-width: 400px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 15px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 17px;
  line-height: 1.294em;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #222;
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  }
`;

function GenerateButton() {
  const { generateLink, promiseInfo } = useAppContext();

  const handleClick = () => {
    if (
      !promiseInfo.numberOfPeople ||
      !promiseInfo.promiseName ||
      !promiseInfo.promiseDate
    ) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    generateLink();
    // The Link display screen is now shown by setting showLinkScreen to true in the context
  };

  return (
    <ButtonContainer>
      <Button onClick={handleClick}>링크 생성하기</Button>
    </ButtonContainer>
  );
}

export default GenerateButton;
