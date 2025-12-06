import { InputHTMLAttributes } from 'react';
import styles from './Slider.module.css';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
}

export function Slider({ label, showValue = true, className = '', ...props }: SliderProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input type="range" className={styles.slider} {...props} />
      {showValue && props.value !== undefined && (
        <div className={styles.value}>{props.value}x</div>
      )}
    </div>
  );
}
