import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext";
import { useState, useEffect } from "react";

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
  transition: color 0.3s ease;
  ${(props) => props.copied && "color: #4CAF50;"}
`;

const CopyTooltip = styled.div`
  position: absolute;
  top: -30px;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: translateY(${(props) => (props.show ? 0 : "5px")});
  transition: all 0.3s ease;
  pointer-events: none;

  &:after {
    content: "";
    position: absolute;
    bottom: -5px;
    right: 10px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgba(0, 0, 0, 0.7);
  }
`;

const CopyIcon = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.copied
      ? `
    &::before {
      content: "";
      position: absolute;
      top: 3px;
      left: 5px;
      width: 6px;
      height: 12px;
      border-bottom: 2px solid #4CAF50;
      border-right: 2px solid #4CAF50;
      transform: rotate(45deg);
    }
  `
      : `
    &::before,
    &::after {
      content: "";
      position: absolute;
      border: 1px solid #000;
      width: 14px;
      height: 18px;
      transition: all 0.3s ease;
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
  `}
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
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Extract the promise ID from the generated link
  const getPromiseId = () => {
    const urlParts = generatedLink.split("/");
    return urlParts[urlParts.length - 1];
  };

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setShowTooltip(true);
    } catch (err) {
      console.error("Failed to copy link: ", err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = generatedLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setShowTooltip(true);
    }
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
        <SubTitle>링크 공유하기</SubTitle>{" "}
        <LinkContainer>
          <LinkText copied={copied}>{generatedLink}</LinkText>
          <CopyTooltip show={showTooltip}>복사됨</CopyTooltip>
          <CopyIcon copied={copied} onClick={copyLink} />
        </LinkContainer>
        <CreateButton onClick={handleCreate}>약속서 바로 작성하기</CreateButton>
      </ModalContent>
    </ModalContainer>
  );
}

export default LinkShareScreen;
