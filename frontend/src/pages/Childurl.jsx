import { jwtDecode } from "jwt-decode";
import { getChildToken } from "../config/Token";

export const Childurl = () => {
  const childtoken = getChildToken();

  if (!childtoken) {
    return <p>ログインしてください</p>;
  }

  const decoded = jwtDecode(childtoken);
  const childUUID = decoded.user_id;

  const childSignupUrl = `${window.location.origin}/child/login/${childUUID}`;

  return (
    <div>
      <p>子供用アカウント作成ページのURL:</p>
      <a href={childSignupUrl} target="_blank" rel="noopener noreferrer">
        {childSignupUrl}
      </a>
    </div>
  );
};

