declare namespace IInterest {
  type IProps = {
    text: string;
    imageUrl: string | null;
    selected?: boolean;
    onPress: () => void;
  };
}

export {IInterest};
