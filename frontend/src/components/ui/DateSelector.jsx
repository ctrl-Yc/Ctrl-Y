import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";

export const DateSelector = ({ selectedDate, onChange }) => {
  return (
    <div className="flex flex-col space-y-2 w-full max-w-xs">
      <label className="text-lg font-bold text-gray-700">日付を選択</label>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          locale={ja}
          dateFormat="yyyy/MM/dd (EEE)"
          placeholderText="日付を選んでください"
          todayButton="今日"
          className="w-full border border-gray-300 rounded-lg px-10 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
    </div>
  );
};
