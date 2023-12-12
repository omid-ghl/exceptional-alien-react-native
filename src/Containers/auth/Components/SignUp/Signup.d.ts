declare namespace ISignup {
  type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    subscribe: boolean;
    agree: boolean;
  };
  type IProps = {};
}

export {ISignup};
