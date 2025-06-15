
import React from 'react';
import { useParams } from 'react-router-dom';

const ProgramDetails = () => {
  const { programId } = useParams();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">Program Details</h1>
      <p>Details for program {programId} will be shown here.</p>
    </div>
  );
};

export default ProgramDetails;
