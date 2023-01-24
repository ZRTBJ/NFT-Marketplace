import { useState, useEffect } from 'react';
import AllTab from './components/Tab/AllTab';
import VideoTab from './components/Tab/VideoTab';
import AudioTab from './components/Tab/AudioTab';
import ImageTab from './components/Tab/ImageTab';
import FilesTab from './components/Tab/FilesTab';
import DropdownCreabo from 'components/Commons/Dropdown';
const sortingOptions = [
  { id: 1, value: '', name: 'Sort By' },
  { id: 2, value: 'newer', name: 'Newer' },
  { id: 3, value: 'older', name: 'Older' },
];
export default function TabComponents({ project }) {
  const [tabs, setTabs] = useState([
    { id: 1, label: 'ALL', length: 0 },
    { id: 2, label: 'Video', length: 0 },
    { id: 3, label: 'Audio', length: 0 },
    { id: 4, label: 'Image', length: 0 },
    { id: 5, label: 'Files', length: 0 },
  ]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedSort, setSelectedSort] = useState('');
  const OnSorting = async (event) => {
    setSelectedSort(event.target.value);
  };
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    if (
      (selectedSort && selectedSort === '2') ||
      (selectedSort && selectedSort === '3')
    ) {
      setSortBy(selectedSort === '2' ? 'newer' : 'older');
    }
  }, [selectedSort]);

  return (
    <div>
      <div className='block ml-auto w-[100px] my-4'>
        <DropdownCreabo
          label=''
          value={selectedSort}
          id='sort-token-gated-content'
          defaultValue={'Sort By'}
          handleChange={(e) => OnSorting(e)}
          options={sortingOptions}
          disabled={project?.contents?.length === 0}
        />
      </div>
      <div className='mb-4 px-4 '>
        <ul
          className='flex flex-wrap gap-x-2 gap-y-4 border-b  border-b-[2px] text-sm font-medium text-center '
          id='myTab'
          data-tabs-toggle='#token-gated-public-project'
          role='tablist'
        >
          {tabs.map((tab) => {
            return (
              <li
                className=''
                role='presentation'
                onClick={() => setSelectedTab(tab.id)}
                key={tab.id}
              >
                <button
                  className={`inline-block py-2 md:p-4 md:text-lg rounded-t-lg ${
                    selectedTab === tab.id
                      ? ' border-textSubtle text-txtblack'
                      : 'border-transparent text-textSubtle'
                  } hover:text-txtblack  font-black`}
                  id='membership_nft'
                  data-tabs-target='#membership_nft'
                  type='button'
                  role='tab'
                  aria-controls='MembershipNFT'
                  aria-selected='true'
                >
                  {tab.label}
                  <span className='bg-color-ass-7/[0.4] rounded p-2 ml-2 font-normal'>
                    0
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div id='token-gated-public-project'>
        {selectedTab === 1 && (
          <AllTab project={project} sortBy={sortBy} key={sortBy} />
        )}
        {selectedTab === 2 && (
          <VideoTab project={project} sortBy={sortBy} key={sortBy} />
        )}
        {selectedTab === 3 && (
          <AudioTab project={project} sortBy={sortBy} key={sortBy} />
        )}
        {selectedTab === 4 && (
          <ImageTab project={project} sortBy={sortBy} key={sortBy} />
        )}
        {selectedTab === 5 && (
          <FilesTab project={project} sortBy={sortBy} key={sortBy} />
        )}
      </div>
    </div>
  );
}
