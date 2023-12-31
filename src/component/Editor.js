import React, { useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, useToast } from "@chakra-ui/react";
import "./editorStyle.css"; // External CSS file

const Editor = ({ uuid, setUuid, setContent1, data }) => {
  const toast = useToast();
  let imgSrc = document.getElementsByTagName("figure");

  const customUploadAdapter = (loader) => {
    return {
      upload() {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          loader.file.then((file) => {
            formData.append("file", file);
            formData.append("imgFile", imgSrc.length);

            axios
              .post("/api/file/ckupload", formData)
              .then((res) => {
                resolve({
                  default: res.data.ckuri,
                });
                setUuid(res.data.uuid);
              })
              .catch((err) => {
                // reject(err);
                if (err.response.status === 400) {
                  toast({
                    description: err.response.data,
                    status: "info",
                  });
                }
              });
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  function formattingPlugin(editor) {
    editor.model.schema.setAttributeProperties("linkHref", {
      isFormatting: true,
    });
  }

  return (
    <Box>
      <section>
        {/*TODO : focus를 벗어나도 높이가 고정되게 만들기*/}
        <CKEditor
          editor={ClassicEditor}
          data={data || ""}
          config={{ extraPlugins: [uploadPlugin] }}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            setContent1(editor.getData());
          }}
          onFocus={(event, editor) => {
            editor.ui.view.editable.element.style.minHeight = "500px";
          }}
        />
      </section>
    </Box>
  );
};

export default Editor;
