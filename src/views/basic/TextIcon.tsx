import { CSSProperties, FC, MouseEvent } from "react";

interface TextIconProps {
  text?: string;
  fontSize?: string;
  width?: string;
  height?: string;
  fontWeight?: string;
  color?: string;
  fontFamily?: string;
  onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  props?: CSSProperties;
}

const TextIcon: FC<TextIconProps> = ({
  text,
  fontSize,
  width,
  height,
  fontWeight,
  color,
  fontFamily,
  onMouseEnter,
  props,
}) => {
  const boxStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: width || "24px",
    height: height || "24px",
    fontSize: fontSize || "18px",
    fontWeight: fontWeight || "bold",
    color: color || "rgba(0, 0, 0, 0.54)",
    fontFamily: fontFamily || `"Roboto","Helvetica","Arial",sans-serif`,
    ...props,
  };

  return (
    <div style={boxStyle} onMouseEnter={onMouseEnter}>
      {text}
    </div>
  );
};

export default TextIcon;
