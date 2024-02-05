import CustomDialog from "./CustomDialog";
import DashboardCard from "./DashboardCard";
import BackButton from "../../components/basic/BackButton";
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface FormPageProps {
  title: string;
  content: ReactNode;
  setDialogOpen?: (val: boolean) => void;
  isLoading?: boolean;
}

export default function FormPage(props: FormPageProps) {
  return props.setDialogOpen ? (
    CustomDialog({
      title: props.title,
      content: props.content,
      open: true,
      setDialogOpen: props.setDialogOpen,
    })
  ) : (
    <>
      <BackButton />
      <Box sx={{ m: 1 }} />
      {DashboardCard({
        title: props.title,
        content: props.content,
        isLoading: props.isLoading,
      })}
    </>
  );
}
