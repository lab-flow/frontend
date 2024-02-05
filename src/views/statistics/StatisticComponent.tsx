import "../../api/dataProviders/dataProviders";
import * as React from "react";
import { useEffect } from "react";
import GenericDataGrid from "../../components/datagrid/GenericDataGrid";
import Dropdown from "../../components/basic/Dropdown";
import { Names } from "../../api/common/dataNames";
import { Grid, Typography } from "@mui/material";

interface StatisticComponentProps {
  title: string;
  data: Array<object>;
}

function StatisticComponent(props: StatisticComponentProps) {
  const [dataToDisplay, setDataToDisplay] = React.useState<any>([]);
  const [filterTypes, setFilterTypes] = React.useState<any>({});
  const [filters, setFilters] = React.useState<any>({});

  useEffect(() => {
    const aggFields = props.data.map((item: any) => item.agg_fields);
    const aggFieldValues: { [key: string]: any } = {};
    const currentFilters: { [key: string]: any } = {};
    for (const item of aggFields) {
      Object.entries(item).forEach(([key, value]) => {
        aggFieldValues[key] = [
          ...new Set([...(aggFieldValues[key] || []), value]),
        ];
        currentFilters[key] = null;
      });
    }
    setFilterTypes(aggFieldValues);
    setFilters(currentFilters);
  }, [props.data]);

  useEffect(() => {
    const filteredData = props.data.filter((item: any) => {
      return Object.entries(filters).every(([key, value]) => {
        return item.agg_fields[key] === value;
      });
    });
    const filteredDataFlat = filteredData.map((item: any) => item.data).flat();
    setDataToDisplay(filteredDataFlat);
  }, [filters, props.data]);

  const setSingleFilter = (fieldName: any, fieldValue: any) => {
    setFilters({
      ...filters,
      [fieldName]: fieldValue,
    });
  };

  const getFilterComponent = (
    name: string,
    values: unknown,
    currentValue: string | string[] | undefined,
    setValue: {
      (fieldName: any, fieldValue: any): void;
      (arg0: any, arg1: string): void;
    },
  ) => {
    return (
      <Dropdown
        required
        label={Names[name as keyof typeof Names] || name}
        value={currentValue}
        onChange={(e) => {
          setValue(name, e.target.value);
        }}
        width="300px"
        id={name}
        items={
          (values as Array<string>).map((item: string) => ({
            name: item,
            value: item,
          })) || []
        }
      />
    );
  };
  const isDataEmpty = props.data?.length === 0;
  const showData = dataToDisplay?.length > 0;

  return (
    <>
      <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
        {Object.entries(filterTypes).map(([key, values]) => {
          return (
            <Grid item key={key}>
              {getFilterComponent(key, values, filters[key], setSingleFilter)}
            </Grid>
          );
        })}
      </Grid>
      {isDataEmpty ? (
        <Typography>
          <i>{Names.no_data_to_show}</i>
        </Typography>
      ) : !showData ? (
        <Typography>
          <i>{Names.fill_filters_to_show_data}</i>
        </Typography>
      ) : (
        <GenericDataGrid
          data={dataToDisplay.map((item: any, index: number) => ({
            lp: index + 1,
            ...item,
          }))}
          getRowId={(row: object) => (row as { lp: string }).lp.toString()}
          isLoading={false}
        />
      )}
    </>
  );
}

export default StatisticComponent;
