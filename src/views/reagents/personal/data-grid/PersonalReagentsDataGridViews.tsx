import { Box, Button } from "@mui/material";
import {
  DataProviders,
  getLogs,
} from "../../../../api/dataProviders/DataProvider.ts";
import { Names } from "../../../../api/common/dataNames";
import PersonalReagentsCommon from "./PersonalReagentsCommon";
import NewItemButton from "../../../../components/basic/NewItemButton";
import { showHistoryButton } from "../../../history/History";
import { useNavigate } from "react-router-dom";

export function PersonalReagentsMyArchived() {
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() =>
          navigate(`/${DataProviders.PERSONAL_REAGENTS_ME.endpoint}`)
        }
      >
        Przeglądaj aktualne
      </Button>
      <Box sx={{ m: 1 }} />
      <PersonalReagentsCommon
        query_key="PersonalReagentsMyArchived"
        query_fn={DataProviders.PERSONAL_REAGENTS_ME.getItemList}
        title={Names.archived + " - " + Names.my_personal_reagents}
        archived={true}
        meReagents={true}
        visible={{
          id: true,
          reagent: true,
          producer: true,
          project_procedure: true,
          is_critical: true,
          main_owner: false,
          catalog_no: true,
          clp_classifications: true,
          is_usage_record_generated: true,
          lot_no: true,
          receipt_purchase_date: true,
          expiration_date: true,
          disposal_utilization_date: true,
          laboratory: true,
          room: true,
          detailed_location: true,
          user_comment: true,
          signal_word: true,
          precautionary_statements: true,
          hazard_statements: true,
          concentration: true,
          actions: true,
          purity_quality: true,
        }}
        actions={{
          details: true,
          edit: true,
          restore_archive: true,
          generate_usage_record: true,
          reagent_request: false,
          change_main_owner: false,
          delete: false,
        }}
        filters={{
          laboratory: true,
          project_procedure: true,
          reagent_type: true,
          is_critical: true,
          user: false,
          expiration_date: true,
          receipt_purchase_date: true,
          reagent: true,
          producer: true,
          room: true,
          detailed_location: true,
          clp_classification: true,
          cas_no: true,
          is_usage_record_required: true,
          is_usage_record_generated: true,
        }}
        report_getter={(params) =>
          DataProviders.PERSONAL_VIEW_REPORT.getItemFile(undefined, params)
        }
      />
    </>
  );
}

export function PersonalReagentsMyActual() {
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() =>
          navigate(`/${DataProviders.PERSONAL_REAGENTS_ME.endpoint}/archived`)
        }
      >
        {Names.look_at_archived}
      </Button>
      <Box sx={{ m: 1 }} />
      <PersonalReagentsCommon
        query_key="PersonalReagentsMyActual"
        query_fn={DataProviders.PERSONAL_REAGENTS_ME.getItemList}
        title={
          <NewItemButton
            textBefore={Names.my_personal_reagents}
            href={`/${DataProviders.PERSONAL_REAGENTS.endpoint}/new`}
          />
        }
        archived={false}
        meReagents={true}
        visible={{
          id: true,
          reagent: true,
          producer: true,
          project_procedure: true,
          is_critical: true,
          main_owner: false,
          catalog_no: true,
          clp_classifications: true,
          is_usage_record_generated: true,
          lot_no: true,
          receipt_purchase_date: true,
          expiration_date: true,
          disposal_utilization_date: true,
          laboratory: true,
          room: true,
          detailed_location: true,
          user_comment: true,
          signal_word: true,
          precautionary_statements: true,
          hazard_statements: true,
          concentration: true,
          actions: true,
          purity_quality: true,
        }}
        actions={{
          details: true,
          edit: true,
          restore_archive: true,
          generate_usage_record: true,
          reagent_request: false,
          change_main_owner: false,
          delete: true,
        }}
        filters={{
          laboratory: true,
          project_procedure: true,
          reagent_type: true,
          is_critical: true,
          user: false,
          expiration_date: true,
          receipt_purchase_date: true,
          reagent: true,
          producer: true,
          room: true,
          detailed_location: true,
          clp_classification: true,
          cas_no: true,
          is_usage_record_required: true,
          is_usage_record_generated: true,
        }}
        report_getter={(params) =>
          DataProviders.PERSONAL_VIEW_REPORT.getItemFile(undefined, params)
        }
      />
    </>
  );
}

export function AllPersonalReagentsActualAdminView(props: {
  history: boolean;
  logsPage?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <>
      {!props.history && (
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            navigate(
              `/user-panel/${DataProviders.PERSONAL_REAGENTS.endpoint}-archived`,
            )
          }
        >
          {Names.look_at_archived}
        </Button>
      )}
      <Box sx={{ m: 1 }} />
      <PersonalReagentsCommon
        query_key="AllPersonalReagentsActualAdminView"
        query_fn={
          (props.history
            ? getLogs(DataProviders.PERSONAL_REAGENTS)
            : DataProviders.PERSONAL_REAGENTS
          ).getItemList
        }
        disableChips={props.history}
        history={props.history}
        logsPage={props.logsPage}
        title={
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {props.history ? (
              <>
                {Names.change_history} - {Names.personal_reagents}
              </>
            ) : (
              <NewItemButton
                textBefore={Names.personal_reagents}
                href={`/${DataProviders.PERSONAL_REAGENTS.endpoint}/new`}
              />
            )}
            {!props.history &&
              showHistoryButton(
                navigate,
                DataProviders.PERSONAL_REAGENTS.endpoint,
              )}
          </Box>
        }
        archived={false}
        visible={{
          id: true,
          reagent: true,
          producer: true,
          project_procedure: true,
          is_critical: true,
          main_owner: true,
          catalog_no: true,
          clp_classifications: true,
          is_usage_record_generated: true,
          lot_no: true,
          receipt_purchase_date: true,
          expiration_date: true,
          disposal_utilization_date: false,
          laboratory: true,
          room: true,
          detailed_location: true,
          user_comment: true,
          signal_word: false,
          precautionary_statements: false,
          hazard_statements: false,
          concentration: false,
          actions: true,
          purity_quality: false,
        }}
        actions={{
          details: true,
          edit: true,
          restore_archive: true,
          generate_usage_record: true,
          reagent_request: true,
          change_main_owner: true,
          delete: true,
        }}
        filters={{
          laboratory: true,
          project_procedure: true,
          reagent_type: true,
          is_critical: true,
          user: true,
          expiration_date: true,
          receipt_purchase_date: true,
          reagent: true,
          producer: true,
          room: true,
          detailed_location: true,
          clp_classification: true,
          cas_no: true,
          is_usage_record_required: true,
          is_usage_record_generated: true,
        }}
        report_getter={(params) =>
          DataProviders.ALL_REPORT.getItemFile(undefined, params)
        }
      />
    </>
  );
}

export function AllPersonalReagentsArchiveAdminView() {
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() =>
          navigate(`/user-panel/${DataProviders.PERSONAL_REAGENTS.endpoint}/`)
        }
      >
        Przeglądaj aktualne
      </Button>
      <Box sx={{ m: 1 }} />
      <PersonalReagentsCommon
        query_key="AllPersonalReagentsArchiveAdminView"
        query_fn={DataProviders.PERSONAL_REAGENTS.getItemList}
        title={Names.archived + " - " + Names.personal_reagents}
        archived={true}
        visible={{
          id: true,
          reagent: true,
          producer: true,
          project_procedure: true,
          is_critical: true,
          main_owner: true,
          catalog_no: true,
          clp_classifications: true,
          is_usage_record_generated: true,
          lot_no: true,
          receipt_purchase_date: true,
          expiration_date: true,
          disposal_utilization_date: false,
          laboratory: true,
          room: true,
          detailed_location: true,
          user_comment: true,
          signal_word: false,
          precautionary_statements: false,
          hazard_statements: false,
          concentration: false,
          actions: true,
          purity_quality: false,
        }}
        actions={{
          details: true,
          edit: true,
          restore_archive: true,
          generate_usage_record: true,
          reagent_request: true,
          change_main_owner: true,
          delete: true,
        }}
        filters={{
          laboratory: true,
          project_procedure: true,
          reagent_type: true,
          is_critical: true,
          user: true,
          expiration_date: true,
          receipt_purchase_date: true,
          reagent: true,
          producer: true,
          room: true,
          detailed_location: true,
          clp_classification: true,
          cas_no: true,
          is_usage_record_required: true,
          is_usage_record_generated: true,
        }}
        report_getter={(params) =>
          DataProviders.ALL_REPORT.getItemFile(undefined, params)
        }
      />
    </>
  );
}

export function AllPersonalReagentsActualUserView() {
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() =>
          navigate(
            `/user-panel/${DataProviders.PERSONAL_REAGENTS.endpoint}-archived`,
          )
        }
      >
        {Names.look_at_archived}
      </Button>
      <Box sx={{ m: 1 }} />
      <PersonalReagentsCommon
        query_key="AllPersonalReagentsActualUserView"
        query_fn={DataProviders.PERSONAL_REAGENTS.getItemList}
        title={
          <NewItemButton
            textBefore={Names.personal_reagents}
            href={`/${DataProviders.PERSONAL_REAGENTS.endpoint}/new`}
          />
        }
        archived={false}
        visible={{
          id: true,
          reagent: true,
          producer: true,
          project_procedure: true,
          is_critical: true,
          main_owner: true,
          catalog_no: true,
          clp_classifications: true,
          is_usage_record_generated: false,
          lot_no: false,
          receipt_purchase_date: false,
          expiration_date: true,
          disposal_utilization_date: false,
          laboratory: true,
          room: true,
          detailed_location: true,
          user_comment: false,
          signal_word: false,
          precautionary_statements: false,
          hazard_statements: false,
          concentration: false,
          actions: true,
          purity_quality: false,
        }}
        actions={{
          details: false,
          edit: false,
          restore_archive: false,
          generate_usage_record: false,
          reagent_request: true,
          change_main_owner: false,
          delete: false,
        }}
        filters={{
          laboratory: true,
          project_procedure: true,
          reagent_type: true,
          is_critical: true,
          user: false,
          expiration_date: true,
          receipt_purchase_date: true,
          reagent: true,
          producer: true,
          room: true,
          detailed_location: true,
          clp_classification: true,
          cas_no: true,
          is_usage_record_required: true,
          is_usage_record_generated: true,
        }}
        report_getter={(params) =>
          DataProviders.ALL_REPORT.getItemFile(undefined, params)
        }
      />
    </>
  );
}

export function AllPersonalReagentsArchiveUserView() {
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() =>
          navigate(`/user-panel/${DataProviders.PERSONAL_REAGENTS.endpoint}`)
        }
      >
        Przeglądaj aktualne
      </Button>
      <Box sx={{ m: 1 }} />
      <PersonalReagentsCommon
        query_key="AllPersonalReagentsArchiveUserView"
        query_fn={DataProviders.PERSONAL_REAGENTS.getItemList}
        title={Names.personal_reagents}
        archived={true}
        visible={{
          id: true,
          reagent: true,
          producer: true,
          project_procedure: true,
          is_critical: true,
          main_owner: true,
          catalog_no: true,
          clp_classifications: true,
          is_usage_record_generated: false,
          lot_no: false,
          receipt_purchase_date: false,
          expiration_date: true,
          disposal_utilization_date: false,
          laboratory: true,
          room: true,
          detailed_location: true,
          user_comment: false,
          signal_word: false,
          precautionary_statements: false,
          hazard_statements: false,
          concentration: false,
          actions: true,
          purity_quality: false,
        }}
        actions={{
          details: false,
          edit: false,
          restore_archive: false,
          generate_usage_record: false,
          reagent_request: true,
          change_main_owner: false,
          delete: false,
        }}
        filters={{
          laboratory: true,
          project_procedure: true,
          reagent_type: true,
          is_critical: true,
          user: false,
          expiration_date: true,
          receipt_purchase_date: true,
          reagent: true,
          producer: true,
          room: true,
          detailed_location: true,
          clp_classification: true,
          cas_no: true,
          is_usage_record_required: true,
          is_usage_record_generated: true,
        }}
        report_getter={(params) =>
          DataProviders.ALL_REPORT.getItemFile(undefined, params)
        }
      />
    </>
  );
}
