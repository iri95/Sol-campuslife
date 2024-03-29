import StudentId from "../components/StudentIdPage/StudentId";
import api1 from "../utils/api1";

//####### get 요청###############
//전체 거래로그 조회
export const getAllConsumeData = () => api1.get("/sshh/history");
//단일 거래로그 조회
export const getMyConsumeData = (studentId: Number) =>
  api1.get(`/sshh/history/${studentId}`);
// 거래로그 통계
export const getTransactionLogStatics = () => api1.get("/sshh/history/data");
// 거래로그 총합,총수,평균
export const getTransactionLogSum = () => api1.get("/sshh/history/summary");
// 나와 전체 소비 평균 한달
export const getMyConsumeDataSummary = (studentId: Number) =>
  api1.get(`/sshh/history/${studentId}/summary`);
// 친구 학생증 목록 조회
export const getFriendList = (studentId: Number) =>
  api1.get(`/sshh/friends/${studentId}`);
//친구 추가 인증 알림푸쉬에 쓸거
export const getFriendAuth = (studentId: Number, friendId: Number) =>
  api1.get(`/sshh/friends/${studentId}/certify/${friendId}`);
//친구들 카테고리 조회
export const getFriendsCategoryList = (studentId: Number) =>
  api1.get(`/sshh/category/${studentId}`);

// 더치페이 조회
export const getDutchPay = (studentId: Number) =>
  api1.get(`/sshh/remittance/${studentId}/dutch`);
// 더치페이 상세조회
export const getDutchPayDetail = (studentId: Number, dutchId: Number) =>
  api1.get(`/sshh/remittance/${studentId}/dutch/${dutchId}`);

// 요청받은 더치페이 조회

export const getReceiveDutchPayDetail = (studentId: Number) =>
  api1.get(`/sshh/remittance/${studentId}/dutchDetail`);

// 내 잔액 조회
export const getMyMoney = (studentId: Number) =>
  api1.get(`/sshh/login/${studentId}/balance`);

//####### post 요청##################
//로그인
export const postLogin = (studentId: string, password: string) =>
  api1.post("/sshh/login", { studentId, password });
// 더치페이 신청(요청하는거)
export const postDutchPay = (
  studentId: Number,
  friendList: Array<Number>,
  amount: Number
) =>
  api1.post(`/sshh/remittance/${studentId}/consent`, {
    friendList,
    amount,
  });
// 카테고리 추가
export const postAddCategory = (studentId: Number, categoryName: String) =>
  api1.post(`/sshh/category/${studentId}`, { categoryName });

// 친구 학생증 저장

export const postMakeFriend = (studentId: Number, friendId: Number) =>
  api1.post(`/sshh/friends/${studentId}/store/${friendId}`);
//친구 푸쉬알림
export const postMakeFriendAlarm = (studentId: Number, friendId: Number) =>
  api1.post(`/sshh/push/${studentId}/friend/${friendId}`);

//신한 위취알림!.
export const postShinhanLocation = (cityName: String) =>
  api1.post(`/sshh/branch/list`, {
    dataHeader: {
      apikey: "2023_Shinhan_SSAFY_Hackathon",
    },
    dataBody: {
      serviceCode: "T0508",
      시도명: cityName,
    },
  });

//####### put 요청#####################
// 1원이체
export const putSendOneWon = (studentId: Number) =>
  api1.put(`/sshh/remittance/${studentId}/won1`);
// 송금
export const putRemittance = (
  studentId: Number,
  friendId: Number,
  amount: Number,
  content: String
) =>
  api1.put(`/sshh/remittance/${studentId}/send/${friendId}`, {
    amount,
    content,
  });

// 더치페이 알림오면 보내는거
export const putDutchPay = (
  studentId: Number,
  friendId: Number,
  dutchId: String,
  dutchAmount: String
) =>
  api1.put(`/sshh/remittance/${studentId}/dutch/${friendId}`, {
    dutchAmount,
    dutchId,
  });

// 친구 학생증 카테고리 변경
export const putFriendCategory = (
  studentId: Number,
  friendId: Number,
  categoryId: Number
) => api1.put(`/sshh/friends/${studentId}/update/${friendId}`, { categoryId });

// 카테고리 이름 변경
export const putCategoryName = (
  studentId: Number,
  categoryId: Number,
  category: String
) => api1.put(`/sshh/category/${studentId}`, { categoryId, category });

//############ DEl 요청################
// 친구학생증 삭제

export const delFriend = (studentId: Number, friendId: Number) =>
  api1.delete(`/sshh/friends/${studentId}/delete/${friendId}`);

//카테고리 삭제
export const delCategory = (studentId: Number, categoryId: Number) =>
  api1.delete(`/sshh/category/${studentId}/${categoryId}`);
