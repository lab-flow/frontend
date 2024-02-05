import { Chip } from "@mui/material";

export enum SignalWord {
  DGR = "DGR",
  WRN = "WRN",
}

export const getSignalWordName = (word: SignalWord | string) => {
  switch (word) {
    case SignalWord.DGR:
      return "Niebezpieczeństwo (danger)";
    case SignalWord.WRN:
      return "Uwaga";
    default:
      return "";
  }
};

export const getSignalWordComponent = (word: SignalWord | string) => {
  switch (word) {
    case SignalWord.DGR:
      return <Chip label={getSignalWordName(SignalWord.DGR)} color="error" />;
    case SignalWord.WRN:
      return <Chip label={getSignalWordName(SignalWord.WRN)} color="warning" />;
    default:
      return <></>;
  }
};
