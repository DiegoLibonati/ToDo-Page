// interface DefaultProps {
//   className?: string;
//   children?: string;
// }

export interface MenuProps {
  id: string;
  title: string;
}

export interface TaskProps {
  id: string;
  category: string;
  complete: boolean;
  text: string;
}
