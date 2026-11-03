import type { ReactNode } from "react";
import styles from "./Screen.module.css";

/** Full-height phone column shared by every screen (24px sides, 60/36 top/bottom, 16px gap). */
export function Screen({ children }: { children: ReactNode }) {
  return <main className={styles.screen}>{children}</main>;
}

/** Flexible empty space, like the "spacer" frames in Figma. */
export function Spacer() {
  return <div className={styles.spacer} />;
}
