import { useLocation, useNavigate } from "react-router-dom";
import { CustomButton } from "../components/common/CustomButton";
import { InputField } from "../components/common/InputField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ChildUrl = () => {
    const location = useLocation();
    const childId = location.state?.childId;
    const Navigate = useNavigate();

    const handleClick = () => {
        Navigate("/top");
    };

    const handleCopyUrl = () => {
        navigator.clipboard
            .writeText(childSignupUrl)
            .then(() => toast.success("コピーしました"))
            .catch(() => toast.error("コピーに失敗しました"));
    };

    if (!childId) {
        return <p>子供IDがありません</p>;
    }

    const childSignupUrl = `${window.location.origin}/child/login/${childId}`;

    return (
        <div className="bg-[#FFF877] min-h-screen w-screen"
            style={{
                backgroundImage: "url('/images/back.png')",
                backgroundSize: "cover",      
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }} 
        >
            <ToastContainer />
            <h1 className="text-6xl font-bold text-center w-full py-25">ログイン用URL</h1>
            <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-2xl font-bold text-center">URLをコピーして</p>
                <p className="text-2xl font-bold text-center">お子様の端末ログインしてください。</p>
                <div className="flex items-center justify-center my-6 space-x-3">
                    <InputField
                        type="text"
                        placeholder=""
                        value={childSignupUrl}
                        readOnly
                        className="w-[500px] h-12 px-4 border rounded-lg bg-gray-100 text-base"
                    />
                    <CustomButton
                        type="button"
                        label="コピー"
                        onClick={handleCopyUrl}
                        className="w-30 h-12 px-4 text-2xl border rounded-lg bg-orange-300 hover:bg-orange-200
                        text-black font-bold"
                    />
                </div>

                <CustomButton
                    type="button"
                    label="完了"
                    onClick={handleClick}
                    className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
              transition-colors duration-300 mt-4"
                />
            </div>
        </div>
    );
};
