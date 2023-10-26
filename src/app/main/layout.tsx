import Header from '@/components/GlobalHeader';
import React from 'react';

import styles from './styles.module.css';

interface IProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: IProps) => {
  return (
    <div>
      <Header/>
      <main className={styles.contentWrapper}>
        <div className={styles.left}>
          <span className={styles.title}> 
            Welcome! <br/>
            You can use  <span className={styles.titleBlue}> iamPocket</span>
          </span>
        </div>
        <div className={styles.right}>
          {children}
        </div>
      </main>
    </div>
  );
};



export default MainLayout;

