import { Stack } from "@mui/material";
import UploadDocument from "./UploadDocument";
import { useState } from "react";
import EditName from "./EditName";

function DocumentsVerification() {
  const [isEdit, setIsEdit] = useState(false);

  const handleClick = () => {
    setIsEdit(prev => !prev);
  };

  return (
    <Stack>
      {
        !isEdit
          ?
          <UploadDocument onClick={handleClick} />
          :
          <EditName onClick={handleClick} />
      }
    </Stack>
  );
}

export default DocumentsVerification;