import YouTube from "react-youtube";
import { Box, Img, Spinner, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faComments } from "@fortawesome/free-solid-svg-icons";
import ReactPlayer from "react-player";

// 유튜브 정보 추출 컴포넌트 - 썸네일, 영상을 추출합니다.
function YoutubeInfo({
  link,
  extraThumbnail,
  extraVideo,
  opts = { height: "360px", width: "640px" },
  toolTip,
  mode,
  setIsYouTubeLink,
  setIsYouTubeLink1,
  setIsYouTubeLink2,
}) {
  // 상태 값
  const location = useLocation();

  let thumbnail = null;
  let videoId = null;

  // 링크가 유효한지 첫번째 검사 (null or isBlack)
  if (link && link.trim() !== "") {
    // 유튜브 링크에서 동영상 ID 추출 (정규표현식 match 메서드)
    const videoIdMatch = link.match(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );

    // 정규표현식 match 메서드 4번의 값으로 썸네일 추출
    if (videoIdMatch && videoIdMatch[4]) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoIdMatch[4]}/mqdefault.jpg`;
      thumbnail = thumbnailUrl;
      videoId = videoIdMatch[4];
    }
  }

  // 링크가 유효한지 첫번째 검사 (null or isBlack)
  // 메인 게시판 글 사용할 때
  if (mode === "voteLink") {
    if (link && link.trim() !== "") {
      // 유튜브 링크에서 동영상 ID 추출 (정규표현식 match 메서드)
      const videoIdMatch = link.match(
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      );

      // 정규표현식 match 메서드 4번의 값으로 썸네일 추출
      if (videoIdMatch && videoIdMatch[4]) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoIdMatch[4]}/mqdefault.jpg`;
        thumbnail = thumbnailUrl;
        videoId = videoIdMatch[4];
        setIsYouTubeLink(true);
      } else {
        setIsYouTubeLink(false);
      }
    }
  }

  // 링크가 유효한지 첫번째 검사 (null or isBlack)
  // 투표 게시판에서 링크1번 유효성검사
  if (mode === "voteLink1") {
    if (link && link.trim() !== "") {
      // 유튜브 링크에서 동영상 ID 추출 (정규표현식 match 메서드)
      const videoIdMatch = link.match(
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      );

      // 정규표현식 match 메서드 4번의 값으로 썸네일 추출
      if (videoIdMatch && videoIdMatch[4]) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoIdMatch[4]}/mqdefault.jpg`;
        thumbnail = thumbnailUrl;
        videoId = videoIdMatch[4];
        setIsYouTubeLink1(true);
      } else {
        setIsYouTubeLink1(false);
      }
    }
  }

  // 링크가 유효한지 첫번째 검사 (null or isBlack)
  // 투표 게시판에서 링크2번 유효성검사
  if (mode === "voteLink2") {
    if (link && link.trim() !== "") {
      // 유튜브 링크에서 동영상 ID 추출 (정규표현식 match 메서드)
      const videoIdMatch = link.match(
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      );

      // 정규표현식 match 메서드 4번의 값으로 썸네일 추출
      if (videoIdMatch && videoIdMatch[4]) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoIdMatch[4]}/mqdefault.jpg`;
        thumbnail = thumbnailUrl;
        videoId = videoIdMatch[4];
        setIsYouTubeLink2(true);
      } else {
        setIsYouTubeLink2(false);
      }
    }
  }

  return (
    <Box w={"100%"} h={"100%"}>
      {/* 프롭에 따라 썸네일, 유튜브영상 등을 선택해서 추출 가능 */}
      {/* 유튜브 썸네일 출력 => extraThumnail을 true로 설정 */}
      {/* thumbnailWidth, thumbnailHeight prop을 통해 길이 설정 가능, (기본값 320*180) */}
      {/* toolTip 을 true로 하면 이미지에 마우스 호버 시 툴팁으로 2배 적용된 이미지가 표시 된다.*/}
      {/* opt prop을 통해 영상의 크기 설정 가능*/}
      {extraThumbnail && (
        <>
          {toolTip && thumbnail !== null ? (
            <Tooltip
              label={
                <Img
                  src={thumbnail}
                  alt="유튜브 썸네일"
                  w={"100%"}
                  h={"100%"}
                />
              }
              placement="top-end"
            >
              {/* 링크가 null일 경우 임시 박스 삽입 */}
              {/* TODO : 임시 이미지 넣기 */}
              {thumbnail ? (
                <Img
                  src={thumbnail}
                  alt="유튜브 썸네일"
                  w={"100%"}
                  h={"100%"}
                  borderRadius={10}
                />
              ) : (
                <Box
                  backgroundColor={"grey"}
                  w={"100%"}
                  h={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  borderRadius={10}
                >
                  <FontAwesomeIcon
                    width={"100%"}
                    icon={faComments}
                    size="3x"
                    inverse={true}
                  />
                </Box>
              )}
            </Tooltip>
          ) : (
            <>
              {/* 링크가 null일 경우 임시 박스 삽입 */}
              {/* TODO : 임시 이미지 넣기 */}
              {thumbnail ? (
                <Img
                  src={thumbnail}
                  alt="유튜브 썸네일"
                  w={"100%"}
                  h={"100%"}
                  borderRadius={10}
                />
              ) : (
                <Box
                  backgroundColor={"darkgray"}
                  w={"100%"}
                  h={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  borderRadius={10}
                >
                  <FontAwesomeIcon
                    width={"100%"}
                    icon={faComments}
                    size="3x"
                    inverse={true}
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
      {/* 유튜브 영상 출력 => extraVideo를 true로 설정 */}
      {extraVideo && videoId !== null && (
        <ReactPlayer
          className="video-container"
          url={link}
          width={"100%"}
          height={"100%"}
          config={{
            youtube: {
              playerVars: {
                autoplay: 0,
                controls: 1,
              },
            },
          }}
        />
      )}
    </Box>
  );
}

export default YoutubeInfo;
