import React from 'react';

const MainPageLayout = (children: React.ReactNode) => {
  return (
    <div className="flex h-2/5 h-3/5 w-1/5 flex-col rounded-lg border-4">
      {children}
    </div>
  );
};

export default MainPageLayout;
