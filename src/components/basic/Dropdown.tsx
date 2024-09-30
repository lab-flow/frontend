import { Checkbox, FormControl, InputLabel, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { Noop, RefCallBack } from "react-hook-form";

interface DropdownProps<T> {
  id: string;
  label: string;
  onChange: (event: SelectChangeEvent) => void;
  items: Array<{ name: string; value: string; image?: string }>;
  required?: boolean;
  multiple?: boolean;
  width?: string;
  defaultValue?: T;
  onBlur?: Noop;
  value?: T;
  name?: string;
  ref?: RefCallBack;
  sx?: { width: string; marginBottom: string };
  size?: any;
  style?: any;
}

function DropdownSingle(props: DropdownProps<string | undefined>) {
  return (
    <FormControl
      required={props.required}
      sx={{ width: props.width || "100%" }}
    >
      <InputLabel id={`${props.id}-label`}>{props.label}</InputLabel>
      <Select
        labelId={`${props.id}-label`}
        id={props.id}
        label={props.label}
        required={props.required}
        name={props.name}
        onChange={props.onChange}
        value={props.value || ""}
        MenuProps={{
          style: { maxHeight: "400px" },
        }}
        style={props.style}
        sx={props.sx}
        size={props.size}
      >
        <MenuItem key={`emptyValue`} value={""}>
          <span style={{ margin: "auto 0" }}></span>
          <em>Puste</em>
        </MenuItem>
        {props.items.map((item) => (
          <MenuItem key={`${item.value}${item.name}`} value={item.value}>
            {item.image && (
              <img
                style={{ width: "35px", marginRight: "10px" }}
                src={item.image}
                alt=""
              />
            )}
            <span style={{ margin: "auto 0" }}>{item.name}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function DropdownMultiple(props: DropdownProps<string[] | undefined>) {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    props.value || [],
  );
  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    setSelectedValues(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl
      required={props.required}
      sx={{ width: props.width || "100%" }}
    >
      <InputLabel id={`${props.id}-label`}>{props.label}</InputLabel>
      <Select
        labelId={`${props.id}-label`}
        {...props}
        displayEmpty
        value={selectedValues || []}
        onChange={(e: SelectChangeEvent<string[]>) => {
          props.onChange(e as SelectChangeEvent);
          handleChange(e);
        }}
        renderValue={(selected) => {
          const selectedItems = props.items.filter((item) =>
            selected.includes(item.value),
          );
          return selectedItems.map((item) => item.name).join(", ");
        }}
        MenuProps={{
          style: { maxHeight: "400px" },
        }}
      >
        {props.items.map((item) => (
          <MenuItem key={`${item.value}${item.name}`} value={item.value}>
            <Checkbox checked={selectedValues.indexOf(item.value) > -1} />
            {item.image && (
              <img
                style={{ width: "35px", marginRight: "10px" }}
                src={item.image}
                alt=""
              />
            )}
            <span style={{ margin: "auto 0" }}>{item.name}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function Dropdown(props: DropdownProps<string | undefined | string[]>) {
  return props.multiple ? (
    <DropdownMultiple {...(props as DropdownProps<string[] | undefined>)} />
  ) : (
    <DropdownSingle {...(props as DropdownProps<string | undefined>)} />
  );
}

export default Dropdown;
