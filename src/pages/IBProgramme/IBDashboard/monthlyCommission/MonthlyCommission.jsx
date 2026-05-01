// import { Stack, Typography, useTheme } from "@mui/material";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined';


// // const data = [
// //   { month: "Jan", deposit: 0, withdrawal: 0 },
// //   { month: "Feb", deposit: 0, withdrawal: 0 },
// //   { month: "Mar", deposit: 0, withdrawal: 0 },
// //   { month: "Apr", deposit: 0, withdrawal: 0 },
// //   { month: "May", deposit: 0, withdrawal: 0 },
// //   { month: "Jun", deposit: 0, withdrawal: 0 },
// //   { month: "Jul", deposit: 0, withdrawal: 0 },
// //   { month: "Aug", deposit: 0, withdrawal: 0 },
// //   { month: "sep", deposit: 0, withdrawal: 0 },
// //   { month: "Oct", deposit: 0, withdrawal: 0 },
// //   { month: "Nov", deposit: 0, withdrawal: 0 },
// //   { month: "Dec", deposit: 0, withdrawal: 0 }
// // ];

// function MonthlyCommission() {

//   return (
//     <Stack variant={"section"} sx={{ borderRadius: "1.2rem", py: "1.2rem" }}>
//       <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem", ml: "2rem" }}>
//         <Stack sx={{ bgcolor: "primary.main", borderRadius: "50%", p: ".3rem" }}><DonutSmallOutlinedIcon sx={{ lineHeight: "0", color: "white" }} /></Stack>
//         <Typography fontWeight={"bold"} variant="h6">Monthly Commission</Typography>
//       </Stack>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
//           <CartesianGrid stroke="#999999" />
//           {/* <XAxis
//             dataKey="month"
//             tick={{ fontSize: 12, fill: "#999999" }}
//             stroke="#999999"
//           /> */}
//           <YAxis
//             domain={[0, 1]}
//             padding={{ top: 20, bottom: 20 }}
//             tick={{ fontSize: 12, fill: "#999999" }}
//             stroke="#999999"
//           />
//           {/* <Tooltip /> */}
//           <Legend />
//           <Line type="monotone" dataKey="Commission" stroke={theme => theme.palette.custom.brandDark} strokeWidth={2} />
//           {/* <Line type="monotone" dataKey="withdrawal" stroke={theme.palette.custom.brandLight} strokeWidth={2} /> */}
//         </LineChart>
//       </ResponsiveContainer>
//     </Stack>
//   );
// }

// export default MonthlyCommission;



import { Stack, useTheme, Typography } from "@mui/material";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts"
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined';

const data = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300
  }
]

function MonthlyCommission() {

  const theme = useTheme()

  return (
    <Stack variant={"section"} sx={{ borderRadius: "10px", p: "1.2rem" }}>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem", mb: "15px" }}>
        <Stack sx={{ bgcolor: "primary.main", borderRadius: "50%", p: ".3rem" }}><DonutSmallOutlinedIcon sx={{ lineHeight: "0", color: "white" }} /></Stack>
        <Typography fontWeight={"bold"} variant="h6">Monthly Commission</Typography>
      </Stack>
      <ResponsiveContainer width="100%" height={285}>
        <BarChart width={730} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill={theme.palette.custom.brandDark} />
          <Bar dataKey="uv" fill={theme.palette.custom.brandLight} />
        </BarChart>
      </ResponsiveContainer>
    </Stack>
  )
}

export default MonthlyCommission;