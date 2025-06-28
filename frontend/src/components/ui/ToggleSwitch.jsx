export const ToggleSwitch = ({ checked, onChange, className }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer"/>
      <div className={className}></div>
    </label>
  )
}