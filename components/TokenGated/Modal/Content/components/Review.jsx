import React from 'react';
import SettingContent from './SettingContent';
import Configuration from './Configuration';

const Review = ({ content, configurations, options }) => {
  return (
    <div>
      <SettingContent content={content} reviewScreen={true} />
      <Configuration
        content={content}
        configurations={configurations}
        options={options}
        reviewScreen={true}
      />
    </div>
  );
};

export default Review;
