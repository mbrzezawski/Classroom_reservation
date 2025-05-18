import InputTextBox from "../../utils/input-textbox";
import Letter from "../../icons/letter";

const meetingHours = [
  { value: "08:00", label: "08:00 - 09:30" },
  { value: "09:45", label: "09:45 - 11:15" },
  { value: "11:30", label: "11:30 - 13:00" },
  { value: "13:15", label: "13:15 - 14:45" },
  { value: "15:00", label: "15:00 - 16:30" },
  { value: "16:45", label: "16:45 - 18:15" },
  { value: "18:30", label: "18:30 - 20:00" },
];

const ReservationForm = () => {
  return (
    <form className="flex flex-col border px-6 py-8 gap-[30px] rounded-[8px]">
      <InputTextBox
        label="Title"
        placeholder="Enter meeting title"
        icon={<Letter />}
      ></InputTextBox>
      <div className="flex flex-row gap-2">
        <input type="date" className="input" name="meetingDate" required />
        <select className="select" name="meetingHour" required>
          <option value="" disabled selected>
            Pick an hour
          </option>
          {meetingHours.map((hour) => (
            <option key={hour.value} value={hour.value}>
              {hour.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[12px]">Repeats</label>
        <select className="select" name="repeatType">
          <option value="" disabled selected>
            None
          </option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
        <legend className="fieldset-legend">Additional needs</legend>
        <label className="label">
          <input type="checkbox" className="checkbox" />
          Remember me
        </label>
        <label className="label">
          <input type="checkbox" className="checkbox" />
          Remember me
        </label>
      </fieldset>
    </form>
  );
};

export default ReservationForm;
