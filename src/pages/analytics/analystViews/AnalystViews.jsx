import TabComponent from "../../../components/TabComponent"
import { Stack, useMediaQuery } from "@mui/material";
import { useState } from "react";
import AnalystViewsContent from "./AnalystViewsContent";
import Selector from "../../../components/Selector";

function AnalystViews() {

  const [active, setActive] = useState("Forex")

  const matches = useMediaQuery('(min-width:500px)');

  function handleOnChange(newAlignment) {
    if (newAlignment) {
      setActive(newAlignment)
    }
  }

  return (
    <Stack>
      {
        matches ?
          <TabComponent
            items={["Forex", "Crypto", "Stocks", "Indices", "Commodities"]}
            boxSx={{ mt: "1.2rem" }}
            tabSx={{ fontSize: ".9rem" }}
            active={active}
            onChange={(_, newAlignment) => handleOnChange(newAlignment)}
          />
          :
          <Selector
            items={["Forex", "Crypto", "Stocks", "Indices", "Commodities"]}
            showDefaultOption={false}
            selected={"Forex"}
            selectSx={{ mt: "1.2rem" }}
          />
      }
      <AnalystViewsContent active={active} />
    </Stack>
  )
}

export default AnalystViews;