export interface ButtonVariant {
  primary: string;
  secondary: string;
}

export interface ButtonProps {
  variant: ButtonVariant;
  disabled: boolean;
  onClick: () => void;
}

export interface EmptyMessageProps {
  message: string;
}