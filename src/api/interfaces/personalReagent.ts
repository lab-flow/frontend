export interface PersonalReagentInterface {
  id: number;
  reagent: {
    id: number;
    repr: string;
  };
  producer: {
    id: number;
    repr: string;
  };
  concentration: {
    id: number;
    repr: string;
  };
  purity_quality: {
    id: number;
    repr: string;
  };
  catalog_no: string;
  main_owner: {
    id: number;
    repr: string;
  };
  project_procedure: {
    id: number;
    repr: string;
  };
  project_procedure_manager_id: number;
  clp_classifications: Array<{
    id: number;
    repr: string;
  }>;
  precautionary_statements: Array<{
    id: number;
    repr: string;
  }>;
  hazard_statements: Array<{
    id: number;
    repr: string;
  }>;
  signal_word: string;
  is_usage_record_required: boolean;
  is_critical: boolean;
  lot_no: string;
  receipt_purchase_date: string;
  expiration_date: string;
  disposal_utilization_date: string;
  laboratory: string;
  room: string;
  detailed_location: string;
  is_usage_record_generated: boolean;
  is_archived: boolean;
  user_comment: string;
}

export interface PersonalReagentFormInterface {
  id: number;
  count: number;
  reagent: number;
  main_owner?: number;
  project_procedure: number;
  is_critical: boolean;
  lot_no: string;
  receipt_purchase_date: string;
  expiration_date?: string;
  disposal_utilization_date: string;
  laboratory: string;
  room: string;
  detailed_location: string;
  is_usage_record_generated?: boolean;
  is_archived?: boolean;
  user_comment: string;
}
