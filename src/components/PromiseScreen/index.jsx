import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppContext } from "../../hooks/useAppContext";
import {
  getPromiseById,
  submitPromise,
  getPromiseResults,
} from "../../utils/api";
import PromiseResultView from "./PromiseResultView";

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
  position: relative;
`;

const ResultsReadyNotification = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: ${(props) => (props.show ? "block" : "none")};
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;

const ErrorMessage = styled.div`
  width: 100%;
  text-align: center;
  padding: 40px 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  margin: 20px 0;
  border: 1px solid #ffe0e0;

  h2 {
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 22px;
    color: #e53935;
    margin-bottom: 15px;
  }

  p {
    font-family: "Inter", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #555555;
    margin-bottom: 10px;
  }
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

// Dress code slider components
const SliderContainer = styled.div`
  width: 100%;
  padding: 20px 15px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const SliderInputContainer = styled.div`
  width: 100px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 15px 10px;
`;

const SliderMarker = styled.div`
  position: absolute;
  left: 25px;
  font-size: 12px;
  font-weight: 600;
  color: #666666;
`;

const SliderValue = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  width: 50px;
  text-align: center;
  margin-bottom: 15px;
  background-color: #f0f0f0;
  border-radius: 50%;
  height: 50px;
  line-height: 50px;
  transition: transform 0.2s ease;

  &.pulse {
    animation: pulse 0.3s ease;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const SliderInput = styled.input`
  -webkit-appearance: slider-vertical;
  height: 200px;
  width: 10px;
  background: #f0f0f0;
  outline: none;
  cursor: pointer;
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  border-radius: 19px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  /* Firefox and Chromium-based browsers */
  &::-webkit-slider-runnable-track {
    width: 10px;
    height: 180px;
    cursor: pointer;
    background: #f0f0f0;
    border-radius: 5px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #000000;
    cursor: pointer;
    margin-left: -7px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  &::-moz-range-track {
    width: 10px;
    height: 180px;
    cursor: pointer;
    background: #f0f0f0;
    border-radius: 5px;
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #000000;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  /* For WebKit/Blink browsers */
  &::-webkit-slider-thumb {
    margin-top: 0px;
  }

  /* For Firefox, we need to rotate the slider using transforms */
  @-moz-document url-prefix() {
    transform: rotate(270deg);
    margin-top: 85px;
    margin-bottom: 85px;
  }
`;

const RangeDescriptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-right: 15px;
  width: 70%;
  order: -1; /* 텍스트 설명이 왼쪽에 오도록 순서 변경 */
`;

const RangeDescription = styled.div`
  display: flex;
  align-items: center;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  padding: 10px 12px;
  margin: 2px 0;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? "#f0f0f0" : "transparent")};
  transition: all 0.3s ease;
  border-left: ${(props) =>
    props.active ? "4px solid #000" : "4px solid transparent"};
  box-shadow: ${(props) =>
    props.active ? "0px 2px 6px rgba(0, 0, 0, 0.1)" : "none"};
  transform: ${(props) => (props.active ? "translateX(3px)" : "none")};
  font-weight: ${(props) => (props.active ? "500" : "400")};
`;

const RangeLabel = styled.span`
  font-weight: 700;
  margin-right: 10px;
  width: 40px;
`;

const RangeText = styled.span`
  flex: 1;
  color: ${(props) => (props.active ? "#000000" : "#555555")};
  transition: all 0.3s ease;
  font-size: ${(props) => (props.active ? "14px" : "13px")};
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
  const { promiseInfo: globalPromiseInfo } = useAppContext();
  // State for the promise info specific to this ID
  const [currentPromise, setCurrentPromise] = useState(null);
  const [promiseResults, setPromiseResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasResults, setHasResults] = useState(false);
  const [showResultsNotification, setShowResultsNotification] = useState(false);
  const [missingPromiseInfo, setMissingPromiseInfo] = useState(false);
  // State for form data
  const [formData, setFormData] = useState({
    food: "",
    activity: "",
    dressCodeLevel: "5", // Default to middle of the slider (1-10)
  }); // Load promise info and check for results when component mounts or ID changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // First, try to fetch promise results to see if a final document exists
        try {
          const results = await getPromiseResults(id);
          if (results && results.finalCoordination) {
            console.log("Final coordination document found:", results);
            setPromiseResults(results);
            setHasResults(true);
            setMissingPromiseInfo(false);
            setError(null);
            setIsLoading(false);
            return; // Exit early since we have results
          }
        } catch (err) {
          console.log(
            "No final coordination document available yet:",
            err.message
          );
          // Continue with normal promise data fetching
        }

        // If no results, fetch promise data from API
        const promiseData = await getPromiseById(id);
        console.log("Fetched promise data:", promiseData);

        // Check if we have valid promise data
        if (
          !promiseData ||
          Object.keys(promiseData).length === 0 ||
          (!promiseData.promiseName &&
            !promiseData.numberOfPeople &&
            !promiseData.promiseDate)
        ) {
          console.log("Missing promise information");
          setMissingPromiseInfo(true);
          setError(null);
          setIsLoading(false);
          return; // Exit early since we don't have valid promise data
        }

        // Format the date
        if (promiseData.promiseDate) {
          promiseData.promiseDate = new Date(promiseData.promiseDate);
        }

        setCurrentPromise(promiseData);
        setHasResults(false);
        setMissingPromiseInfo(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching promise data:", err);
        setError(`약속 정보를 불러오는데 실패했습니다: ${err.message}`);
        setMissingPromiseInfo(true);

        // Fallback to context data if API fails - disabled to show error message
        /*
        const savedPromise = localStorage.getItem(`promise_${id}`);
        if (savedPromise) {
          try {
            const parsedPromise = JSON.parse(savedPromise);
            if (parsedPromise.promiseDate) {
              parsedPromise.promiseDate = new Date(parsedPromise.promiseDate);
            }
            setCurrentPromise(parsedPromise);
            setHasResults(false);
          } catch (parseErr) {
            console.error("Error parsing saved promise:", parseErr);
            setCurrentPromise(globalPromiseInfo);
            setHasResults(false);
          }
        } else {
          setCurrentPromise(globalPromiseInfo);
          setHasResults(false);
        }
        */
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setMissingPromiseInfo(true);
      setIsLoading(false);
    }
  }, [id, globalPromiseInfo]);

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Add animation for dress code slider value change
    if (field === "dressCodeLevel") {
      const sliderValue = document.querySelector(".slider-value");
      if (sliderValue) {
        sliderValue.classList.add("pulse");
        setTimeout(() => {
          sliderValue.classList.remove("pulse");
        }, 300);
      }
    }
  }; // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.food || !formData.activity) {
      alert("모든 필드를 입력해주세요!");
      return;
    }

    // Generate dress code description based on slider value
    const getDressCodeLevelDescription = (value) => {
      const numValue = parseInt(value, 10);
      if (numValue >= 8) {
        return `꾸밈 정도 ${value}/10 - 꾸꾸: 꾸민 듯 확실하게 꾸민 스타일`;
      } else if (numValue >= 4) {
        return `꾸밈 정도 ${value}/10 - 꾸안꾸: 꾸민 듯 안 꾸민 듯 자연스러워 보이지만 실은 신경 쓴 스타일`;
      } else {
        return `꾸밈 정도 ${value}/10 - 안꾸: 전혀 꾸미지 않은, 자연 그대로의 모습`;
      }
    };

    // Prepare data in the format expected by the API
    const submissionData = {
      promiseId: id,
      promiseInfo: null, // We don't need to send this anymore since the server has it
      promiseContent: {
        food: formData.food,
        activity: formData.activity,
        dressCodeLevel: parseInt(formData.dressCodeLevel, 10), // Send integer value as required by backend
      },
    };

    // Store the description separately for local use if needed
    const dressCodeLevelDescription = getDressCodeLevelDescription(
      formData.dressCodeLevel
    );
    try {
      // Set loading state while submitting
      setIsLoading(true);

      // Log the submission data to verify its structure
      console.log("Submitting promise with data:", submissionData);

      // Use the API utility function instead of hardcoding the URL
      const result = await submitPromise(submissionData); // Save to localStorage for demo purposes
      try {
        // Add the description to the saved data for UI purposes
        const enhancedSubmissionData = {
          ...submissionData,
          promiseContent: {
            ...submissionData.promiseContent,
            dressCodeLevelDescription: dressCodeLevelDescription,
          },
        };
        localStorage.setItem(
          `promise_submission_${id}`,
          JSON.stringify(enhancedSubmissionData)
        );
      } catch (error) {
        console.error("Error saving submission:", error);
      }

      alert("약속서가 성공적으로 제출되었습니다!");
      console.log("Submission result:", result);

      // Check if all participants have submitted and if LLM has generated a result
      try {
        // Give the backend a moment to process the submission
        setTimeout(async () => {
          try {
            // Check for results after submission
            const results = await getPromiseResults(id);
            if (results && results.finalCoordination) {
              // If results are available, update state to show them
              setPromiseResults(results);
              setHasResults(true);
              // Show notification that results are ready
              setShowResultsNotification(true);
              // Hide notification after 3 seconds
              setTimeout(() => setShowResultsNotification(false), 3000);
            } else {
              // If no results yet, just refresh the promise data
              const promiseData = await getPromiseById(id);
              setCurrentPromise(promiseData);
              setHasResults(false);
            }
          } catch (err) {
            console.log(
              "No final coordination document available yet:",
              err.message
            );
          } finally {
            setIsLoading(false);
          }
        }, 1000); // 1 second delay to allow backend processing
      } catch (checkError) {
        console.error("Error checking for results:", checkError);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting promise:", error);
      alert(`제출 실패: ${error.message}`);
      setIsLoading(false);
    }
  };
  return (
    <PromiseContainer>
      <ContentWrapper>
        {/* Results ready notification */}
        <ResultsReadyNotification show={showResultsNotification}>
          최종 약속 조율서가 생성되었습니다!
        </ResultsReadyNotification>

        {/* Loading state */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ fontSize: "16px", fontFamily: "Inter, sans-serif" }}>
              약속 정보를 불러오는 중...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
            <p style={{ fontSize: "16px", fontFamily: "Inter, sans-serif" }}>
              {error}
            </p>
          </div>
        )}

        {/* Missing Promise Info - Show error message instead of form */}
        {!isLoading && missingPromiseInfo && (
          <ErrorMessage>
            <h2>약속 정보를 찾을 수 없습니다</h2>
            <p>URL을 다시 확인해주세요.</p>
            <p>올바른 약속 ID를 사용하고 계신지 확인해주시기 바랍니다.</p>
          </ErrorMessage>
        )}

        {/* Show results if available */}
        {!isLoading && hasResults && !missingPromiseInfo && (
          <PromiseResultView results={promiseResults} />
        )}

        {/* Show form only if we have promise info */}
        {!isLoading && !hasResults && !missingPromiseInfo && (
          <>
            <Title>약속서 작성</Title>
            {/* 약속 정보 카드 */}
            <PromiseInfoCard>
              <PromiseInfoTitle>약속 정보</PromiseInfoTitle>
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
                {currentPromise?.createdAt && (
                  <InfoRow>
                    <InfoLabel>생성 일시</InfoLabel>
                    <InfoValue isEmpty={!currentPromise?.createdAt}>
                      {formatDate(currentPromise?.createdAt)}
                    </InfoValue>
                  </InfoRow>
                )}
                {currentPromise?.submissions && (
                  <InfoRow>
                    <InfoLabel>제출 현황</InfoLabel>
                    <InfoValue isEmpty={!currentPromise?.submissions}>
                      {currentPromise?.submissions?.length || 0}명 제출 완료
                    </InfoValue>
                  </InfoRow>
                )}
              </PromiseInfoContent>
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
                  value={formData.food}
                  onChange={(e) => handleChange("food", e.target.value)}
                  placeholder="음식 취향이나 먹고 싶은 메뉴를 적어주세요."
                />
              </AnswerBox>
            </QuestionSection>
            <QuestionSection>
              <Question>오늘은 어떤 걸 하면서 즐기고 싶으세요?</Question>
              <AnswerBox>
                <TextArea
                  value={formData.activity}
                  onChange={(e) => handleChange("activity", e.target.value)}
                  placeholder="하고 싶은 활동이나 원하는 분위기를 적어주세요."
                />
              </AnswerBox>
            </QuestionSection>{" "}
            <QuestionSection>
              <Question>오늘의 꾸밈 정도는?</Question>{" "}
              <SliderContainer>
                {" "}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "10px",
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: "600",
                    padding: "5px 10px",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "5px",
                    width: "fit-content",
                  }}
                >
                  슬라이더를 움직여 선택하세요
                </div>
                <SliderWrapper>
                  <RangeDescriptions>
                    <RangeDescription active={formData.dressCodeLevel >= 8}>
                      <RangeLabel>8-10</RangeLabel>
                      <RangeText active={formData.dressCodeLevel >= 8}>
                        꾸꾸: 꾸민 듯 확실하게 꾸민 스타일
                      </RangeText>
                    </RangeDescription>
                    <RangeDescription
                      active={
                        formData.dressCodeLevel >= 4 &&
                        formData.dressCodeLevel < 8
                      }
                    >
                      <RangeLabel>4-7</RangeLabel>
                      <RangeText
                        active={
                          formData.dressCodeLevel >= 4 &&
                          formData.dressCodeLevel < 8
                        }
                      >
                        꾸안꾸: 꾸민 듯 안 꾸민 듯 자연스러워 보이지만 실은 신경
                        쓴 스타일
                      </RangeText>
                    </RangeDescription>
                    <RangeDescription active={formData.dressCodeLevel < 4}>
                      <RangeLabel>1-3</RangeLabel>
                      <RangeText active={formData.dressCodeLevel < 4}>
                        안꾸: 전혀 꾸미지 않은, 자연의 모습
                      </RangeText>
                    </RangeDescription>
                  </RangeDescriptions>{" "}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "120px",
                    }}
                  >
                    <SliderValue className="slider-value">
                      {formData.dressCodeLevel || 5}
                    </SliderValue>
                    <SliderInputContainer>
                      <SliderInput
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={formData.dressCodeLevel || 5}
                        onChange={(e) =>
                          handleChange("dressCodeLevel", e.target.value)
                        }
                        orient="vertical"
                      />
                    </SliderInputContainer>
                  </div>
                </SliderWrapper>
              </SliderContainer>
            </QuestionSection>
            <SubmitButton onClick={handleSubmit}>약속서 제출하기</SubmitButton>
          </>
        )}
      </ContentWrapper>
    </PromiseContainer>
  );
};

export default PromiseScreen;
