import React, { useEffect, useState } from 'react';
import { getTokenGatedProject } from 'services/tokenGated/tokenGatedService';
import Image from 'next/image';
import thumbIcon from 'assets/images/profile/card.svg';
import SocialLink from 'components/Commons/SocialLink';
import SettingModal from 'components/TokenGated/Modal/Setting';
import AddNewContentModal from 'components/TokenGated/Modal/AddNewContent';
import UploadByLinkModal from 'components/TokenGated/Modal/UploadByLink';
import DropdownCreabo from 'components/Commons/Dropdown';
import emptyStateSvg from 'assets/images/token-gated/emptyState.svg';
import { useDropzone } from 'react-dropzone';
import PublishContentModal from 'components/TokenGated/Modal/PublishContent';
import ConfigContentModal from 'components/TokenGated/Modal/ConfigContent';
import DeleteContentModal from 'components/TokenGated/Modal/DeleteContent';
const sortingOptions = [
  { id: 1, value: '', name: 'Sort By' },
  { id: 2, value: 'newer', name: 'Newer' },
  { id: 3, value: 'older', name: 'Older' },
];
export default function TokenGatedContent({ query }) {
  const [showOverLayLoading, setShowOverLayLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showAddNewContentModal, setShowAddNewContentModal] = useState(false);
  const [showUploadByLinkModal, setShowUploadByLinkModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [isAllContentsChecked, setIsAllContentsChecked] = useState(false);
  const [selectedContents, setSelectedContents] = useState([]);
  const [showPublishContentModal, setShowPublishContentModal] = useState(false);
  const [showConfigContentModal, setShowConfigContentModal] = useState(false);
  const [showDeleteContentModal, setShowDeleteContentModal] = useState(false);
  const [lastSelectedContents, setLastSelectedContents] = useState([]);

  const onGetTokenGatedProject = async () => {
    setShowOverLayLoading(true);
    await getTokenGatedProject(query?.id)
      .then((res) => {
        setShowOverLayLoading(false);
        res?.contents?.forEach((element) => {
          element.isChecked = false;
        });
        setProject(res);
      })
      .catch((err) => {
        setShowOverLayLoading(false);
      });
  };
  const onSettingClick = async () => {
    setShowSettingModal(true);
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
  const onDrop = async (e) => {
    console.log(e, 'dropped');
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  const onAllContentCheckedChange = (e) => {
    setIsAllContentsChecked((previous) => !previous);
  };
  const onSingleContentCheckedChange = (event, index) => {
    let oldProject = { ...project };
    oldProject.contents[index].isChecked = !event;
    setProject(oldProject);
    const checked = oldProject?.contents?.filter((c) => c.isChecked === true);
    setSelectedContents(checked);
  };

  const onContentActions = async (content, actionName) => {
    let list = [];
    if (typeof content === 'object') {
      list.push(content);
    } else {
      list = content;
    }
    setLastSelectedContents(list);
    if (actionName === 'publish') {
      setShowPublishContentModal(true);
    } else if (actionName === 'configure') {
      setShowConfigContentModal(true);
    } else if (actionName === 'delete') {
      setShowDeleteContentModal(true);
    }
  };

  useEffect(() => {
    onGetTokenGatedProject();
  }, [query?.id]);

  useEffect(() => {
    if (project && project?.contents?.length > 0) {
      let oldProject = { ...project };
      oldProject?.contents?.forEach((element) => {
        element.isChecked = isAllContentsChecked;
      });
      setProject(oldProject);
      const checked = oldProject?.contents?.filter((c) => c.isChecked === true);
      setSelectedContents(checked);
    }
  }, [isAllContentsChecked]);

  return (
    <>
      {showOverLayLoading && <div className='loading'></div>}
      {project && (
        <div className='py-4 px-4 md:px-0'>
          {/* project info start */}
          <div className='flex flex-wrap gap-4 items-start border border-divider rounded p-4'>
            <div className='flex flex-wrap items-start gap-4'>
              <div>
                <Image
                  className='h-[81px] w-[81px] rounded object-cover'
                  src={thumbIcon}
                  alt='token gated project logo'
                  width={81}
                  height={81}
                />
              </div>
              <div>
                <p className='text-[18px] text-txtblack font-black'>
                  {project?.name ? project?.name : 'Unnamed Project'}
                </p>
                <p className='text-textSubtle text-[12px] w-full md:max-w-[471px]'>
                  {project?.description
                    ? project?.description
                    : 'Add description about this project so that people can understand more easily'}
                </p>
                <div className='mt-3'>
                  <SocialLink links={project?.links} forTokenGated={true} />
                </div>
              </div>
            </div>
            <div className='md:ml-auto'>
              <button
                onClick={() => onSettingClick()}
                className='py-2 px-4 border  border-divider text-txtblack  font-bold rounded'
              >
                <i className='fa-solid fa-gear mr-2'></i>
                Setting
              </button>
            </div>
          </div>
          {/* project info end */}

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

          {/* multiple action start */}
          {selectedContents.length > 0 && (
            <div className='text-white-shade-900 mt-10 flex flex-wrap items-center'>
              <div className='bg-txtblack border-r border-white-shade-900 py-6 px-7'>
                {selectedContents.length} Selected
              </div>
              <div className='flex-1 flex flex-wrap items-center gap-20 bg-txtblack py-6 px-7'>
                {/* edit */}
                <div className='token-gated-dropdown relative'>
                  <button className='flex transition duration-150 ease-in-out   focus:outline-none focus:border-none '>
                    <span className='mr-2'>Edit</span>
                    <i className='fa-solid fa-chevron-down mt-[2px]'></i>
                  </button>
                  <div className='opacity-0 text-[14px] invisible token-gated-dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95'>
                    <div className='absolute left-0 w-56 mt-[1.5rem] origin-top-right bg-txtblack    outline-none'>
                      <div className='px-4 py-3'>
                        <p
                          className='cursor-pointer'
                          onClick={() =>
                            onContentActions(selectedContents, 'configure')
                          }
                        >
                          Configure Accessible
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* more option */}
                <div className='token-gated-dropdown relative'>
                  <button className='flex transition duration-150 ease-in-out   focus:outline-none focus:border-none '>
                    <span className='mr-2'>More Action</span>
                    <i className='fa-solid fa-chevron-down mt-[2px]'></i>
                  </button>
                  <div className='opacity-0 text-[14px] invisible token-gated-dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95'>
                    <div className='absolute left-0 w-56 mt-[1.5rem] origin-top-right bg-txtblack  outline-none'>
                      <div className='px-4 py-3'>
                        <p
                          className='cursor-pointer'
                          onClick={() =>
                            onContentActions(selectedContents, 'delete')
                          }
                        >
                          Delete Content
                        </p>
                      </div>
                      <div className='px-4 py-3'>
                        <p
                          className='cursor-pointer'
                          onClick={() =>
                            onContentActions(selectedContents, 'publish')
                          }
                        >
                          Publish
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* multiple action End */}

          {/* table start */}
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='overflow-x-auto'>
              <table className='w-full text-left !whitespace-nowrap '>
                <thead className='text-black border border-divider'>
                  <tr>
                    <th scope='col' className='py-3 px-6 !font-black'>
                      <div className='flex items-center '>
                        {project?.contents?.length > 0 && (
                          <input
                            type='checkbox'
                            name='token-gated-all-content-check'
                            id='token-gated-all-content-check'
                            className='mr-2'
                            checked={isAllContentsChecked}
                            onChange={(e) =>
                              onAllContentCheckedChange(isAllContentsChecked)
                            }
                          />
                        )}
                        <div>Contents</div>
                      </div>
                    </th>
                    <th scope='col' className='py-3 px-6 !font-black'>
                      Status
                    </th>
                    <th scope='col' className='py-3 px-6 !font-black'>
                      Accessible
                    </th>
                    <th scope='col' className='py-3 px-6 !font-black'>
                      Date Published
                    </th>
                    <th scope='col' className='py-3 px-6 !font-black'>
                      File Type
                    </th>
                    <th scope='col' className='py-3 px-6 !font-black'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {project?.contents?.length === 0 && (
                    <tr>
                      <td align='center' colSpan={6}>
                        <div className='my-5 md:my-20'>
                          <Image
                            src={emptyStateSvg}
                            alt='token gated project empty state'
                            className='h-[245px] w-full md:max-w-[325px]'
                            height={245}
                            width={325}
                          />
                          <p className='mt-2 text-textSubtle'>
                            Drag content or click{' '}
                            <span className='font-bold'>Add new content</span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {project?.contents?.map((content, index) => (
                    <tr key={index}>
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <input
                            type='checkbox'
                            name={`token-gated-content-${index}`}
                            id={`token-gated-content-${index}`}
                            checked={content?.isChecked}
                            onChange={() =>
                              onSingleContentCheckedChange(
                                content?.isChecked,
                                index
                              )
                            }
                          />
                          <Image
                            className='rounded h-[44px] w-[44px] object-cover'
                            src={thumbIcon}
                            height={44}
                            width={44}
                            alt='content logo'
                          />
                          <div>{content?.name}</div>
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        {content?.status === 'published' ? (
                          <div className='px-4 py-2 rounded w-[100px] bg-secondary-900/[0.10] text-secondary-900'>
                            Published
                          </div>
                        ) : (
                          <div className='text-center  py-2 rounded w-[100px] bg-white-filled-form text-textSubtle'>
                            Draft
                          </div>
                        )}
                      </td>
                      <td className='py-4 px-6'>{content?.accessible}</td>
                      <td className='py-4 px-6'>{content?.publishedDate}</td>
                      <td className='py-4 px-6'>{content?.fileType}</td>
                      <td className='py-4 px-6'>
                        <div className='flex flex-wrap items-center gap-3'>
                          <button
                            onClick={() => onContentActions(content, 'publish')}
                            className='py-2 px-4 border bg-primary-900/[0.10] text-primary-900 font-bold rounded'
                          >
                            <i className='fa-solid fa-play mr-2'></i>
                            Publish
                          </button>
                          <button
                            onClick={() =>
                              onContentActions(content, 'configure')
                            }
                            className='py-2 px-4 border border-primary-900 text-primary-900 font-bold rounded'
                          >
                            <i className='fa-solid fa-screwdriver-wrench mr-2'></i>
                            Configure
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* table end */}
        </div>
      )}
      {showSettingModal && (
        <SettingModal
          show={showSettingModal}
          handleClose={() => setShowSettingModal(false)}
        />
      )}
      {showAddNewContentModal && (
        <AddNewContentModal
          show={showAddNewContentModal}
          handleClose={() => setShowAddNewContentModal(false)}
        />
      )}
      {showUploadByLinkModal && (
        <UploadByLinkModal
          show={showUploadByLinkModal}
          handleClose={() => setShowUploadByLinkModal(false)}
        />
      )}
      {showPublishContentModal && (
        <PublishContentModal
          show={showPublishContentModal}
          handleClose={() => setShowPublishContentModal(false)}
          contents={lastSelectedContents}
        />
      )}
      {showConfigContentModal && (
        <ConfigContentModal
          show={showConfigContentModal}
          handleClose={() => setShowConfigContentModal(false)}
          contents={lastSelectedContents}
        />
      )}
      {showDeleteContentModal && (
        <DeleteContentModal
          show={showDeleteContentModal}
          handleClose={() => setShowDeleteContentModal(false)}
          contents={lastSelectedContents}
        />
      )}
    </>
  );
}
