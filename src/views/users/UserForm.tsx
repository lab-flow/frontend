import { Controller, useForm } from "react-hook-form";
import { TextField } from "@mui/material";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Dropdown from "../../components/basic/Dropdown.tsx";
import { UserFormInterface } from "../../api/interfaces/user";
import { getRoleName, ROLE } from "../../api/enums/userRoles";
import Button from "@mui/material/Button";
import { StyledForm } from "../../components/basic/StyledForm";

interface UserFormProps {
  onSubmit: (data: UserFormInterface) => void;
  defaultValues?: UserFormInterface;
  edit?: boolean;
}

function UserForm(props: UserFormProps) {
  const { control, handleSubmit } = useForm<UserFormInterface>({
    defaultValues: props.defaultValues ? props.defaultValues : {},
  });

  const labRoles = Object.values(ROLE).map((value) => ({
    name: getRoleName(value),
    value: value,
  }));

  return (
    <StyledForm>
      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={`${Names.username} (${Names.initials})`}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.email}
            required
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="first_name"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.first_name}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="last_name"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.last_name}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="lab_roles"
        render={({ field }) => (
          <Dropdown
            label={Names.lab_roles}
            id="lab_roles"
            items={labRoles}
            multiple
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            required={!props.edit}
            label={Names.password}
            InputProps={{
              type: "password",
            }}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="passwordConfirm"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            required={!props.edit}
            label={Names.password_confirm}
            InputProps={{
              type: "password",
            }}
            {...field}
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

export default UserForm;
