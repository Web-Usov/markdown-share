export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onScroll?: (event: Event) => void;
}
