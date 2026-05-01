import { Box, Stack, Typography, Button } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MobileFriendlyOutlinedIcon from '@mui/icons-material/MobileFriendlyOutlined';
import DocumentUploader from "../../../components/DocumentUploader"
import Grid from "@mui/material/Grid2";

const doAndDoNotData = {
  Do: [
    "Photo is clear and sharp",
    "Details can be read clearly",
    "High or good photo quality",
    "All 4 corners of the document are visible"
  ],
  "Don't": [
    "Photo is blurry and not focused",
    "Details cannot be read clearly",
    "Poor photo quality (too dark or bright)",
    "Not all corners are visible"
  ]
}


function UploadSelectedDocumentPhoto({ data }) {

  return (
    <Stack mt={"1rem"}>
      <Grid
        container
        size={12}
        spacing={2}
      >
        {
          data && data.map((img, i) => (
            <Grid size={6} key={i}>
              <img src={img} width={"100%"} />
            </Grid>
          ))
        }
      </Grid>
      <Stack
        sx={{
          flexDirection: "row"
        }}
      >
        {
          Object.entries(doAndDoNotData).map(([keys, values], i) => (
            <Stack key={i} width={"100%"} mt={".5rem"}>
              <Typography fontWeight={500} width={"50%"} color={keys === "Do" ? "green" : "#c13b34"}>{keys}</Typography>
              <Stack mt={".5rem"} gap={".5rem"}>
                {
                  values.map((items, i) => (
                    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }} key={i}>
                      <FiberManualRecordIcon fontSize="1px" />
                      <Typography key={i} fontSize={"14px"} width={"100%"} sx={{ wordBreak: "break-word" }}>{items}</Typography>
                    </Stack>
                  ))
                }
              </Stack>
            </Stack>
          ))
        }
      </Stack>
      <Box
        sx={{
          my: "2rem",
          display: "flex",
          justifyContent: "center",
          gap: "10px"
        }}
      >
        <MobileFriendlyOutlinedIcon sx={{ color: "blue" }} />
        <Typography color="blue">Upload documents with your phone</Typography>
      </Box>
      <DocumentUploader py={"2rem"} />
      <Button
        type='submit'
        variant='contained'
        // disabled={isLoading}
        sx={{
          textTransform: "capitalize",
          boxShadow: "none",
          color: "white",
          mt: '1.5rem',
          alignSelf: "self-end",
          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        Submit document
      </Button>
    </Stack>
  )
}

export default UploadSelectedDocumentPhoto;

"Passport"
"National ID"