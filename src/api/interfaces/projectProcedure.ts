export interface ProjectProcedureInterface {
  id: number;
  manager: {
    id: number;
    repr: string;
  };
  workers: Array<{
    id: number;
    repr: string;
  }>;
  name: string;
  is_validated_by_admin: boolean;
}
