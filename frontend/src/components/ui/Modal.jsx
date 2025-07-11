export const Modal = ({ title, isOpen, children }) => {
    if (!isOpen) return null;

  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}
