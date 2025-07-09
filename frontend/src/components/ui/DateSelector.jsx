import  DatePicker  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export const DateSelector = ({ selectedDate, onChange}) => {
    return (
         <div className="flex items-center space-x-4">
      <label className="text-lg font-bold">日付を選択:</label>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="yyyy/MM/dd"
        className="border px-3 py-2 rounded"
        placeholderText="日付を選んでください"
      />
    </div>
    )
}