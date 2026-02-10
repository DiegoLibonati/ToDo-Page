export interface Component {
  cleanup?: () => void;
}

export interface MenuComponent extends Component, HTMLDivElement {}
export interface TaskComponent extends Component, HTMLLIElement {}
