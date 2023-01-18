import { useState, useEffect } from 'react';
import AllTab from './components/Tab/AllTab';
import VideoTab from './components/Tab/VideoTab';
import AudioTab from './components/Tab/AudioTab';
import ImageTab from './components/Tab/ImageTab';
import FilesTab from './components/Tab/FilesTab';
export default function TabComponents({ project }) {
  const [tabs, setTabs] = useState([
    { id: 1, label: 'ALL', length: 0 },
    { id: 2, label: 'Video', length: 0 },
    { id: 3, label: 'Audio', length: 0 },
    { id: 4, label: 'Image', length: 0 },
    { id: 5, label: 'Files', length: 0 },
  ]);
  const [selectedTab, setSelectedTab] = useState(1);
  return (
    <div>
      <div className='mb-4'>
        <ul
          className='flex flex-wrap  border-b  border-b-[2px] text-sm font-medium text-center '
          id='myTab'
          data-tabs-toggle='#token-gated-public-project'
          role='tablist'
        >
          {tabs.map((tab) => {
            return (
              <li
                className='mr-2'
                role='presentation'
                onClick={() => setSelectedTab(tab.id)}
                key={tab.id}
              >
                <button
                  className={`inline-block py-2 md:p-4 md:text-lg rounded-t-lg ${
                    selectedTab === tab.id
                      ? 'border-b-2 border-primary-900 text-primary-900'
                      : 'border-transparent text-textSubtle'
                  } hover:text-primary-600`}
                  id='membership_nft'
                  data-tabs-target='#membership_nft'
                  type='button'
                  role='tab'
                  aria-controls='MembershipNFT'
                  aria-selected='true'
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div id='token-gated-public-project'>
        {selectedTab === 1 && <AllTab project={project} />}
        {selectedTab === 2 && <VideoTab project={project} />}
        {selectedTab === 3 && <AudioTab project={project} />}
        {selectedTab === 4 && <ImageTab project={project} />}
        {selectedTab === 5 && <FilesTab project={project} />}
      </div>
    </div>
  );
}
