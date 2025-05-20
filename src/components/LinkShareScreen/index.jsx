import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  width: 90%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1001;
`;

const Title = styled.h2`
  font-family: "Roboto", sans-serif;
  font-weight: 800;
  font-size: 15px;
  line-height: 1.333em;
  letter-spacing: 0.25px;
  color: #1e1e1e;
  text-align: center;
  margin-bottom: 25px;
`;

const SubTitle = styled.p`
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.429em;
  letter-spacing: 0.25px;
  color: #1e1e1e;
  margin-bottom: 20px;
`;

const LinkContainer = styled.div`
  width: 100%;
  padding: 15px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
`;

const LinkText = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: #1e1e1e;
  flex-grow: 1;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 30px;
`;

const CopyIcon = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 15px;
  cursor: pointer;

  &::before,
  &::after {
    content: "";
    position: absolute;
    border: 1px solid #000;
    width: 14px;
    height: 18px;
  }

  &::before {
    top: 0;
    left: 0;
    background-color: white;
  }

  &::after {
    top: 4px;
    left: 4px;
    background-color: white;
    z-index: -1;
  }
`;

const CreateButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 17px;
  text-align: center;
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

function LinkShareScreen() {
  const { generatedLink, setShowLinkScreen } = useAppContext();
  const navigate = useNavigate();

  // Extract the promise ID from the generated link
  const getPromiseId = () => {
    const urlParts = generatedLink.split("/");
    return urlParts[urlParts.length - 1];
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("링크가 복사되었습니다!");
  };

  const handleCreate = () => {
    const promiseId = getPromiseId();
    setShowLinkScreen(false);
    navigate(`/promise/${promiseId}`);
  };

  return (
    <ModalContainer>
      <ModalBackground onClick={() => setShowLinkScreen(false)} />
      <ModalContent>
        <Title>
          약속서 링크생성이 <br />
          완료되었습니다!
        </Title>
        <SubTitle>링크 공유하기</SubTitle>
        <LinkContainer>
          <LinkText>{generatedLink}</LinkText>
          <CopyIcon onClick={copyLink} />
        </LinkContainer>
        <CreateButton onClick={handleCreate}>약속서 바로 작성하기</CreateButton>
      </ModalContent>
    </ModalContainer>
  );
}

export default LinkShareScreen;
