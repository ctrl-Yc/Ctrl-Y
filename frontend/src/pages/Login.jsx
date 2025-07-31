import { useEffect, useState } from 'react';
import { CustomButton } from '../components/common/CustomButton';
import Snackbar from '@mui/material/Snackbar';
import { buttonStyles } from '../components/ui/Color';
import { InputField } from "../components/common/InputField"
import { Link, useNavigate } from "react-router-dom"
import { setToken } from "../config/Token";
import axios from "axios";
import { PARENT_LOGIN } from "../config/api";

export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const [snackInfo, setSnackInfo] = useState({
		open: false,
		message: '',
	});


	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			navigate('./top');
		}
	}, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('入力エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }
    try {
      const response = await axios.post(PARENT_LOGIN,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-type': 'application/json'
          },
        }
      );
      const Token = response.data.token;
      setToken(Token);
      navigate('./top', { state: { token: setToken(Token) } });
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

	const handleEnter = (e) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	const handleClose = () => {
		setSnackInfo({
			open: false,
			message: '',
		});
	};

	return (
		<div className="flex items-center justify-center p-15 bg-[#90CAEF] bg-[radial-gradient(circle,_#ffffff8a_1.5px,_transparent_1.5px)] bg-[length:13px_13px] overflow-y-auto h-screen">
			<main className="bg-white w-[1000px] rounded-2xl shadow-lg p-1 h-full border-2 border-[#2980b9]">
				<h1 className="text-6xl font-bold text-center py-30 text-[#2980b9]">ログイン</h1>
				<form>
					<div className="flex flex-col items-center justify-center space-y-4">
						<InputField
							type="email"
							placeholder="メールアドレスを入力"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mb-12 w-200 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
							onKeyDown={handleEnter}
						/>
						<InputField
							type="password"
							placeholder="パスワードを入力"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mb-12 w-200 h-15 px-4 py-2 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
							onKeyDown={handleEnter}
						/>
					</div>
					<CustomButton
						type="button"
						label="ログイン"
						onClick={handleLogin}
						className={`${buttonStyles} w-50 h-15  text-white text-2xl font-extrabold rounded-lg hover:bg-orange-300
             transition-colors duration-300 mx-auto flex items-center justify-center mt-4`}
					/>
					<p className="flex items-center justify-center my-8 text-2xl">
						<Link
							to="./resetRequest"
							className="text-blue-600 underline ml-2 hover:text-blue-400 duration-300"
						>
							パスワードリセット
						</Link>
					</p>
					<p className="flex items-center justify-center my-8 text-2xl">
						アカウントを持っていない場合は
						<Link
							to="./Signup"
							className="text-blue-600 underline ml-2 hover:text-blue-400 duration-300"
						>
							こちら
						</Link>
					</p>
				</form>
			</main>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				open={snackInfo.open}
				onClose={handleClose}
				message={snackInfo.message}
				autoHideDuration={2000}
			/>
		</div>
	);
};
