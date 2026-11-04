import type { ButtonHTMLAttributes } from "react";
import styles from "./Chip.module.css";

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  /** Figma "Chip" component: Default ↔ Selected (coral). */
  selected: boolean;
};

/** Filter chip. A toggle button, so screen readers hear "selected / not selected". */
export function Chip({ selected, className, ...rest }: ChipProps) {
  const classes = [styles.chip, selected && styles.selected, className].filter(Boolean).join(" ");
  return <button type="button" aria-pressed={selected} className={classes} {...rest} />;
}
