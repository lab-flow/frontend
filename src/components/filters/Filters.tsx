import { SetStateAction, useState } from "react";
import { useQuery } from "react-query";
import { Controller } from "react-hook-form";
import Dropdown from "../basic/Dropdown";
import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { getLaboratoryName, Laboratory } from "../../api/enums/laboratory";
import { Autocomplete, Card, Chip, TextField, Typography } from "@mui/material";
import CustomDatePicker from "../basic/CustomDatePicker";

interface BaseFilterProps {
  control: never;
  name: any;
  displayName: string;
  id: string;
  dataGetterQuery: () => Promise<never>;
  queryKey: string;
  dataGetter?: () => [];
  itemsNameMap: (item: object) => string;
  itemsValueMap: (item: object) => string;
  defaultValue?: any;
  width?: string;
  defaultEmptyValue?: any;
  defaultEmptyName?: any;
  disableDefault?: boolean;
  multiple?: boolean;
  required?: boolean;
}

export function BaseFilter(props: BaseFilterProps) {
  const defaultValue = props.defaultValue || props.multiple ? [] : "";
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const { data: itemsData } = useQuery(
    props.queryKey,
    props.dataGetter || props.dataGetterQuery,
  );

  const getItemsWithDefault = () => {
    const defaultItem = {
      name: props.defaultEmptyName || "",
      value: props.defaultEmptyValue,
    };
    const currentItems =
      (itemsData as unknown as { data: Array<object> })?.data?.map(
        (item: object) => ({
          name: props.itemsNameMap(item),
          value: props.itemsValueMap(item),
        }),
      ) || [];
    return props.disableDefault ? currentItems : [defaultItem, ...currentItems];
  };

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <Dropdown
          width={props.width || "100%"}
          label={props.displayName}
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value);
            field.onChange(e);
          }}
          id={props.id}
          items={getItemsWithDefault()}
          multiple={!!props.multiple}
          required={!!props.required}
        />
      )}
    />
  );
}

interface FilterProps {
  control: any;
  defaultValue?: any;
  defaultEmptyValue?: any;
  defaultEmptyName?: any;
  disableDefault?: boolean;
  multiple?: boolean;
  required?: boolean;
  field_name?: string;
  setValue?: any;
}

export function ReagentFilter(props: FilterProps) {
  return (
    <BaseFilter
      {...props.control}
      name="reagent"
      displayName={`${Names.reagent} (${Names.id} - ${Names.name} - ${Names.producer})`}
      id="reagent"
      dataGetterQuery={() => DataProviders.REAGENTS.getItemList(0, 0, true)}
      queryKey="getReagents"
      itemsNameMap={(item: { id: any; name: any; producer: { repr: any } }) =>
        `${item.id} - ${item.name} - ${item.producer?.repr}`
      }
      itemsValueMap={(item: { id: string }) => item.id}
      {...props}
    />
  );
}

export function LaboratoryFilterBase(props: FilterProps) {
  const defaultValue = props.defaultValue || props.multiple ? [] : "";
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const getItemsWithDefault = () => {
    const defaultItem = {
      name: props.defaultEmptyName || "",
      value: props.defaultEmptyValue,
    };
    const laboratories = Object.keys(Laboratory).map((key) => ({
      name: getLaboratoryName(Laboratory[key as keyof typeof Laboratory]),
      value: Laboratory[key as keyof typeof Laboratory]?.toString(),
    }));
    return props.disableDefault ? laboratories : [defaultItem, ...laboratories];
  };

  return (
    <Controller
      control={props.control}
      name="laboratory"
      render={({ field }) => (
        <Dropdown
          label={Names.laboratory}
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value);
            field.onChange(e);
          }}
          id="laboratory"
          items={getItemsWithDefault()}
          multiple={!!props.multiple}
          required={!!props.required}
        />
      )}
    />
  );
}

export function LaboratoryFilter(props: FilterProps) {
  return <LaboratoryFilterBase {...props} />;
}

export function ProjectProcedureFilter(props: FilterProps) {
  return (
    <BaseFilter
      {...props.control}
      name="project_procedure"
      displayName={`${Names.project_procedure} (${Names.id} - ${Names.name})`}
      id="project_procedure"
      dataGetterQuery={() =>
        DataProviders.PROJECT_PROCEDURES.getItemList(0, 0, true)
      }
      queryKey="getProjectProcedures"
      itemsNameMap={(item: { id: any; name: any }) =>
        `${item.id} - ${item.name}`
      }
      itemsValueMap={(item: { id: string }) => item.id}
      {...props}
    />
  );
}

export function UsersFilter(props: FilterProps) {
  return (
    <BaseFilter
      {...props.control}
      name="main_owner"
      displayName={`${Names.main_owner} (${Names.id} - ${Names.username})`}
      id="main_owner"
      dataGetterQuery={() => DataProviders.USERS.getItemList(0, 0, true)}
      queryKey="getUsersData"
      itemsNameMap={(item: { id: any; username: any }) =>
        `${item.id} - ${item.username}`
      }
      itemsValueMap={(item: { id: string }) => item.id}
      {...props}
    />
  );
}

export function ProducerFilter(props: FilterProps) {
  return (
    <BaseFilter
      {...props.control}
      name="producer"
      displayName={`${Names.producer} (${Names.abbreviation} - ${Names.producer_name} - ${Names.brand_name})`}
      id="producer"
      dataGetterQuery={() => DataProviders.PRODUCERS.getItemList(0, 0, true)}
      queryKey="getProducersData"
      itemsNameMap={(item: {
        abbreviation: any;
        producer_name: any;
        brand_name: any;
      }) => `${item.abbreviation} - ${item.producer_name} - ${item.brand_name}`}
      itemsValueMap={(item: { id: string }) => item.id}
      {...props}
    />
  );
}

export function ReagentTypeFilter(props: FilterProps) {
  return (
    <BaseFilter
      {...props.control}
      name="type"
      displayName={Names.type}
      id="type"
      dataGetterQuery={() =>
        DataProviders.REAGENT_TYPES.getItemList(0, 0, true)
      }
      queryKey="getReagentTypesData"
      itemsNameMap={(item: { type: string }) => item.type}
      itemsValueMap={(item: { id: string }) => item.id}
      {...props}
    />
  );
}

export function BooleanFilter(props: FilterProps) {
  const data = {
    data: [
      { id: "true", value: Names.yes },
      { id: "false", value: Names.no },
    ],
  };
  return (
    <BaseFilter
      {...props.control}
      name={props.field_name}
      displayName={Names[props.field_name as keyof typeof Names]}
      id={props.field_name}
      dataGetter={() => data}
      queryKey={`getBooleanData${props.field_name}`}
      itemsNameMap={(item: { value: string }) => item.value}
      itemsValueMap={(item: { id: string }) => item.id}
      {...props}
    />
  );
}

export function ClpClassificationFilter(props: FilterProps) {
  return (
    <BaseFilter
      {...props.control}
      name="clp_classification"
      displayName={Names.clp_classification}
      id="clp_classification"
      dataGetterQuery={() =>
        DataProviders.CLP_CLASSIFICATIONS.getItemList(0, 0, true)
      }
      queryKey="getClpClassificationData"
      itemsNameMap={(item: { clp_classification: string }) =>
        item.clp_classification
      }
      itemsValueMap={(item: { id: string }) => item.id}
      {...props}
    />
  );
}

export function MultiplyChipsFilterField(props: {
  control: any;
  name: string;
  label: string;
  setValue?: any;
  required?: boolean;
}) {
  const [currentValue, setCurrentValue] = useState("");

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={() => (
        <Autocomplete
          clearIcon={false}
          options={currentValue ? [currentValue] : []}
          multiple
          renderTags={(value, props) =>
            value.map((option, index) => (
              <Chip label={option} {...props({ index })} />
            ))
          }
          onChange={(_e, value) => {
            props.setValue(props.name, value);
          }}
          onInputChange={(_e, value) => {
            setCurrentValue(value);
          }}
          renderInput={(params) => (
            <TextField label={props.label} {...params} />
          )}
          getOptionLabel={(option) => `Dodaj: '${option}'`}
        />
      )}
    />
  );
}

export const getFieldNameBySign = (sign: string, name: string | undefined) => {
  switch (sign) {
    case "≤":
      return `${name}_lte`;
    case ">":
      return `${name}_gt`;
    case "<":
      return `${name}_lt`;
    case "≥":
      return `${name}_gte`;
    default:
      return name;
  }
};

export function DateFilter(props: FilterProps) {
  const [sign, setSign] = useState("");
  const [dateValue, setDateValue] = useState("");
  const signs = [
    { name: "≥", value: "≥" },
    { name: "<", value: "<" },
    { name: ">", value: ">" },
    { name: "≤", value: "≤" },
    { name: "=", value: "=" },
  ];

  const formValues = signs.map((sign) =>
    getFieldNameBySign(sign.value, props.field_name),
  );

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
      variant="outlined"
    >
      <Typography
        sx={{
          textAlign: "center",
          alignSelf: "center",
          padding: "0 10px",
        }}
      >
        {Names[props.field_name as keyof typeof Names]}
      </Typography>
      <Dropdown
        size="small"
        width="70px"
        style={{ top: "7px" }}
        label={Names.sign}
        value={sign}
        onChange={(e) => {
          const currentSign = getFieldNameBySign(
            e.target.value,
            props.field_name,
          );
          formValues.forEach((value) => {
            if (value !== currentSign) {
              props.setValue(value, undefined);
            } else {
              props.setValue(value, dateValue);
            }
          });
          setSign(e.target.value);
        }}
        id="sign"
        items={signs}
      />
      <CustomDatePicker
        size="small"
        width="140px"
        style={{ top: "7px" }}
        required={!!props.required}
        onChange={(e: { target: { value: SetStateAction<string> } }) => {
          const currentSign = getFieldNameBySign(sign, props.field_name);
          formValues.forEach((value) => {
            if (value == currentSign) {
              props.setValue(
                getFieldNameBySign(sign, props.field_name),
                e.target.value,
              );
            }
            setDateValue(e.target.value);
          });
        }}
      />
    </Card>
  );
}
