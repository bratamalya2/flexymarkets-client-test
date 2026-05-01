import React, { useState, useId } from 'react';
import { TextField, InputAdornment, Stack, Typography } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const FileUploadTextArea = ({ onChange, error, helperText, extentionType, acceptType }) => {
  const [file, setFile] = useState(null);
  const fileInputId = useId();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!extentionType.includes(selectedFile.type)) {
        onChange(null);
        setFile(null);
        return;
      }

      setFile(selectedFile);
      onChange(selectedFile, null);
    } else {
      setFile(null);
      onChange(null, null);
    }
  };

  return (
    <Stack style={{ flexDirection: 'column', gap: '10px' }}>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Browse"
        value={file ? file.name : ''}
        onClick={() => document.getElementById(fileInputId).click()}
        error={!!error}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <FileUploadOutlinedIcon />
              </InputAdornment>
            ),
            readOnly: true,
          },
        }}
        inputProps={{ 'aria-label': 'Upload bank book file' }}
      />
      <input
        type="file"
        id={fileInputId}
        accept={acceptType}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {helperText && (
        <Typography color="error" fontSize="14px">
          {helperText}
        </Typography>
      )}
    </Stack>
  );
};

export default FileUploadTextArea;