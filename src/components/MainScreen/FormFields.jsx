import styled from "styled-components";
import { useAppContext } from "../../hooks/useAppContext";

// Styled components for the form fields
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4em;
  color: #1e1e1e;
`;

const Select = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 12px 16px;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
`;

const SelectText = styled.span`
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #1e1e1e;
  flex: 1;
`;

const ChevronIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-right: 1.6px solid #1e1e1e;
    border-bottom: 1.6px solid #1e1e1e;
    transform: rotate(45deg);
    margin-top: -4px;
  }
`;

// Input field that looks like the select field
const Input = styled.input`
  display: flex;
  align-items: center;
  padding: 12px 12px 12px 16px;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  width: 100%;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #1e1e1e;

  &:focus {
    outline: none;
    border-color: #000;
  }

  &::placeholder {
    color: #1e1e1e;
  }
`;

function FormFields() {
  const { promiseInfo, updatePromiseInfo, setIsDatePickerOpen } =
    useAppContext();

  return (
    <>
      <FieldContainer>
        <Label>몇명이서 모이나요?</Label>
        <Input
          type="number"
          value={promiseInfo.numberOfPeople}
          onChange={(e) => updatePromiseInfo("numberOfPeople", e.target.value)}
          placeholder="인원 수를 입력하세요"
        />
      </FieldContainer>
      <FieldContainer>
        <Label>모임명</Label>
        <Input
          type="text"
          value={promiseInfo.promiseName}
          onChange={(e) => updatePromiseInfo("promiseName", e.target.value)}
          placeholder="모임명을 입력하세요"
        />
      </FieldContainer>{" "}
      <FieldContainer>
        <Label>날짜와 시간</Label>
        <Select onClick={() => setIsDatePickerOpen(true)}>
          <SelectText>
            {promiseInfo.promiseDate
              ? `${new Date(promiseInfo.promiseDate).toLocaleDateString(
                  "ko-KR"
                )} ${new Date(promiseInfo.promiseDate).toLocaleTimeString(
                  "ko-KR",
                  { hour: "2-digit", minute: "2-digit" }
                )}`
              : "약속날짜와 시간을 입력하세요"}
          </SelectText>
          <ChevronIcon />
        </Select>
      </FieldContainer>
    </>
  );
}

export default FormFields;
