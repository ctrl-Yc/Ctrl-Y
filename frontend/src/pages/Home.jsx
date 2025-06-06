import { CustomButton } from "../components/ui/CustomButton"
import { InputField } from "../components/ui/InputField"

export const Home = () => {
  const handleClick = () => {
    console.log('ボタンが押されました');
  }
  return (
     <div>
      <h1>ホーム画面</h1>
      <InputField placeholder="名前を入力" />
      <CustomButton label="送信" onClick={handleClick} />
    </div>
  )
}
