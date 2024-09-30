import { Controller, useForm } from "react-hook-form";

import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Button from "@mui/material/Button";
import Dropdown from "../../components/basic/Dropdown";
import { StyledForm } from "../../components/basic/StyledForm";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { useQuery } from "react-query";
import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { getSignalWordName, SignalWord } from "../../api/enums/signalWords";

import AddPictograms from "../pictograms/AddPictograms";
import NewItemPopup from "../../components/basic/NewItemPopup";
import AddClpClassification from "../clp-classifications/AddClpClassification";
import { HazardStatementsFormInterface } from "../../api/interfaces/hazardStatements.ts";
import { useState } from "react";
import { AxiosResponse } from "axios";
import { ClpClassificationInterface } from "../../api/interfaces/clpClassification.ts";

interface HazardStatementFormProps {
  onSubmit: (data: HazardStatementsFormInterface) => void;
  defaultValues?: HazardStatementsFormInterface;
  setOpen?: (value: boolean) => void;
  edit?: boolean;
}

function HazardStatementForm(props: HazardStatementFormProps) {
  const { control, handleSubmit } = useForm<HazardStatementsFormInterface>({
    defaultValues: { ...props.defaultValues },
  });

  const { data: clpClassificationData, refetch: clpClassificationRefetch } =
    useQuery("getCLPClassificationData", () =>
      DataProviders.CLP_CLASSIFICATIONS.getItemList(0, 0, true),
    );
  const [clpClassification, setClpClassification] = useState<string>(
    props.defaultValues?.clp_classification as unknown as string,
  );

  const { data: pictogramsData, refetch: pictogramsRefetch } = useQuery(
    "getPictogramsData",
    () => DataProviders.PICTOGRAMS.getItemList(0, 0, true),
  );
  const [pictogram, setPictogram] = useState<string>(
    props.defaultValues?.pictogram as unknown as string,
  );

  const signalWords = Object.keys(SignalWord).map((key) => ({
    // eslint-disable-next-line
    // @ts-ignore
    name: getSignalWordName(SignalWord[key]),
    // eslint-disable-next-line
    // @ts-ignore
    value: SignalWord[key],
  }));
  const [signalWord, setSignalWord] = useState(
    props.defaultValues?.signal_word,
  );

  return (
    <>
      <StyledForm>
        <Controller
          control={control}
          name="hazard_class"
          render={({ field }) => (
            <TextField
              sx={{ width: "100%" }}
              label={Names.hazard_class}
              required
              {...field}
            />
          )}
        />
        <Box sx={{ display: "flex" }}>
          <Controller
            control={control}
            name="clp_classification"
            render={({ field }) => (
              <Dropdown
                label={Names.clp_classification}
                value={clpClassification}
                onChange={(e) => {
                  setClpClassification(e.target.value);
                  field.onChange(e);
                }}
                id="clp_classification"
                items={
                  (clpClassificationData as AxiosResponse)?.data?.map(
                    (item: ClpClassificationInterface) => ({
                      name: item.clp_classification,
                      value: item.id,
                    }),
                  ) || []
                }
              />
            )}
          />
          <NewItemPopup
            formComponent={(setOpen) => (
              <AddClpClassification
                setOpen={setOpen}
                refetch={clpClassificationRefetch}
              />
            )}
          />
        </Box>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Controller
            control={control}
            name="pictogram"
            render={({ field }) => (
              <Dropdown
                label={Names.pictogram}
                value={pictogram}
                onChange={(e) => {
                  setPictogram(e.target.value);
                  field.onChange(e);
                }}
                id="pictogram"
                items={
                  // eslint-disable-next-line
                  // @ts-ignore
                  pictogramsData?.data?.map((item) => ({
                    name: item.id,
                    value: item.id,
                    image: item.pictogram,
                  })) || []
                }
              />
            )}
          />
          <NewItemPopup
            formComponent={(setOpen) => (
              <AddPictograms setOpen={setOpen} refetch={pictogramsRefetch} />
            )}
          />
        </div>
        <Controller
          control={control}
          name="hazard_category"
          render={({ field }) => (
            <TextField
              sx={{ width: "100%" }}
              label={Names.hazard_category}
              required
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="hazard_and_category_code"
          render={({ field }) => (
            <TextField
              sx={{ width: "100%" }}
              label={Names.hazard_and_category_code}
              required
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="signal_word"
          render={({ field }) => (
            <Dropdown
              label={Names.signal_word}
              value={signalWord}
              onChange={(e) => {
                setSignalWord(e.target.value);
                field.onChange(e);
              }}
              id="group"
              items={signalWords}
            />
          )}
        />
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <TextField sx={{ width: "100%" }} label={Names.code} {...field} />
          )}
        />
        <Controller
          control={control}
          name="phrase"
          render={({ field }) => (
            <TextField sx={{ width: "100%" }} label={Names.phrase} {...field} />
          )}
        />
        <Controller
          control={control}
          name="is_usage_record_required"
          render={({ field }) => (
            <FormControlLabel
              sx={{ width: "100%" }}
              control={
                <Checkbox
                  defaultChecked={props.defaultValues?.is_usage_record_required}
                  {...field}
                />
              }
              label={Names.is_usage_record_required}
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
    </>
  );
}

export default HazardStatementForm;
