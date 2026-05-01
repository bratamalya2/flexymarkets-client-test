import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Card,
  Button
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import Loader from "../../../components/Loader"

function ReferralNode({ node, onClick }) {

  const [open, setOpen] = useState(false);

  const handleNodeClick = () => {
    onClick(node.title)
  };

  const handleToggleCollapse = (e) => {
    e.stopPropagation()
    if (node.hasChildren) {
      setOpen((prev) => !prev);
    }
  };

  return (
    <>
      <ListItem button onClick={handleNodeClick} sx={{ pl: 2 }}>
        <ListItemText primary={node.title} sx={{ '& .MuiListItemText-primary': { fontSize: '15px' }, cursor: "pointer" }} />
        {node.hasChildren && (
          <Button
            onClick={handleToggleCollapse}
            size="small"
            variant='contained'
            type='submit'
            sx={{
              textTransform: "capitalize",
              minWidth: "1.5rem",
              p: "4px",
              boxShadow: "none",
              fontSize: "1rem",
              color: "white",
              ml: "1rem",
              "&:hover": {
                boxShadow: "none"
              }
            }}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </Button>
        )}
      </ListItem>
      {node.hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children?.filter(Boolean).map((child, idx) => (
              <ReferralNode key={idx} node={child} onClick={onClick} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function TreeChart({ listData = [], onClick, loadingListData }) {
  return (
    <Card
      sx={{
        p: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        borderRadius: "2rem",
        boxShadow: "0 0px 0px 0 rgba(0, 0, 0, 0.19), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      {
        loadingListData
          ?
          <Loader />
          :
          <List>
            {listData.map((node, idx) => (
              <ReferralNode key={idx} node={node} onClick={onClick} />
            ))}
          </List>

      }
    </Card>
  );
}






















// import { useRef, useEffect, useState } from "react";
// import Tree from "react-d3-tree";
// import { Card, Box } from "@mui/material";
// import Loader from "../../../components/Loader";
// import { convertToD3Tree } from "../../../utils/convertToD3Tree";

// export default function TreeChart({ listData = [], onClick, loadingListData }) {
//   const treeContainer = useRef(null);
//   const [translate, setTranslate] = useState({ x: 0, y: 0 });


//   useEffect(() => {
//     if (treeContainer.current) {
//       const dimensions = treeContainer.current.getBoundingClientRect();
//       setTranslate({
//         x: dimensions.width / 2,
//         y: 80,
//       });
//     }
//   }, []);

//   const d3FormattedData = listData.map(convertToD3Tree);

//   return (
//     <Card
//       sx={{
//         p: "1rem",
//         display: "flex",
//         flexDirection: "column",
//         gap: ".5rem",
//         height: "100vh",
//         overflow: "auto",
//         borderRadius: "2rem",
//         boxShadow: "0 0px 0px 0 rgba(0, 0, 0, 0.19), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
//       }}
//     >
//       {loadingListData ? (
//         <Loader />
//       ) : (
//         <Box id="treeWrapper" sx={{ width: "100%", height: "100%" }}>
//           <Tree
//             data={d3FormattedData}
//             orientation="vertical"
//             translate={translate}
//             zoomable
//             collapsible
//             pathFunc="diagonal"
//             separation={{ siblings: 1, nonSiblings: 2 }}
//             renderCustomNodeElement={({ nodeDatum, toggleNode }) => {

//               return (
//                 <g onClick={toggleNode}>
//                   <circle r={15} fill="#1f2a44" />
//                   <text
//                     x={20}
//                     y={5}
//                     fontSize="13px"
//                     fontWeight="400"
//                     fill="#1e293b"
//                     fontFamily="Inter, Roboto, sans-serif"
//                     style={{ letterSpacing: "1px" }}
//                   >
//                     {nodeDatum.referral}
//                   </text>
//                   <text x={20} y={25}>{nodeDatum.name}</text>
//                 </g>
//               );
//             }}
//           />
//         </Box>
//       )}
//     </Card>
//   );
// }