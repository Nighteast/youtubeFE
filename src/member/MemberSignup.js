import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  defaultLength,
  defaultMessage,
  defaultPatterns,
  englishAndNumberOnly,
  validatePassword,
  validateEmail,
} from "./memberUtil/memberSignUpMethods";
import { DetectLoginContext } from "../component/LoginProvider";

function MemberSignup(props) {
  /* 회원 상태---------------------------------------------------------------------------------- */
  const [member_id, setMember_id] = useState("");
  const [password, setPassword] = useState("");
  const [password_check, setPassword_check] = useState("");
  const [gender, setGender] = useState("m");
  const [birth_date, setBirth_date] = useState(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  /* ID 검증---------------------------------------------------------------------------------- */

  const [checkIdResult, setCheckIdResult] = useState(false); // 중복 체크 결과
  const [idMessage, setIdMessage] = useState(defaultMessage);
  const [idDisable, setIdDisable] = useState(false); // 중복 체크 후 비활성화
  /* 닉네임 검증 ----------------------------------------------------------------------------------*/
  const [checkNicknameResult, setCheckNicknameResult] = useState(false); // 중복 체크 결과
  const [nicknameMessage, setNicknameMessage] = useState(defaultMessage);
  const [nickNameDisable, setNickNameDisable] = useState(false); // 중복 체크 후 비활성화
  /* 이메일 검증 ----------------------------------------------------------------------------------*/

  const [checkEmailResult, setCheckEmailResult] = useState(false); // 중복 체크 결과
  const [emailMessage, setEmailMessage] = useState(defaultMessage);
  const [emailDisable, setEmailDisable] = useState(false); // 중복 체크 후 비활성화

  /* 비밀번호 관련 메세지 ----------------------------------------------------------------------------------*/
  const [passwordTypeResult, setPasswordTypeResult] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(defaultMessage);
  const [passwordCheckMessage, setPasswordCheckMessage] =
    useState("비밀번호가 일치하지 않습니다");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(null);
  const { loginInfo } = useContext(DetectLoginContext);

  const submitAvailable =
    checkIdResult &&
    checkNicknameResult &&
    true &&
    passwordTypeResult &&
    birth_date !== null;

  /* ChakraUI*/
  const toast = useToast();
  const navigate = useNavigate();
  if (loginInfo !== null) {
    navigate("/");
    toast({
      description: "로그아웃 후 이용 바랍니다.",
      status: "error",
    });
  }
  /* 회원 가입 요청 ----------------------------------------------------------------------------------*/
  function handleSignupForm() {
    setIsSubmitting(true);
    axios
      .post("/api/signup", {
        member_id,
        password,
        gender,
        birth_date,
        nickname,
        email,
      })
      .then(() => {
        toast({
          description: "회원가입이 완료되었습니다",
          status: "success",
        });
        navigate("/member/login");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            position: "top",
            description: "가입 정보를 확인해주세요",
            status: "warning",
          });
        } else {
          toast({
            position: "top",
            description: "서버에 오류가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(setIsSubmitting(false));
  }

  /* 중복 체크 메서드 ----------------------------------------------------------------------------------*/
  function handleDuplicated(itemName, item) {
    setIsSubmitting(true);
    const params = new URLSearchParams();
    params.set(itemName, item);
    axios
      .get("/api/signup/check?" + params)
      .then((response) => {
        const result = response.data;
        toast({
          position: "top",
          description: result,
          status: "success",
        });
        if (itemName === "member_id") {
          setCheckIdResult(true);
          setIdDisable(false);
        }
        if (itemName === "nickname") {
          setCheckNicknameResult(true);
          setNickNameDisable(false);
        }
        if (itemName === "email") {
          setCheckEmailResult(true);
          setEmailDisable(false);
        }
      })
      .catch((error) => {
        const result = error.response.data;
        toast({
          position: "top",
          description: result,
          status: "warning",
        });
        if (itemName === "member_id") {
          setCheckIdResult(false);
          setIdMessage(result);
        }
        if (itemName === "nickname") {
          setCheckNicknameResult(false);
          setNicknameMessage(result);
        }
        if (itemName === "email") {
          setCheckEmailResult(false);
          setEmailMessage(result);
        }
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <>
      <Center>
        <Card
          w={"40%"}
          align={"center"}
          border={"10px"}
          mt={"30px"}
          mb={"30px"}
          minWidth={"600px"}
        >
          <CardHeader mt={5}>
            <Heading>사용자 가입</Heading>
          </CardHeader>
          <CardBody>
            {/* 아이디 폼  ---------------------------------------------------------------------------------- */}
            <Box>
              <FormControl
                mt={4}
                isRequired
                isInvalid={
                  member_id.length === 0
                    ? false
                    : englishAndNumberOnly(member_id)
                      ? true
                      : !checkIdResult
                }
              >
                <FormLabel ml={"100px"}>아이디</FormLabel>
                <Flex>
                  <Input
                    ml={"100px"}
                    w={"2xs"}
                    placeholder="아이디 입력 (6~40자)"
                    value={member_id}
                    maxLength={"40"}
                    onChange={(e) => {
                      if (!e.target.value.includes(" ")) {
                        setCheckIdResult(false);
                        setIdDisable(true);
                        setMember_id(e.target.value);
                        setIdMessage("6" + defaultLength);
                        if (e.target.value.length > 5) {
                          setIdMessage(defaultMessage);
                        }
                        if (englishAndNumberOnly(member_id)) {
                          setIdMessage(defaultPatterns);
                        }
                      }
                    }}
                  />
                  {!isSubmitting ? (
                    <Button
                      isDisabled={
                        member_id.length < 6 ||
                        englishAndNumberOnly(member_id) ||
                        !idDisable
                      }
                      colorScheme="blue"
                      onClick={() => {
                        handleDuplicated("member_id", member_id);
                      }}
                    >
                      중복확인
                    </Button>
                  ) : (
                    <Spinner />
                  )}
                </Flex>
                <FormErrorMessage ml={"100px"}>{idMessage}</FormErrorMessage>
              </FormControl>
            </Box>
            {/* 닉네임 폼 ---------------------------------------------------------------------------------- */}
            <FormControl
              mt={4}
              isRequired
              isInvalid={nickname.length === 0 ? false : !checkNicknameResult}
            >
              <FormLabel ml={"100px"}>닉네임</FormLabel>
              <Flex>
                <Input
                  ml={"100px"}
                  w={"2xs"}
                  placeholder="닉네임 입력 (3~20자)"
                  maxLength={"20"}
                  value={nickname}
                  onChange={(e) => {
                    if (!e.target.value.includes(" ")) {
                      setNickNameDisable(true);
                      setNicknameMessage(true);
                      setCheckNicknameResult(false);
                      setNicknameMessage("3" + defaultLength);
                      setNickname(e.target.value);
                      if (e.target.value.length >= 3) {
                        setNicknameMessage(defaultMessage);
                      }
                    }
                  }}
                />
                {!isSubmitting ? (
                  <Button
                    isDisabled={nickname.length <= 2 || !nickNameDisable}
                    colorScheme="blue"
                    onClick={() => {
                      handleDuplicated("nickname", nickname);
                    }}
                  >
                    중복확인
                  </Button>
                ) : (
                  <Spinner />
                )}
              </Flex>
              <FormErrorMessage ml={"100px"}>
                {nicknameMessage}
              </FormErrorMessage>
            </FormControl>
            {/* 비밀번호 폼 ---------------------------------------------------------------------------------- */}
            <FormControl
              mt={4}
              isRequired
              isInvalid={password.length === 0 ? false : !passwordTypeResult}
            >
              <FormLabel ml={"100px"}>비밀번호</FormLabel>
              <Input
                ml={"100px"}
                w={"2xs"}
                type="password"
                maxLength={"20"}
                placeholder="비밀번호 입력( 8~20자, 특수기호 포함)"
                value={password}
                onChange={(e) => {
                  if (!e.target.value.includes(" ")) {
                    setPasswordTypeResult(false);
                    setPasswordMessage("8" + defaultLength);
                    setPassword(e.target.value);
                    if (e.target.value.length > 7) {
                      setPasswordMessage("안전검사가 필요합니다");
                    }
                  }
                }}
              />

              <FormErrorMessage ml={"100px"}>
                {passwordMessage}
              </FormErrorMessage>
            </FormControl>
            {/* 비밀번호 재확인 ---------------------------------------------------------------------------------- */}
            <FormControl
              mt={4}
              isRequired
              isInvalid={
                password_check.length === 0
                  ? false
                  : password === password_check
                    ? !passwordTypeResult
                    : true
              }
            >
              <FormLabel ml={"100px"}>비밀번호 재확인</FormLabel>
              <Flex>
                <Input
                  ml={"100px"}
                  w={"2xs"}
                  type="password"
                  maxLength={"20"}
                  placeholder="비밀번호 재확인"
                  value={password_check}
                  onChange={(e) => {
                    if (!e.target.value.includes(" ")) {
                      setPasswordTypeResult(false);
                      setPassword_check(e.target.value);
                      if (password === e.target.value) {
                        setPasswordCheckMessage("안전검사가 필요합니다");
                      } else {
                        setPasswordCheckMessage("비밀번호가 일치하지 않습니다");
                      }
                    }
                  }}
                />
                {!isSubmitting ? (
                  <Button
                    colorScheme="blue"
                    isDisabled={
                      password.length < 7 || password !== password_check
                    }
                    onClick={() => {
                      if (validatePassword(password)) {
                        setPasswordTypeResult(true);
                        toast({
                          position: "top",
                          description: "안전한 비밀번호입니다",
                          status: "success",
                        });
                      } else {
                        toast({
                          position: "top",
                          description: "안전하지 않은 비밀번호입니다.",
                          status: "warning",
                        });
                        setPasswordTypeResult(false);
                        setPasswordCheckMessage("");
                        setPasswordMessage(
                          "영문자와 숫자, 특수기호를 모두 포함해주세요",
                        );
                      }
                    }}
                  >
                    비밀번호 확인
                  </Button>
                ) : (
                  <Spinner />
                )}
              </Flex>
              <FormErrorMessage ml={"100px"}>
                {passwordCheckMessage}
              </FormErrorMessage>
            </FormControl>

            {/* 이메일 폼 -----------------------------------------------------------------------------------*/}
            <FormControl
              mt={4}
              isRequired
              isInvalid={email.length === 0 ? false : !checkEmailResult}
            >
              <FormLabel ml={"100px"}>이메일</FormLabel>
              <Flex>
                <Input
                  ml={"100px"}
                  w={"2xs"}
                  type="email"
                  maxLength={"30"}
                  placeholder="이메일 입력"
                  onChange={(e) => {
                    if (!e.target.value.includes(" ")) {
                      setCheckEmailResult(false);
                      setEmailDisable(true);
                      setEmail(e.target.value);
                      if (timer) clearTimeout(timer); // 기존 타이머가 있으면 초기화
                      const newTimer = setTimeout(() => {
                        // 함수 호출을 지연시키는 메서드
                        if (validateEmail(e.target.value)) {
                          setEmailMessage(defaultMessage);
                        } else {
                          setEmailMessage("이메일 형식이 맞지 않습니다");
                        }
                      }, 500); // 500ms 후에 유효성 검사
                      setTimer(newTimer);
                    }
                  }}
                />
                {!isSubmitting ? (
                  <Button
                    isDisabled={!emailDisable || !validateEmail(email)}
                    colorScheme="blue"
                    onClick={(e) => {
                      if (validateEmail(email)) {
                        handleDuplicated("email", email);
                      }
                    }}
                  >
                    중복확인
                  </Button>
                ) : (
                  <Spinner />
                )}
              </Flex>
              <FormErrorMessage ml={"100px"}>{emailMessage}</FormErrorMessage>
            </FormControl>
            {/* 생년월일 ---------------------------------------------------------------------------------- */}
            <FormControl mt={4} mb={4} isRequired>
              <FormLabel ml={"100px"}>생년월일</FormLabel>
              <Input
                ml={"100px"}
                ml={"100px"}
                w={"2xs"}
                type="date"
                onChange={(e) => {
                  setBirth_date(e.target.value);
                }}
              />
            </FormControl>
            <Center>
              <FormControl>
                <RadioGroup ml={"160px"} defaultValue="m" onChange={setGender}>
                  <HStack spacing="24px">
                    <Radio border={"2px solid blue"} value="m">
                      남자
                    </Radio>
                    <Radio
                      colorScheme="red"
                      value="w"
                      border={"2px solid tomato"}
                    >
                      여자
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </Center>
          </CardBody>
          <CardFooter gap={6}>
            {!isSubmitting ? (
              <Button
                size={"lg"}
                isDisabled={!submitAvailable}
                onClick={handleSignupForm}
                colorScheme="blue"
              >
                가입
              </Button>
            ) : (
              <Spinner />
            )}
            <Button
              colorScheme="red"
              size={"lg"}
              onClick={() => {
                navigate("/");
              }}
            >
              취소
            </Button>
          </CardFooter>
        </Card>
      </Center>
    </>
  );
}

export default MemberSignup;
