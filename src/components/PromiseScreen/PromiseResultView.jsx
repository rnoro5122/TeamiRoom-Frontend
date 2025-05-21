import styled from "styled-components";

const ResultContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const ResultCard = styled.div`
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 20px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  }
`;

const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

const MainTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 5px;
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #000;
  }
`;

const DateTimeDisplay = styled.p`
  font-size: 16px;
  color: #666;
  margin-top: 15px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin: 25px 0 15px;
  color: #333;
`;

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 25px;
`;

const RecommendationItem = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 15px;
  background-color: #f9f9f9;
  font-size: 15px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
    transform: translateX(3px);
  }
`;

const ItemIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 14px;
  font-weight: 700;
`;

const ItemText = styled.span`
  flex: 1;
`;

const CoordinationCard = styled.div`
  padding: 20px;
  background-color: #fafafa;
  border-radius: 12px;
  border-left: 4px solid #000;
  margin-top: 30px;
`;

const CoordinationText = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
  font-family: "Inter", sans-serif;
  padding: 10px;

  p {
    margin-bottom: 15px;
  }

  h3 {
    font-size: 18px;
    margin: 15px 0 10px;
  }

  ul {
    padding-left: 20px;
    margin: 10px 0;
  }

  li {
    margin-bottom: 5px;
  }

  strong {
    font-weight: 600;
  }
`;

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Function to parse and format the coordination text with proper styling
const formatCoordinationText = (text) => {
  if (!text) return <p>조율 결과가 없습니다.</p>;

  // Replace numbered list patterns like "1. " with proper HTML structure
  const formattedText = text
    .split("\n")
    .map((line, i) => {
      // Match headers/titles (number or text followed by colon)
      if (/^(\d+\.|[가-힣\s\w]+):/.test(line)) {
        return <h3 key={i}>{line}</h3>;
      }
      // Regular line with content
      else if (line.trim()) {
        return <p key={i}>{line}</p>;
      }
      // Empty line, return nothing
      return null;
    })
    .filter((item) => item !== null);

  return <>{formattedText}</>;
};

const PromiseResultView = ({ results }) => {
  if (!results) return null;

  return (
    <ResultContainer>
      <StyledHeader>
        <MainTitle>{results.promiseName}</MainTitle>
        <DateTimeDisplay>
          약속일: {formatDate(results.promiseDate)}
        </DateTimeDisplay>
      </StyledHeader>{" "}
      <ResultCard>
        {results.finalCoordination && (
          <CoordinationCard>
            <SectionTitle>최종 약속 조율서</SectionTitle>
            <CoordinationText>
              {formatCoordinationText(results.finalCoordination)}
            </CoordinationText>
          </CoordinationCard>
        )}

        <div
          style={{
            fontSize: "12px",
            color: "#777",
            marginTop: "20px",
            textAlign: "right",
          }}
        >
          생성 시간: {formatDate(results.generatedAt)}
        </div>
      </ResultCard>
    </ResultContainer>
  );
};

export default PromiseResultView;
