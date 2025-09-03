import { useLocation, useNavigate } from "react-router-dom";
import { CustomButton } from "../components/common/CustomButton";
import { InputField } from "../components/common/InputField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ChildUrl = () => {
  const location = useLocation();
  const childId = location.state?.childId;
  const navigate = useNavigate();

  if (!childId) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center">
        <p className="text-lg">子供IDがありません</p>
      </div>
    );
  }

  const childSignupUrl = `${window.location.origin}/child/login/${childId}`;

  const handleClick = () => {
    navigate("/top");
  };

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(childSignupUrl);
      } else {
        // フォールバック
        const area = document.createElement("textarea");
        area.value = childSignupUrl;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      toast.success("コピーしました");
    } catch {
      toast.error("コピーに失敗しました");
    }
  };

  return (
    <div
      className="
        min-h-[100svh] md:min-h-[100dvh] w-screen
        bg-[#FFF877]
        bg-[url('/images/back2.png')] md:bg-[url('/images/back.png')]
        bg-center bg-no-repeat
        [@media(min-aspect-ratio:725/1625)]:bg-cover
        [@media(max-aspect-ratio:725/1625)]:bg-contain
        flex flex-col justify-center items-center
        px-5
        pt-[calc(env(safe-area-inset-top)+16px)]
        pb-[calc(env(safe-area-inset-bottom)+16px)]
        overflow-x-hidden
      "
    >
      <ToastContainer />

      <div className="w-full max-w-[680px] flex flex-col items-center gap-10 md:gap-12">
        <h1 className="text-5xl md:text-5xl font-extrabold text-center">
          ログイン用URL
        </h1>

        <div className="flex flex-col items-center gap-2">
          <p className="text-3xl md:text-2xl font-semibold text-center leading-snug">
            URLをコピーして
          </p>
          <p className="text-3xl md:text-2xl font-semibold text-center leading-snug">
            お子様の端末にログインしてください
          </p>
        </div>

        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          <InputField
            type="text"
            value={childSignupUrl}
            readOnly
            aria-label="お子様のログイン用URL"
            className="
              w-140 md:w-120
              h-16 md:h-14
              px-4 border rounded-lg bg-gray-100
              text-xl md:text-lg
            "
          />
          <CustomButton
            type="button"
            label="コピー"
            onClick={handleCopyUrl}
            className="
              w-36 sm:w-36
              h-16 md:h-14
              px-4
              bg-orange-300 hover:bg-orange-200
              text-black text-2xl md:text-xl font-extrabold
              rounded-lg transition-colors duration-300
            "
          />
        </div>

        <CustomButton
          type="button"
          label="完了"
          onClick={handleClick}
          className="
            w-50 sm:w-50
            h-16 md:h-14
            bg-blue-500 hover:bg-blue-400
            text-black text-2xl md:text-xl font-extrabold
            rounded-lg transition-colors duration-300
          "
        />
      </div>
    </div>
  );
};
