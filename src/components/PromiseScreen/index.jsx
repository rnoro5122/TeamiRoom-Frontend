import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppContext } from "../../hooks/useAppContext";

// Styled components for the promise screen
const PromiseContainer = styled.div`
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

const PromiseInfoCard = styled.div`
  width: 100%;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const PromiseInfoTitle = styled.h2`
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 22px;
  margin-bottom: 20px;
  color: #000000;
  text-align: center;
  position: relative;

  &:after {
    content: "";
    display: block;
    width: 40px;
    height: 3px;
    background-color: #000;
    margin: 10px auto 0;
  }
`;

const PromiseInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Inter", sans-serif;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: #555555;
`;

const InfoValue = styled.span`
  font-weight: 500;
  font-size: 15px;
  color: #000000;
  background-color: ${(props) => (props.isEmpty ? "#f8f8f8" : "transparent")};
  padding: ${(props) => (props.isEmpty ? "2px 8px" : "0")};
  border-radius: ${(props) => (props.isEmpty ? "4px" : "0")};
`;

const Title = styled.h1`
  font-family: "Inter", sans-serif;
  font-weight: 900;
  font-size: 40px;
  text-align: center;
  margin-bottom: 40px;
  color: #000000;
`;

const QuestionSection = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

const Question = styled.h2`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  margin-bottom: 15px;
  color: #000000;
`;

const AnswerBox = styled.div`
  width: 100%;
  min-height: 100px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.25);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: none;
  outline: none;
  background: transparent;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  resize: none;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 30px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 17px;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: transform 0.1s, box-shadow 0.1s;

  &:active {
    transform: translateY(2px);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  }
`;

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const PromiseScreen = () => {
  // Get the promise ID from the URL
  const { id } = useParams();

  // Get promise info and functions from context
  const { promiseInfo: globalPromiseInfo, getPromiseById } = useAppContext();

  // State for the promise info specific to this ID
  const [currentPromise, setCurrentPromise] = useState(null);

  // Load promise info when component mounts or ID changes
  useEffect(() => {
    // First try to get specific promise data by ID
    const savedPromise = getPromiseById(id);

    if (savedPromise) {
      setCurrentPromise(savedPromise);
    } else {
      // Fallback to global promise info if no specific data found
      setCurrentPromise(globalPromiseInfo);
    }
  }, [id, getPromiseById, globalPromiseInfo]);

  // State for form data
  const [formData, setFormData] = useState({
    foodPreference: "",
    activityPreference: "",
    dressCodeLevel: "",
  });

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }; // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.foodPreference ||
      !formData.activityPreference ||
      !formData.dressCodeLevel
    ) {
      alert("모든 필드를 입력해주세요!");
      return;
    }

    // Prepare data in the format expected by the API
    const submissionData = {
      promiseId: id,
      promiseInfo: currentPromise,
      promiseContent: {
        food: formData.foodPreference,
        activity: formData.activityPreference,
        dressCode: formData.dressCodeLevel,
      },
    };

    try {
      const response = await fetch(
        "http://localhost:8000/api/promises/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "약속서 제출에 실패했습니다.");
      }

      const result = await response.json();

      alert("약속서가 성공적으로 제출되었습니다!");
      console.log("Submission result:", result);

      // Save to localStorage for demo purposes
      try {
        localStorage.setItem(
          `promise_submission_${id}`,
          JSON.stringify(submissionData)
        );
      } catch (error) {
        console.error("Error saving submission:", error);
      }
    } catch (error) {
      console.error("Error submitting promise:", error);
      alert(`제출 실패: ${error.message}`);
    }
  };
  return (
    <PromiseContainer>
      <ContentWrapper>
        <Title>약속서 작성</Title>
        {/* 약속 정보 카드 */}
        <PromiseInfoCard>
          <PromiseInfoTitle>약속 정보</PromiseInfoTitle>
          {!currentPromise ||
          (!currentPromise.promiseName &&
            !currentPromise.numberOfPeople &&
            !currentPromise.promiseDate) ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                color: "#888",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              <p>아직 약속 정보가 없습니다.</p>
              <p>메인 페이지에서 약속 정보를 먼저 입력해주세요.</p>
            </div>
          ) : (
            <PromiseInfoContent>
              <InfoRow>
                <InfoLabel>약속명</InfoLabel>
                <InfoValue isEmpty={!currentPromise?.promiseName}>
                  {currentPromise?.promiseName || "정보 없음"}
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>인원 수</InfoLabel>
                <InfoValue isEmpty={!currentPromise?.numberOfPeople}>
                  {currentPromise?.numberOfPeople
                    ? `${currentPromise.numberOfPeople} 명`
                    : "정보 없음"}
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>날짜 및 시간</InfoLabel>
                <InfoValue isEmpty={!currentPromise?.promiseDate}>
                  {formatDate(currentPromise?.promiseDate) !== "-"
                    ? formatDate(currentPromise?.promiseDate)
                    : "정보 없음"}
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>약속 ID</InfoLabel>
                <InfoValue isEmpty={!id}>{id || "정보 없음"}</InfoValue>
              </InfoRow>
            </PromiseInfoContent>
          )}
        </PromiseInfoCard>

        <div style={{ width: "100%", marginBottom: "30px" }}>
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "22px",
              textAlign: "center",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            약속서 질문
            <span
              style={{
                display: "block",
                width: "40px",
                height: "3px",
                backgroundColor: "#000",
                margin: "10px auto 0",
              }}
            ></span>
          </h2>
        </div>

        <QuestionSection>
          <Question>오늘은 어떤 메뉴가 마음에 끌리시나요?</Question>
          <AnswerBox>
            <TextArea
              value={formData.foodPreference}
              onChange={(e) => handleChange("foodPreference", e.target.value)}
              placeholder="음식 취향이나 먹고 싶은 메뉴를 적어주세요."
            />
          </AnswerBox>
        </QuestionSection>

        <QuestionSection>
          <Question>오늘은 어떤 걸 하면서 즐기고 싶으세요?</Question>
          <AnswerBox>
            <TextArea
              value={formData.activityPreference}
              onChange={(e) =>
                handleChange("activityPreference", e.target.value)
              }
              placeholder="하고 싶은 활동이나 원하는 분위기를 적어주세요."
            />
          </AnswerBox>
        </QuestionSection>

        <QuestionSection>
          <Question>오늘의 꾸밈 정도는?</Question>
          <AnswerBox>
            <TextArea
              value={formData.dressCodeLevel}
              onChange={(e) => handleChange("dressCodeLevel", e.target.value)}
              placeholder="원하는 드레스 코드나 꾸밈 정도를 적어주세요."
            />
          </AnswerBox>
        </QuestionSection>

        <SubmitButton onClick={handleSubmit}>약속서 제출하기</SubmitButton>
      </ContentWrapper>
    </PromiseContainer>
  );
};

export default PromiseScreen;
