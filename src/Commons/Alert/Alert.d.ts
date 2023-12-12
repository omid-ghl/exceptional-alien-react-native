declare namespace IAlert {
  interface IProps {
    title: string;
    description: string;
    actions: {
      onSuccess: {
        title: string;
        task: () => {} | any;
      };
      onFailure: {
        title: string;
        task: () => {} | any;
      };
    };
  }
}

export {IAlert};
