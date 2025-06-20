export const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className=""></span>
    </label>
  )
}