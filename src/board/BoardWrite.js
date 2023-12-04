import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Filednd } from "../file/Filednd";
import YouTube from "react-youtube";
import Editor from "../component/Editor";

function BoardWrite() {
  /* use state */
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uuid, setUuid] = useState("");

  /* use navigate */
  let navigate = useNavigate();

  function handleSubmit() {
    let uuSrc = getSrc();

    console.log("저장 버튼 클릭됨");

    axios
      .postForm("/api/board/add", {
        title,
        link,
        content,
        uploadFiles,
        uuSrc,
      })
      .then(() => navigate("/board/list"))
      .catch(() => console.log("error"))
      .finally(() => {});
  }

  // 본문 영역 이미지 소스 코드 얻어오기
  function getSrc() {
    let imgSrc = document.getElementsByTagName("img");
    let arrSrc = [];

    for (let i = 0; i < imgSrc.length; i++) {
      if (
        imgSrc[i].src.length > 0 &&
        imgSrc[i].src.startsWith(
          "https://mybucketcontainer1133557799.s3.ap-northeast-2.amazonaws.com/fileserver/",
        )
      ) {
        arrSrc.push(imgSrc[i].src.substring(79, 115));
      }
    }

    return arrSrc;
  }

  return (
    <Box border={"2px solid black"} m={5}>
      <Heading mb={5}>유튜브 추천 :: 새 글 작성하기</Heading>

      {/* 제목 */}
      <FormControl mb={2}>
        <FormLabel>제목</FormLabel>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="추천 게시글의 제목을 입력해주세요."
        />
      </FormControl>

      {/* 링크 */}
      <FormControl mb={2}>
        <FormLabel>링크</FormLabel>
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="추천 영상의 링크를 입력해주세요."
        />
      </FormControl>

      {/* 본문 */}
      <FormControl mb={2}>
        <FormLabel>본문</FormLabel>
        {/* CKEditor 본문 영역 */}
        <Editor setUuid={setUuid} uuid={uuid} setContent1={setContent} />

        {/*<Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="본문을 작성 전 안내사항. @@개행문자 추가하기1) 욕설 비방 작품 어쩌구 2) 저작권 침해 어쩌구 3) 개인정보 침해 어쩌구... 등등"
          h={"sm"}
          resize={"none"}
        />*/}
      </FormControl>

      {/* 파일 첨부 */}
      <Filednd setUploadFiles={setUploadFiles} uploadFiles={uploadFiles} />

      {/* 저장 버튼 */}
      <Button onClick={handleSubmit} colorScheme="blue">
        작성 완료
      </Button>

      {/* 취소 버튼 */}
      <Button onClick={() => navigate("/board/list")} colorScheme="red">
        취소
      </Button>
    </Box>
  );
}

export default BoardWrite;