import {Gem} from '@/Models';
declare namespace IAddGemsModal {
  interface IProps {
    gems: Gem[];
    playbook_id?: number;
    playbook_name?: string;
  }
}

export {IAddGemsModal};
