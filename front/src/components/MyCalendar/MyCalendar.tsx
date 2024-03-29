import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MyCalendar.css";
import { formatCurrency } from "../common/formatCurrency";
interface DateWiseConsumption {
  [date: string]: {
    [content: string]: number;
  };
}

interface MyCalendarProps {
  dateWiseConsumption: DateWiseConsumption;
}

const MyCalendar: React.FC<MyCalendarProps> = ({ dateWiseConsumption }) => {
  const [value, setValue] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");

  const onClickDay = (date: Date): void => {
    setValue(date);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset)
      .toISOString()
      .split("T")[0];
    setSelectedDate(localISOTime); // 선택된 날짜를 yyyy-mm-dd 형식으로 저장
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    // month view에서만 총 소비 금액을 표시합니다.
    if (view !== "month") return null;

    const offset = date.getTimezoneOffset() * 60000;
    const dateString = new Date(date.getTime() - offset)
      .toISOString()
      .split("T")[0];

    if (!dateWiseConsumption[dateString]) return null;

    // 해당 날짜의 총 소비 금액을 계산합니다.
    const totalSpent = Object.values(dateWiseConsumption[dateString]).reduce(
      (a, b) => a + b,
      0
    );

    return (
      <p style={{ fontSize: "10px", margin: "0", padding: "0", color: "red" }}>
        -{formatCurrency(totalSpent)}
      </p>
    );
  };

  return (
    <div className="MyCalendarWrapper">
      <div className="MyCalendar">
        <h2>나의 소비 달력</h2>
        {/* 스타일링 클래스 적용 */}
        <Calendar
          className="my-calendar"
          onClickDay={onClickDay}
          value={value}
          tileContent={tileContent}
        />
      </div>
      {/* 선택된 날짜의 소비 내역을 보여줍니다. */}
      {selectedDate && dateWiseConsumption[selectedDate] && (
        <div className="MyCalendarContent">
          <h2>{selectedDate}</h2>
          <div className="scrollableTable">
            <table>
              <thead>
                <tr>
                  <th>내역</th>
                  <th>금액</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dateWiseConsumption[selectedDate]).map(
                  ([content, pay]) => (
                    <tr key={content}>
                      <td>{content}</td>
                      <td>{formatCurrency(pay)}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
