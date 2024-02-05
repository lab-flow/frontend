export interface HazardStatementsInterface {
  id: number;
  pictogram: {
    id: number;
    repr: string;
  };
  clp_classification: {
    id: number;
    repr: string;
  };
  hazard_class: string;
  hazard_category: string;
  hazard_and_category_code: string;
  signal_word: string;
  code: string;
  phrase: string;
  is_usage_record_required: boolean;
}

export interface HazardStatementsFormInterface {
  id: number;
  pictogram: number;
  clp_classification: number;
  hazard_class: string;
  hazard_category: string;
  hazard_and_category_code: string;
  signal_word: string;
  code: string;
  phrase: string;
  is_usage_record_required: boolean;
}
