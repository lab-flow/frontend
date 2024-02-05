import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { TextField } from "@mui/material";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Button from "@mui/material/Button";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { StyledForm } from "../../components/basic/StyledForm";
import { useState } from "react";
import Dropdown from "../../components/basic/Dropdown";
import { ProjectProcedureInterface } from "../../api/interfaces/projectProcedure.ts";
import { AxiosResponse } from "axios";
import { UserInterface } from "../../api/interfaces/user.ts";

interface ProjectProcedureFormProps {
  onSubmit: SubmitHandler<ProjectProcedureInterface>;
  defaultValues?: ProjectProcedureInterface;
}

function ProjectProcedureForm(props: ProjectProcedureFormProps) {
  const { control, handleSubmit } = useForm<ProjectProcedureInterface>({
    defaultValues: props.defaultValues || {},
  });

  const { data: usersData } = useQuery("getUsersData", () =>
    DataProviders.USERS.getItemList(0, 0, true),
  );
  const [manager, setManager] = useState<string>(
    props.defaultValues?.manager as unknown as string,
  );
  const [workers, setWorkers] = useState<string[]>(
    (props.defaultValues?.workers as unknown as string[]) || [],
  );
  return (
    <StyledForm>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.name}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="manager"
        render={({ field }) => (
          <Dropdown
            required
            label={Names.manager}
            value={manager as unknown as string}
            onChange={(e) => {
              setManager(e.target.value);
              field.onChange(e);
            }}
            id="manager"
            items={
              (usersData as AxiosResponse)?.data?.map(
                (item: UserInterface) => ({
                  name: item.username,
                  value: item.id,
                }),
              ) || []
            }
          />
        )}
      />
      <Controller
        control={control}
        name="workers"
        render={({ field }) => (
          <Dropdown
            required
            label={Names.workers}
            value={workers as unknown as string[]}
            onChange={(e) => {
              setWorkers(e.target.value as unknown as string[]);
              field.onChange(e);
            }}
            id="workers"
            items={
              (usersData as AxiosResponse)?.data?.map(
                (item: UserInterface) => ({
                  name: item.username,
                  value: item.id,
                }),
              ) || []
            }
            multiple
          />
        )}
      />
      <Button
        onClick={handleSubmit(props.onSubmit)}
        variant="contained"
        type="submit"
      >
        {Names.send}
      </Button>
    </StyledForm>
  );
}

export default ProjectProcedureForm;
