import React, { useState } from "react";
import styled from "styled-components";
import { loginuser } from "../../stores/atoms";
import { useRecoilState } from "recoil";
import api1 from "../../utils/api1";

interface BoxDivProps {
  height: number;
}
const StyledButton = styled.button`
  outline: none;
  border: none;
  border-radius: 15px;
  // color: white;
  font-weight: bold;
  padding-left: 1rem;
  padding-right: 1rem;
  z-index: 1;

  height: 2.2rem;
  width: 5rem;
  background: #c6d5ff;
`;
const BoxDiv = styled.div<BoxDivProps>`
  margin-right: 5%;
  border-radius: 20px;
  background-color: #6e96ff;
  width: 90%;
  position: absolute;
  height: ${(props) => props.height}%;
  border: none;
  left: 5%;
  top: 40%;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border: solid 2px #fff;
  z-index: 100;
`;

interface MessageBoxProps {
  height: number;
  text: string;
  onConfirm: (value: string) => void;
}

const MessageBox = (props: MessageBoxProps) => {
  const [userData, setUserData] = useRecoilState(loginuser);

  const [value, setValue] = useState<string>("");
  const { height, text } = props;
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const friendPush = async () => {
    // console.log(deviceToken);
    try {
      const response = await api1.post(
        `/sshh/friends/${userData.studentId}/friend/${value}`
      );
      console.log(response);
    } catch (error) {
      // 에러 처리 부분 추가 필요.
      console.error(error);
    }
  };
  const handleClick = () => {
    console.log(value);
    friendPush();
    // 친구추가 로직 추가
    props.onConfirm(value);
  };
  return (
    <div>
      <BoxDiv height={height}>
        <p>{text}</p>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}

          //   placeholder="학번"
        />
        <StyledButton onClick={handleClick}>확인</StyledButton>
      </BoxDiv>
    </div>
  );
};

export default MessageBox;
