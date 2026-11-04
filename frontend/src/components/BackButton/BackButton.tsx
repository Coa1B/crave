import backIcon from "../../assets/icons/back.svg";
import styles from "./BackButton.module.css";

type BackButtonProps = {
  label?: string;
  onClick: () => void;
};

export function BackButton({ label = "Back", onClick }: BackButtonProps) {
  return (
    <button type="button" className={styles.back} onClick={onClick}>
      <img src={backIcon} width={22} height={22} alt="" />
      {label}
    </button>
  );
}
