import * as React from "react";
import { ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import {
  prepareElementFromDict,
  unpackDataValuesFromDict,
} from "./DataUnpackUtils";
import { Names } from "../../api/common/dataNames";
import { AxiosResponse } from "axios";

export const GridCellDetailsFromEndpoint = React.memo(
  function GridCellDetailsFromEndpoint(props: {
    width: number;
    value: string;
    getDetails: () => Promise<AxiosResponse>;
  }) {
    const { width, value } = props;
    const wrapper = React.useRef(null);
    const cellDiv = React.useRef(null);
    const cellValue = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showFullCell, setShowFullCell] = React.useState(false);
    const [showPopper, setShowPopper] = React.useState(false);
    const [details, setDetails] = React.useState<ReactNode>();
    const [timerId, setTimerId] = useState<any>();

    const handleMouseEnter = () => {
      const timer = setTimeout(async () => {
        details ||
          props.getDetails().then((details: AxiosResponse) => {
            const preparedDetails = unpackDataValuesFromDict(
              details?.data,
              true,
            );
            if (preparedDetails) {
              setDetails(prepareElementFromDict(preparedDetails));
            }
          });
      }, 200);
      setTimerId(timer);
      setShowPopper(true);
      setAnchorEl(cellDiv.current);
      setShowFullCell(true);
    };

    const handleMouseLeave = () => {
      clearTimeout(timerId);
      setShowFullCell(false);
    };

    return (
      <Box
        ref={wrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          alignItems: "center",
          lineHeight: "24px",
          width: 1,
          height: 1,
          position: "relative",
          display: "flex",
        }}
      >
        <Box
          ref={cellDiv}
          sx={{
            height: 1,
            width,
            display: "block",
            position: "absolute",
            top: 0,
          }}
        />
        <Box
          ref={cellValue}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <b>{value}</b>
        </Box>
        {showPopper && (
          <Popper
            open={showFullCell && anchorEl !== null}
            anchorEl={anchorEl}
            style={{ width, marginLeft: -17 }}
          >
            <Paper
              elevation={1}
              style={{
                wordWrap: "break-word",
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                minHeight: wrapper.current.offsetHeight - 3,
                width: "400px",
              }}
            >
              <Typography variant="body2" style={{ padding: 8 }}>
                {details || <>{Names.loading_data}</>}
              </Typography>
            </Paper>
          </Popper>
        )}
      </Box>
    );
  },
);
