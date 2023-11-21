import Header from '@/components/GlobalHeader';
import React from 'react';

import styles from './styles.module.css';

interface IProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: IProps) => {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
