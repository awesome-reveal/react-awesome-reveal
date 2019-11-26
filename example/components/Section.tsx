import * as React from 'react';

const Section: React.FC = ({ children }) => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
};

export default Section;
