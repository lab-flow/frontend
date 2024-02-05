import { Names } from "../../api/common/dataNames";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import ReportBasic from "./ReportBasic";

export function ProjectProcedureReport() {
  return ReportBasic({
    report_title: Names.project_procedure_report,
    report_getter: (params) =>
      DataProviders.PROJECT_PROCEDURE_REPORT.getItemFile(undefined, params),
    report_file_name: Names.project_procedure_report_name,
  });
}

export function LabManagerReport() {
  return ReportBasic({
    report_title: Names.lab_manager_report,
    report_getter: (params) =>
      DataProviders.LAB_MANAGER_REPORT.getItemFile(undefined, params),
    report_file_name: Names.lab_manager_report_name,
  });
}

export function SanepidPipReport() {
  return ReportBasic({
    report_title: Names.sanepid_pip_report,
    report_getter: (params) =>
      DataProviders.SANEPID_PIP_REPORT.getItemFile(undefined, params),
    report_file_name: Names.sanepid_pip_report_name,
  });
}
