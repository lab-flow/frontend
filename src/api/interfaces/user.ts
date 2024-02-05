export interface UserInterface {
  email: string;
  first_name: string;
  id: number;
  is_staff: boolean;
  lab_roles: Array<string>;
  last_login: string;
  last_name: string;
  username: string;
}

export interface UserFormInterface {
  email: string;
  first_name: string;
  lab_roles: Array<string>;
  last_name: string;
  password: string;
  passwordConfirm: string;
  username: string;
}
