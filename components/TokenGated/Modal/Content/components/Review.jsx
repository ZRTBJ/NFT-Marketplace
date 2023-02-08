import React from 'react';
import SettingContent from './SettingContent';
import Configuration from './Configuration';

const Review = ({ content, configurations, options, linkDetails }) => {
  let finalConfigs = configurations.filter(
    (config) => config.collectionAddress
  );

  return (
    <div>
      <SettingContent
        content={content}
        reviewScreen={true}
        linkDetails={linkDetails}
      />
      <Configuration
        content={content}
        configurations={finalConfigs}
        options={options}
        reviewScreen={true}
      />
    </div>
  );
};

export default Review;
