import { useLocation, useNavigate } from 'react-router-dom';
import { CustomButton } from '../components/common/CustomButton';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
import { buttonStyles } from '../components/ui/Color';

export const ChildUrl = () => {
  const location = useLocation();
  const childId = location.state?.childId;
  const Navigate = useNavigate();
  const [open, setOpen] = useState(false)


  const handleCopy = () => {
    navigator.clipboard.writeText(childSignupUrl);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleClick = () => {
    Navigate('/top')
  }

  const childSignupUrl = `${window.location.origin}/child/login/${childId}`;

  return (
    <main className="flex flex-grow items-center p-15 bg-[#90CAEF] bg-[radial-gradient(circle,_#ffffff8a_1.5px,_transparent_1.5px)] bg-[length:13px_13px] overflow-y-auto h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-1 h-1/2 border-2 border-[#2980b9] items-center m-auto flex flex-col justify-center gap-4 w-2/3">
      {childId ? (
        <>
      <p className="text-2xl font-bold text-[#2c3e50]">子供用ログインページのURL</p>
      <div className="flex gap-2 rounded-lg p-2">
        <a href={childSignupUrl} target="_blank" rel="noopener noreferrer" className="text-lg border-2 border-[#5C410E] p-2 rounded-lg hover:bg-gray-100 text-blue-500 cursor-pointer">
        {childSignupUrl}
        </a>
        <CustomButton
          type="button"
          label="コピー"
          onClick={handleCopy}
          className={`${buttonStyles} w-40 px-4 text-3xl hover:bg-orange-200 font-bold cursor-pointer`}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={open}
          onClose={handleClose}
          message="URLをコピーしました"
          autoHideDuration={2000}
        />
      </div>
      </>
      ) : (
        <p className="text-gray-400 text-2xl">子供IDがありません</p>
      )}
      <CustomButton
        type="button"
        label="ホームへ行く"
        onClick={handleClick}
        className={`${buttonStyles} mt-4 h-15 px-4 text-3xl hover:bg-orange-200 font-bold`}
      />
      </div>
    </main>
  );
};
