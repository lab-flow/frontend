export interface ReagentInterface {
  id: number;
  type: {
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
  unit: {
    id: number;
    repr: string;
  };
  purity_quality: {
    id: number;
    repr: string;
  };
  storage_conditions: Array<{
    id: number;
    repr: string;
  }>;
  hazard_statements: Array<{
    id: number;
    repr: string;
  }>;
  precautionary_statements: Array<{
    id: number;
    repr: string;
  }>;
  name: string;
  catalog_no: string;
  volume: number;
  safety_data_sheet: string;
  safety_instruction: string;
  safety_instruction_name: string;
  safety_data_sheet_name: string;
  cas_no: string;
  other_info: string;
  kit_contents: string;
  is_usage_record_required: boolean;
  is_validated_by_admin: boolean;
}

export interface ReagentFormInterface {
  type: number;
  producer: number;
  concentration: number;
  unit: number;
  purity_quality: number;
  storage_conditions: Array<number>;
  hazard_statements: Array<number>;
  precautionary_statements: Array<number>;
  name: string;
  catalog_no: string;
  volume: number;
  safety_data_sheet?: string;
  safety_instruction?: string;
  safety_instruction_name: string;
  safety_data_sheet_name: string;
  cas_no: string;
  other_info: string;
  kit_contents: string;
  is_usage_record_required: boolean;
  is_validated_by_admin?: boolean;
}
