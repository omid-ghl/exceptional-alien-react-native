import { NominationFrom } from "@/Containers/settings/Screens/Nominate";
import { ListRenderItem } from "react-native";

declare namespace INominateForm {
  type IProps = {
    forms: Array<NominationFrom>;
    currentTab: number;
    renderTag: ListRenderItem<NominationFrom>;
    nominatingSuccesfuly: (boolean) => void;
  };
  type GemFormState = {
    name: string;
    address: string;
    city: string;
    reason: string;
  };
}

export {INominateForm};
