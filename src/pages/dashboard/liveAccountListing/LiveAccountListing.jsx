import { Card, CardContent, Stack, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';

const headings = ["Login ID", "Group", "Balance", "Equity"]

function LiveAccountListing() {

  const { selectedTheme } = useSelector((state) => state.themeMode)

  return (
    <Stack>
      <Card sx={{ borderRadius: "1.2rem", p: "2rem", boxShadow: "0", bgcolor: selectedTheme !== "dark" && "#f5f5f5" }}>
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
          <Stack sx={{ bgcolor: "primary.main", borderRadius: "50%", p: ".3rem" }}><PermIdentityOutlinedIcon sx={{ lineHeight: "0", color: "black" }} /></Stack>
          <Typography fontWeight={"bold"} variant="h6">Live Account Listing</Typography>
        </Stack>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", px: "0" }}>
          {
            headings.map((data, i) => (
              <Typography key={i} variant="body1">{data}</Typography>
            ))
          }
        </CardContent>
      </Card>
    </Stack>
  )
}

export default LiveAccountListing