import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";

interface CustomDatePickerProps {
  label?: string;
  required: boolean;
  defaultValue?: string;
  width?: string;
  size?: any;
  style?: any;
  onChange?: any;
}

function CustomDatePicker(props: CustomDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TextField
        type="date"
        variant="outlined"
        sx={{ width: props.width || "300px" }}
        InputLabelProps={{
          shrink: true,
        }}
        defaultValue={props.defaultValue}
        {...props}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
