import styled from "styled-components";
import DateDisplay from "./DateDisplay";
import FormFields from "./FormFields";
import GenerateButton from "./GenerateButton";
import DatePickerModal from "./DatePickerModal";
import LinkShareScreen from "../LinkShareScreen";
import { useAppContext } from "../../context/AppContext";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 60px 20px 40px;
  background-color: #f8f8f8;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

const StatusBarPlaceholder = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #f8f8f8;
  z-index: 10;
`;

function MainScreen() {
  const { showLinkScreen } = useAppContext();

  return (
    <MainContainer>
      <StatusBarPlaceholder />
      <ContentWrapper>
        <DateDisplay />
        <FormFields />
        <GenerateButton />
      </ContentWrapper>
      <DatePickerModal />
      {showLinkScreen && <LinkShareScreen />}
    </MainContainer>
  );
}

export default MainScreen;
