import { useLocation, useNavigate } from 'react-router-dom';
import { CustomButton } from '../components/common/CustomButton';

export const ChildUrl = () => {
  const location = useLocation();
  const childId = location.state?.childId;
  const Navigate = useNavigate();

  const handleClick = () => {
    Navigate('/')
  }

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
      <CustomButton
        type="button"
        label="ホーム"
        onClick={handleClick}
        className="w-30 h-10 px-4 text-3xl border rounded-lg bg-orange-100 hover:bg-orange-200
                  text-black font-bold"
      />
    </div>
  );
};
