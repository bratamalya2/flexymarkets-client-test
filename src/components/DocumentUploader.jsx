// import { useDropzone } from "react-dropzone";
// import { Box, Typography, Paper } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { useSelector } from "react-redux";

// const DocumentUploader = ({ py = 8, onChange, value, name, label }) => {
//   const { selectedTheme } = useSelector((state) => state.themeMode);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "image/jpeg": [], "image/png": [], "application/pdf": [] },
//     maxFiles: 1,
//     onDrop: (acceptedFiles) => {
//       onChange(acceptedFiles[0]);
//     },
//   });

//   return (
//     <Paper
//       {...getRootProps()}
//       sx={{
//         py,
//         textAlign: "center",
//         border: theme => `2px dashed ${theme.palette.primary.main}`,
//         borderRadius: 2,
//         cursor: "pointer",
//         minWidth: "100%",
//         boxShadow: "none"
//       }}
//     >
//       <input {...getInputProps()} name={name} />
//       <CloudUploadIcon sx={{ fontSize: 40, color: "primary.main" }} />
//       <Typography variant="body1" mt={1}>
//         Drag & drop files or <Typography component="span" sx={{ color: "primary.main" }}>Browse</Typography>
//       </Typography>
//       <Typography variant="caption" color="textSecondary">
//         {label} — JPEG, JPG, PNG, PDF
//       </Typography>
//       {value && (
//         <Box mt={2}>
//           {value.type?.startsWith("image/") ? (
//             <img
//               src={URL.createObjectURL(value)}
//               alt={value.name}
//               style={{ width: "100px", height: "auto", borderRadius: 5 }}
//             />
//           ) : (
//             <Typography variant="body2">{value.name}</Typography>
//           )}
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default DocumentUploader;














import { useDropzone } from "react-dropzone";
import { Box, Typography, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector } from "react-redux";

// const DocumentUploader = ({ py = 8, onChange, value, name, label }) => {
//   const { selectedTheme } = useSelector((state) => state.themeMode);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "image/jpeg": [], "image/png": [], "application/pdf": [] },
//     maxFiles: 1,
//     onDrop: (acceptedFiles) => {
//       onChange(acceptedFiles[0]);
//     },
//   });

//   return (
//     <Paper
//       {...getRootProps()}
//       sx={{
//         py,
//         textAlign: "center",
//         border: theme => `2px dashed ${theme.palette.primary.main}`,
//         borderRadius: 2,
//         cursor: "pointer",
//         minWidth: "100%",
//         boxShadow: "none"
//       }}
//     >
//       <input {...getInputProps()} name={name} />
//       <CloudUploadIcon sx={{ fontSize: 40, color: "primary.main" }} />
//       <Typography variant="body1" mt={1}>
//         Drag & drop files or <Typography component="span" sx={{ color: "primary.main" }}>Browse</Typography>
//       </Typography>
//       <Typography variant="caption" color="textSecondary">
//         {label} — JPEG, JPG, PNG, PDF
//       </Typography>
//       {value && (
//         <Box mt={2}>
//           {value.type?.startsWith("image/") ? (
//             <img
//               src={URL.createObjectURL(value)}
//               alt={value.name}
//               style={{ width: "100px", height: "auto", borderRadius: 5 }}
//             />
//           ) : (
//             <Typography variant="body2">{value.name}</Typography>
//           )}
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default DocumentUploader;





const DocumentUploader = ({ py = 8, onChange, value, name, label, multiple = false }) => {

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "application/pdf": [] },
    maxFiles: multiple ? 10 : 1,
    onDrop: (acceptedFiles) => {
      if (multiple) onChange(acceptedFiles);
      else onChange(acceptedFiles[0]);
    },
  });

  return (
    <Paper {...getRootProps()} sx={{ py, textAlign: "center", border: theme => `2px dashed ${theme.palette.primary.main}`, borderRadius: 2, cursor: "pointer" }}>
      <input {...getInputProps()} name={name} multiple={multiple} />
      <CloudUploadIcon sx={{ fontSize: 40, color: "primary.main" }} />
      <Typography variant="body1" mt={1}>
        Drag & drop files or <Typography component="span" sx={{ color: "primary.main" }}>Browse</Typography>
      </Typography>
      <Typography variant="caption">{label} — JPEG, PNG, JPG, PDF</Typography>

      {/* Preview for multiple */}
      {multiple && value?.length > 0 && (
        <Box mt={2}>
          {value.map((file, idx) => (
            <Typography key={idx} variant="body2">
              {file.name}
            </Typography>
          ))}
        </Box>
      )}
      {!multiple && value && (
        <Box
          mt={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {value.type?.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(value)}
              alt={value.name}
              style={{
                width: "120px",
                objectFit: "contain",
                borderRadius: "6px"
              }}
            />
          ) : (
            <Typography variant="body2">{value.name}</Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default DocumentUploader;