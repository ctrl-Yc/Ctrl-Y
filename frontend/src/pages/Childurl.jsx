import { jwtDecode } from "jwt-decode";
import { getToken } from "../config/Token";

export const Childurl = () => {
  const token = getToken();

  if (!token) {
    return <p>ログインしてください</p>;
  }

  const decoded = jwtDecode(token);
  const childUUID = decoded.user_id;

  const childSignupUrl = `${window.location.origin}/child/login/:childUUID${childUUID}`;

  return (
    <div>
      <p>子供用アカウント作成ページのURL:</p>
      <a href={childSignupUrl} target="_blank" rel="noopener noreferrer">
        {childSignupUrl}
      </a>
    </div>
  );
};

