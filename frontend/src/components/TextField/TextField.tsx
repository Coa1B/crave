import { useId, type ComponentPropsWithRef } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export function TextField({ label, id, className, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input id={inputId} className={styles.input} {...rest} />
    </div>
  );
}
