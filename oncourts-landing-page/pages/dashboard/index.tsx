import { NextPage } from 'next';
import React from 'react';

const Dashboard: NextPage = () => {
  return (
    <>
      <div className="bg-white">
        <iframe 
          src="https://oncourts.kerala.gov.in/pucar-dashboard/public/dashboard/9b1eaaa1-9f5c-415e-81db-6e8c2388ad0c"
          className="w-full border-0" 
          style={{ height: '100vh' }}
          title="OnCourts Dashboard"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </div>
    </>
  );
};

export default Dashboard;
