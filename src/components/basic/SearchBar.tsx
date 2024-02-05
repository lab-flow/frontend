import { useEffect, useRef, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Names } from "../../api/common/dataNames";

interface SearchBarProps {
  handleSearchChange: (searchTerm: string) => void;
}

function SearchBar(props: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const inputRef = useRef({ value: undefined });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current.value === searchTerm) {
        props.handleSearchChange(searchTerm);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, inputRef, props]);

  return (
    <TextField
      id="search"
      type="search"
      label={Names.search}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      inputRef={inputRef}
      sx={{ width: 600, maxWidth: "100%", margin: "10px 0" }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchBar;
