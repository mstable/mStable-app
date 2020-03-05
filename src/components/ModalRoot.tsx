import React, { FC } from 'react';
import styles from './ModalRoot.module.css';

export const ModalRoot: FC<{}> = ({ children }) => (
  <div className={styles.modalRoot} id="modal-root">
    {children}
  </div>
);
