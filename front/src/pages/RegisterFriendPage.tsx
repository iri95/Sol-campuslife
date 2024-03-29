import React, { useEffect, useState } from "react";
import StudentId from "../components/StudentIdPage/StudentId";
import MessageBox from "../components/RegisterFriendPage/MessageBox";
import useSendOneWon from "../hooks/useSendOneWon";
// import useFriendPush from "../hooks/useFriendPush";
import useMakeFriend from "../hooks/useMakeFriend";
import useFriendListData from "../hooks/useFriendListData";
import { useRecoilValue } from "recoil";
import { loginuser } from "../stores/atoms";
import { useNavigate } from "react-router-dom";

interface PageProps {
  text: string;
  height: number;
  onConfirm: (value: string) => void;
}

const RegisterFriendPage = () => {
  const [step, setStep] = useState(0);
  const [inputID, setInputID] = useState("");

  const userData = useRecoilValue(loginuser);

  const navigate = useNavigate();

  const { isSuccess, password, handleSendOneWon } = useSendOneWon();
  // const { handleSendAlarm } = useFriendPush();
  const { handleMakeFriend } = useMakeFriend();
  const { MyfriendStudentIds, fetchFriendList } = useFriendListData(
    userData.studentId
  );

  const registerFriend = (value: string) => {
    if (value === password) {
      handleMakeFriend(userData.studentId, Number(inputID));
      fetchFriendList();
      console.log("일치합니다. 친구가 되셨습니다.");
      alert("깐부깐부맺어졌어요");
      navigate("/main");
    }
  };

  const pages: PageProps[] = [
    {
      text: "추가할 친구의 학번을 입력해주세요",
      height: 30,
      onConfirm: async (value) => {
        setInputID(value);
        console.log(MyfriendStudentIds);
        if (MyfriendStudentIds.includes(Number(value))) {
          alert("이미 깐부깐부입니다이");
        } else if (Number(value) === userData.studentId) {
          alert("내 학번입니데이");
        } else {
          const isSuccessful = await handleSendOneWon(Number(value));
          if (isSuccessful) {
            // handleSendAlarm(userData.studentId, Number(value));
            console.log("여기몇번찍히냐~~~~");
            setStep((prevStep) => prevStep + 1);
          } else {
            alert("없는 유저입니다잉");
          }
        }
      },
    },
    {
      text: "친구에게 전송된 인증번호를 알려주세요",
      height: 40,
      onConfirm: (value) => {
        console.log(`입금자명은 ${value} 입니다.`);
        console.log("패스와드는" + password);
        console.log(value);
        registerFriend(value);
      },
    },
  ];

  return (
    <div>
      <StudentId />
      <MessageBox
        key={step}
        height={pages[step].height}
        text={pages[step].text}
        onConfirm={pages[step].onConfirm}
        // onConfirm={() => setStep(step + 1)}
      />
    </div>
  );
};

export default RegisterFriendPage;
