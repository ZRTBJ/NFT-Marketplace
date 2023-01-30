import React, { useEffect, useState } from 'react';
import {
  getTokenGatedProject,
  getContentList,
} from 'services/tokenGated/tokenGatedService';
import Image from 'next/image';
import thumbIcon from 'assets/images/profile/card.svg';
import SocialLink from 'components/Commons/SocialLink';
import SettingModal from 'components/TokenGated/Modal/Setting';
import { useRouter } from 'next/router';
import AddNewContentModal from 'components/TokenGated/Modal/Content/AddNewContent';
import UploadByLinkModal from 'components/TokenGated/Modal/UploadByLink';
import DropdownCreabo from 'components/Commons/Dropdown';
import CreatorProjectInfoCard from 'components/TokenGated/ProjectInfoCard/Creator';
import ContentListTable from 'components/TokenGated/ContentListTable';
import { isValidURL } from 'util/functions';

const sortingOptions = [
  { id: 1, value: '', name: 'Sort By' },
  { id: 2, value: 'newer', name: 'Newer' },
  { id: 3, value: 'older', name: 'Older' },
];
export default function TokenGatedContent({ query, createMode }) {
  const router = useRouter();
  const [showOverLayLoading, setShowOverLayLoading] = useState(false);
  const [project, setProject] = useState({});
  const [showAddNewContentModal, setShowAddNewContentModal] = useState(false);
  const [showUploadByLinkModal, setShowUploadByLinkModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [contentList, setContentList] = useState({});
  const [linkDetails, setLinkDetails] = useState({ link: '', type: 'image' });
  const [linkError, setLinkError] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [payload, setPayload] = useState({
    id: query?.id,
    page: 1,
    orderBy: 'newer',
    limit: 20,
  });
  const [showConfigure, setShowConfigure] = useState(null);

  const handleLinkDetails = (e) => {
    if (e.target.value.length && e.target.name === 'link') {
      if (isValidURL(e.target.value)) {
        setLinkError(false);
      } else {
        setLinkError(true);
      }
    } else {
      setLinkError(false);
    }
    setLinkDetails({ ...linkDetails, [e.target.name]: e.target.value });
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!linkError) {
      setShowAddNewContentModal(true);
      setShowUploadByLinkModal(false);
    }
  };

  const onGetTokenGatedProject = async () => {
    setShowOverLayLoading(true);
    let projectInfo = '';
    await getTokenGatedProject(payload?.id)
      .then((res) => {
        if (res.code === 0) {
          let response = { ...res?.token_gate_project };
          let photo = response?.assets?.find(
            (x) => x?.asset_purpose === 'subphoto'
          );
          let cover = response?.assets?.find(
            (x) => x?.asset_purpose === 'cover'
          );
          response.coverUrl = cover ? cover?.path : null;
          response.photoUrl = photo ? photo?.path : null;
          try {
            const links = JSON.parse(response?.links);
            response.links = links;
          } catch (error) {
            response.links = [
              { title: 'linkInsta', icon: 'instagram', value: '' },
              { title: 'linkGithub', icon: 'github', value: '' },
              { title: 'linkTwitter', icon: 'twitter', value: '' },
              { title: 'linkFacebook', icon: 'facebook', value: '' },
              { title: 'customLinks1', icon: 'link', value: '' },
            ];
          }
          setProject(response);
          projectInfo = response;
        } else {
          setShowOverLayLoading(false);
        }
      })
      .catch((err) => {
        setShowOverLayLoading(false);
      });
    await onContentListGet(payload?.id, projectInfo);
  };
  const onAddNewContentClick = async () => {
    setShowAddNewContentModal(true);
  };
  const onUploadByLinkClick = async () => {
    setShowUploadByLinkModal(true);
  };
  const OnSorting = async (event) => {
    setSelectedSort(event.target.value);
  };
  const onSettingSaved = async (id) => {
    await onGetTokenGatedProject(id);
    if (createMode) {
      router.replace(`/token-gated/${id}`);
    }
  };
  const onContentListGet = async (projectInfo) => {
    await getContentList(payload)
      .then((res) => {
        setShowOverLayLoading(false);
        if (res.code === 0) {
          if (res?.data?.length > 0) {
            res?.data?.forEach((element) => {
              element.isChecked = false;
            });
          }
          const projectWithContent = { ...projectInfo, contents: res?.data };
          setContentList(projectWithContent);
        }
      })
      .catch((error) => {
        console.log(error);
        setShowOverLayLoading(false);
      });
  };

  useEffect(() => {
    onGetTokenGatedProject();
  }, [payload]);

  useEffect(() => {
    if (
      (selectedSort && selectedSort === '2') ||
      (selectedSort && selectedSort === '3')
    ) {
      setSortBy(selectedSort === '2' ? 'newer' : 'older');
    }
  }, [selectedSort]);
  useEffect(() => {
    if (sortBy) {
      let oldPayload = { ...payload };
      oldPayload.orderBy = sortBy;
      setPayload(oldPayload);
    }
  }, [sortBy]);

  return (
    <>
      {showOverLayLoading && <div className='loading'></div>}
      {!showOverLayLoading && (
        <div className='py-4 px-4 md:px-0'>
          <CreatorProjectInfoCard
            project={project}
            createMode={createMode}
            settingSaved={onSettingSaved}
          />
          <div className='flex flex-wrap gap-4 items-start my-4 md:my-[50px]'>
            <div className='flex flex-wrap gap-4 items-start md:flex-1'>
              <button
                onClick={() => onAddNewContentClick()}
                className='py-2 px-4 border   bg-primary-900/[0.10] text-primary-900 font-bold rounded'
              >
                <i className='fa-solid fa-square-plus mr-2'></i>
                Add New Content
              </button>
              <button
                onClick={() => onUploadByLinkClick()}
                className='py-2 px-4 border  border-primary-900 text-primary-900 font-bold rounded'
              >
                <i className='fa-solid fa-upload mr-2'></i>
                Upload By Link
              </button>
            </div>
            <div className='min-w-[100px]'>
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
          </div>
          <ContentListTable
            projectInfo={contentList}
            createMode={createMode}
            onContentPublished={() => onGetTokenGatedProject(query?.id)}
            onContentDelete={() => onGetTokenGatedProject(query?.id)}
            tokenProjectId={query?.id}
          ></ContentListTable>
        </div>
      )}
      {showAddNewContentModal && (
        <AddNewContentModal
          show={showAddNewContentModal}
          handleClose={() => {
            setShowAddNewContentModal(false);
            setLinkDetails({ link: '', type: 'image' });
          }}
          tokenProjectId={query?.id}
          onContentAdded={() => onGetTokenGatedProject(query?.id)}
          setShowUploadByLinkModal={setShowUploadByLinkModal}
          linkDetails={linkDetails}
        />
      )}
      {showUploadByLinkModal && (
        <UploadByLinkModal
          show={showUploadByLinkModal}
          handleClose={() => setShowUploadByLinkModal(false)}
          handleLinkDetails={handleLinkDetails}
          linkDetails={linkDetails}
          handleAddLink={handleAddLink}
          linkError={linkError}
        />
      )}
    </>
  );
}
