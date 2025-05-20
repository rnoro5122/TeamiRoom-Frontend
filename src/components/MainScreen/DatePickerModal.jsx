import { useEffect, useRef } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from "../../hooks/useAppContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    width: 100%;
    font-family: "Inter", sans-serif;
    display: flex !important;
    flex-direction: row !important;
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  .react-datepicker__header {
    background-color: #f8f8f8;
  }

  .react-datepicker__day--selected {
    background-color: #000;
  }

  .react-datepicker__day:hover {
    background-color: #ddd;
  }
  /* Time container styling for side-by-side layout */
  .react-datepicker__time-container {
    width: 100px;
    border-left: 1px solid #aeaeae;
    margin-left: 0;
    float: none !important; /* Override the default float */
    height: 100%; /* Match the calendar container height */
  }

  /* Ensure time box takes appropriate width and height */
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box {
    width: 100%;
    overflow-x: hidden;
    height: calc(100% - 30px); /* Subtract header height */
  }

  /* Make time list height match calendar */
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list {
    height: 100% !important; /* Match parent height */
    padding: 0;
    max-height: 240px; /* Height of 6 weeks calendar view */
  }

  /* Make time list items more compact */
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item {
    height: 24px;
    line-height: 24px;
    padding: 0 5px !important;
    font-size: 14px;
  }

  /* Style for selected time item */
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background-color: #000;
    color: white;
  }

  /* Time list item hover effect */
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item:hover {
    background-color: #f0f0f0;
  }

  /* Time header styling */
  .react-datepicker__header--time {
    padding-top: 4px;
    padding-bottom: 4px;
    background-color: #f8f8f8;
    font-size: 14px;
  }
  /* Fix scroll */
  .react-datepicker__time-list {
    scrollbar-width: thin;
  }

  /* For Webkit browsers like Chrome/Safari */
  .react-datepicker__time-list::-webkit-scrollbar {
    width: 4px;
  }

  .react-datepicker__time-list::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 3px;
  }

  //   /* Improve month navigation arrows */
  //   .react-datepicker__navigation {
  //     top: 12px;
  //     width: 10px;
  //     height: 10px;
  //     border-width: 2px 2px 0 0; /* Thicker arrows */
  //   }

  //   .react-datepicker__navigation--previous {
  //     left: 18px;
  //   }

  //   .react-datepicker__navigation--next {
  //     right: 18px;
  //   }

  //   /* Enhance arrow appearance */
  //   .react-datepicker__navigation-icon::before {
  //     border-width: 2px 2px 0 0; /* Thicker arrows */
  //     width: 10px;
  //     height: 10px;
  //   }

  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 18px;
    text-align: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.primary ? "#000" : "#f8f8f8")};
  color: ${(props) => (props.primary ? "#fff" : "#000")};
  border: 1px solid ${(props) => (props.primary ? "#000" : "#ddd")};
  border-radius: 6px;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.primary ? "#333" : "#eaeaea")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

function DatePickerModal() {
  const {
    isDatePickerOpen,
    setIsDatePickerOpen,
    promiseInfo,
    updatePromiseInfo,
  } = useAppContext();
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    }

    if (isDatePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerOpen, setIsDatePickerOpen]);
  if (!isDatePickerOpen) return null;

  const handleDateChange = (date) => {
    updatePromiseInfo("promiseDate", date);
  };

  const handleConfirm = () => {
    setIsDatePickerOpen(false);
  };

  const handleCancel = () => {
    setIsDatePickerOpen(false);
  };

  return (
    <ModalOverlay>
      <ModalContent ref={modalRef}>
        <h3>약속 날짜와 시간 선택</h3> {/* Current date/time display */}
        {promiseInfo.promiseDate && (
          <p
            style={{
              textAlign: "center",
              margin: "0 0 10px 0",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#666",
            }}
          >
            선택된 날짜/시간:{" "}
            {promiseInfo.promiseDate.toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}{" "}
        <DatePicker
          selected={promiseInfo.promiseDate}
          onChange={handleDateChange}
          inline
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          timeCaption="시간"
          dateFormat="yyyy-MM-dd h:mm aa"
          minDate={new Date()}
          shouldCloseOnSelect={false}
          calendarClassName="custom-calendar"
          placeholderText="날짜와 시간을 선택하세요"
          fixedHeight // 캘린더 높이 고정
        />
        <ButtonGroup>
          <Button onClick={handleCancel}>취소</Button>
          <Button primary onClick={handleConfirm}>
            확인
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}

export default DatePickerModal;
