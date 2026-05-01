import Switch from '@mui/material/Switch';
import { memo } from 'react';

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

function SwitchComponent({ onChange, checked }) {

  return (
    <div>
      <Switch
        {...label}
        checked={checked}
        sx={{
          color: checked ? "primary.main" : "default"
        }}
        onChange={onChange}
        slotProps={{ input: { 'aria-label': 'controlled' } }}
      />
    </div>
  );
}

export default memo(SwitchComponent);