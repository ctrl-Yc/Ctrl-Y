import { useLocation } from 'react-router-dom';

export const ChildUrl = () => {
  const location = useLocation();
  const childId = location.state?.childId;

  if (!childId) {
    return <p>子供IDがありません</p>;
  }

  const childSignupUrl = `${window.location.origin}/child/login/${childId}`;

  return (
    <div>
      <p>子供用ログインページのURL:</p>
      <a href={childSignupUrl} target="_blank" rel="noopener noreferrer">
        {childSignupUrl}
      </a>
    </div>
  );
};
