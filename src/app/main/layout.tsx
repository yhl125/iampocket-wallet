import Header from '@/components/GlobalHeader';
import theme from '@/styles/theme';
import React from 'react';

import styles from './styles.module.css';

interface IProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: IProps) => {
  return (
    <div>
      <Header />
      <main className={styles.contentWrapper}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
