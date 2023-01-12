import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import emptyStateSvg from 'assets/images/token-gated/emptyState.svg';
import Image from 'next/image';
import thumbIcon from 'assets/images/profile/card.svg';
import PublishContentModal from 'components/TokenGated/Modal/PublishContent';
import ConfigContentModal from 'components/TokenGated/Modal/ConfigContent';
import DeleteContentModal from 'components/TokenGated/Modal/DeleteContent';
import dayjs from 'dayjs';
export default function ContentListTable({
  projectInfo,
  onContentPublished,
  onContentDelete,
}) {
  const [project, setProject] = useState(projectInfo);
  const [selectedContents, setSelectedContents] = useState([]);
  const [isAllContentsChecked, setIsAllContentsChecked] = useState(false);
  const [lastSelectedContents, setLastSelectedContents] = useState([]);
  const [showPublishContentModal, setShowPublishContentModal] = useState(false);
  const [showConfigContentModal, setShowConfigContentModal] = useState(false);
  const [showDeleteContentModal, setShowDeleteContentModal] = useState(false);

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
    if (!Array.isArray(content)) {
      list.push(content);
      setLastSelectedContents(list);
    } else {
      setLastSelectedContents(content);
    }
    if (actionName === 'publish') {
      setShowPublishContentModal(true);
    } else if (actionName === 'configure') {
      setShowConfigContentModal(true);
    } else if (actionName === 'delete') {
      setShowDeleteContentModal(true);
    }
  };

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
                  Date Created
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
                      <div>{content?.title}</div>
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
                  <td className='py-4 px-6'>
                    {dayjs(content?.created_at).format('DD/MM/YYYY')}
                  </td>
                  <td className='py-4 px-6'>{content?.file_type}</td>
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
                        onClick={() => onContentActions(content, 'configure')}
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

      {showPublishContentModal && (
        <PublishContentModal
          show={showPublishContentModal}
          handleClose={() => setShowPublishContentModal(false)}
          contents={lastSelectedContents}
          onContentPublished={onContentPublished}
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
          onContentDelete={onContentDelete}
        />
      )}
    </>
  );
}
