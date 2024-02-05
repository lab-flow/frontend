import { Button, Divider, styled, Typography } from "@mui/material";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { useState } from "react";
import TextIcon from "../../views/basic/TextIcon";
import { Names } from "../../api/common/dataNames";
import { getSignalWordName } from "../../api/enums/signalWords";
import { prepareElementFromDict } from "../datagrid/DataUnpackUtils";

export const HtmlTooltip = styled((props: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: props.className }}
    children={props.children}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fdfdfd",
    color: "rgba(0, 0, 0, 0.87)",
    minWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

interface PictogramTooltipProps {
  item?: { id: number; repr: string };
  size?: number;
  getDetails?: (id: number | undefined) => Promise<object>;
  type?: string;
}

interface Details {
  id?: number;
  classification?: string;
  pictogram?: { repr: string };
  clp_classification?: { repr: string };
  code?: string;
  phrase?: string;
  hazard_class?: string;
  hazard_category?: string;
  hazard_and_category_code?: string;
  signal_word?: string;
}

function CustomReagentTooltip(props: PictogramTooltipProps) {
  const [details, setDetails] = useState<Details>({});

  const title =
    props.type == "H" ? (
      <>
        <Typography
          color="inherit"
          variant="h5"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {" "}
          <img
            src={details?.pictogram?.repr}
            alt={details?.classification}
            style={{
              width: "60px",
              height: "60px",
              boxShadow: "0 0 1px rgba(0, 0, 0, 0.5)",
              marginRight: "10px",
            }}
          />
          {details?.clp_classification?.repr}
        </Typography>
        <p>
          <strong>{Names.code}:</strong> {details?.code}
        </p>
        <p>
          <strong>{Names.phrase}:</strong> {details?.phrase}
        </p>
        <Divider style={{ margin: "5px 0" }} />
        <p>
          <strong>{Names.hazard_class}:</strong> {details?.hazard_class}
        </p>
        <p>
          <strong>{Names.hazard_category}:</strong> {details?.hazard_category}
        </p>
        <p>
          <strong>{Names.hazard_and_category_code}:</strong>{" "}
          {details?.hazard_and_category_code}
        </p>
        <p>
          <strong>{Names.signal_word}:</strong>{" "}
          {details?.signal_word && getSignalWordName(details?.signal_word)}
        </p>
      </>
    ) : (
      <>
        {prepareElementFromDict(
          details as {
            [key: string]: { repr: string; id: string } | never;
          },
        )}
      </>
    );
  const [timerId, setTimerId] = useState<any>();
  return (
    <HtmlTooltip
      title={title}
      children={
        <Button
          style={{
            padding: "0",
            margin: "0",
            boxShadow: "0 0 1px rgba(0, 0, 0, 0.5)",
            width: "50px",
          }}
          onMouseEnter={async () => {
            const timer = setTimeout(async () => {
              if (!details?.id && props.getDetails) {
                const detailsContent: { data?: Details } =
                  await props.getDetails(props.item?.id);
                setDetails(detailsContent?.data || {});
              }
            }, 200);
            setTimerId(timer);
          }}
          onMouseLeave={() => {
            clearTimeout(timerId);
          }}
        >
          {" "}
          <TextIcon
            props={{
              fontSize: "12px",
              width: "100px",
              whiteSpace: "nowrap",
              display: "inline-block",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            text={props.item?.repr}
            onMouseEnter={undefined}
            fontSize={undefined}
          />
        </Button>
      }
    />
  );
}

export default CustomReagentTooltip;
