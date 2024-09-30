export interface Reagent {
  id?: number;
  producer_brand_name: string;
  producer_name: string;
  producer_abbreviation: string;
  name: string;
  concentration: number;
  purity: string;
  catalog_no: string;
  quantity: number;
  storing_temperature: string;
  is_disinfectant: boolean;
  is_kit: boolean;
  is_usage_record_required: boolean;
  is_validated_by_admin: boolean;
  safety_data_sheet: string;
  safety_instruction: string;
  comment: string;
  producer: number;
  unit: string;
  hazards: string[];
}

export interface PersonalReagent {
  id: number;
  reagent_name: string;
  username: string;
  lot_no: string;
  admission_date: string;
  opening_date: string;
  expiration_date: string;
  is_usage_record_generated: boolean;
  laboratory: string;
  room: string;
  location: string;
  is_archived: boolean;
  comment: string;
  reagent: number;
  producer_name: string;
  producer_abbreviation: string;
  producer_brand_name: string;
  count?: number; // only for form
}

export interface Unit {
  unit: string;
}

export interface Hazard {
  id: string;
  classification: string;
  group: string;
  pictogram: string;
  is_validated_by_admin: boolean;
  name: string;
  usages: string[];
}
