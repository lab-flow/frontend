import { Names } from "../../api/common/dataNames";
import { ReactNode } from "react";
import { Link, Typography } from "@mui/material";

export const unpackDataValuesFromDict = (
  data: {
    [key: string]: { repr: string; id: string };
  },
  translateKeyNames: boolean,
) => {
  const unpackedData: { [key: string]: any } = {};
  data &&
    Object.keys(data).forEach((key) => {
      const translatedName = translateKeyNames
        ? Names[key as keyof typeof Names] || key
        : key;
      unpackedData[translatedName] = data[key]?.repr || data[key];
    });
  return unpackedData;
};

export const unpackDataIdValuesFromDict = (
  data: { [x: string]: any },
  translateKeyNames: boolean,
) => {
  const unpackedData: { [key: string]: string } = {};
  data &&
    Object.keys(data).forEach((key) => {
      const translatedName = translateKeyNames
        ? Names[key as keyof typeof Names] || key
        : key;
      if (Array.isArray(data[key])) {
        unpackedData[translatedName] = data[key].map(
          (item: { id: number }) => item.id,
        );
      } else {
        unpackedData[translatedName] = data[key]?.id || data[key];
      }
    });
  return unpackedData;
};

const getItemsFromArray = (array: Array<{ repr: string } | never>) => {
  return array
    .map((item) => {
      return item.repr || item;
    })
    .join(", ");
};
const isValidURL = (value: string | { repr: string; id: string }) => {
  let url;

  try {
    url = new URL(value.toString());
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export const prepareElementFromDict = (dict: {
  [key: string]: { repr: string; id: string } | never;
}) => {
  const tooltipContent: Array<ReactNode> = [];

  const pushToTooltip = (key: string, valueToDisplay: string | ReactNode) => {
    tooltipContent.push(
      <Typography variant="body2">
        <b>{Names[key as keyof typeof Names] || key}:</b> {valueToDisplay}
      </Typography>,
    );
  };

  Object.keys(dict).forEach((key) => {
    const valueToDisplay: string | { repr: string; id: string } | never =
      dict[key]?.repr || dict[key];

    if (!valueToDisplay) return;
    else if (Array.isArray(valueToDisplay)) {
      pushToTooltip(key, getItemsFromArray(valueToDisplay));
    } else if (isValidURL(valueToDisplay)) {
      pushToTooltip(key, <Link href={valueToDisplay.toString()}>link</Link>);
    } else if (typeof valueToDisplay === "boolean") {
      pushToTooltip(key, valueToDisplay ? "Tak" : "Nie");
    } else {
      pushToTooltip(key, valueToDisplay.toString());
    }
  });
  return <>{tooltipContent}</>;
};
