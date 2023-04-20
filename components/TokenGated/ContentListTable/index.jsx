import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import emptyStateSvg from 'assets/images/token-gated/emptyState.svg';
import Image from 'next/image';
import thumbIcon from 'assets/images/profile/card.svg';
import PublishContentModal from 'components/TokenGated/Modal/PublishContent';
import DeleteContentModal from 'components/TokenGated/Modal/DeleteContent';
import dayjs from 'dayjs';
import Link from 'next/link';
import AddNewContent from '../Modal/Content/AddNewContent';
import ContentPreview from './ContentPreview';
import ErrorModal from 'components/Modals/ErrorModal';
import { getCollectionByContractAddress } from 'services/collection/collectionService';
import { useRouter } from 'next/router';

export default function ContentListTable({
  projectInfo,
  onContentPublished,
  onContentDelete,
  setLinkDetails,
  tokenProjectId,
  linkDetails,
  setShowUploadByLinkModal = { setShowUploadByLinkModal },
  setIsEditContent,
  onContentDrop,
}) {
  const router = useRouter();
  const [project, setProject] = useState(projectInfo);
  const [selectedContents, setSelectedContents] = useState([]);
  const [isAllContentsChecked, setIsAllContentsChecked] = useState(false);
  const [lastSelectedContents, setLastSelectedContents] = useState([]);
  const [showPublishContentModal, setShowPublishContentModal] = useState(false);
  const [showConfigContentModal, setShowConfigContentModal] = useState(false);
  const [showDeleteContentModal, setShowDeleteContentModal] = useState(false);
  const [usedForPublish, setUsedForPublish] = useState(true);
  const [showConfigureAllModal, setShowConfigureAllModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showOverlayLoading, setShowOverlayLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const onDrop = async (e) => {
    onContentDrop(e);
    setIsDragOver(false);
  };
  const onDragOver = async (e) => {
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };
  const onDragLeave = async () => {
    if (isDragOver) {
      setIsDragOver(false);
    }
  };
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    onDragOver,
    onDragLeave,
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
      setIsEditContent(false);
    } else {
      setLastSelectedContents(content);
      setIsEditContent(false);
    }
    if (actionName === 'publish') {
      setShowPublishContentModal(true);
      setUsedForPublish(true);
      setIsEditContent(false);
    }
    if (actionName === 'un-publish') {
      setShowPublishContentModal(true);
      setUsedForPublish(false);
      setIsEditContent(false);
    } else if (actionName === 'configure') {
      setIsEditContent(true);
      setShowConfigContentModal(content);
    } else if (actionName === 'delete') {
      setShowDeleteContentModal(true);
      setIsEditContent(false);
    } else if (actionName === 'configureAll') {
      setShowConfigureAllModal(true);
      setIsEditContent(false);
    }
  };
  const showCollection = async (index, index_config_names) => {
    setShowOverlayLoading(true);
    const config_col_contracts = project?.contents[index]?.config_col_contracts;
    if (config_col_contracts && config_col_contracts?.length > 0) {
      const address = config_col_contracts[index_config_names];
      if (address && address?.length > 0) {
        await getCollectionByContractAddress(address)
          .then((res) => {
            setShowOverlayLoading(false);
            if (res?.code === 0) {
              if (res?.data?.[0]?.id) {
                router.push(`/collection/${res.data?.[0]?.id}`);
              } else {
                setShowErrorModal(true);
                setErrorModalMessage('Collection not found');
              }
            } else {
              setShowErrorModal(true);
              setErrorModalMessage(res?.message);
            }
          })
          .catch((err) => {
            setShowOverlayLoading(false);
            console.log(err);
          });
      } else {
        setShowOverlayLoading(false);
        setShowErrorModal(true);
        setErrorModalMessage('Contract Address not found of this Collection');
      }
    } else {
      setShowOverlayLoading(false);
      setShowErrorModal(true);
      setErrorModalMessage('Contract Address not found of this Collection');
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
      {showOverlayLoading && <div className='loading'></div>}

      {/* multiple action start */}
      {selectedContents.length > 0 && (
        <div className='text-white-shade-900 mt-10 flex flex-wrap items-center'>
          <div className='bg-txtblack border-r border-white-shade-900 py-4 md:py-6 px-2 md:px-7'>
            {selectedContents.length} Selected
          </div>
          <div className='flex-1 flex flex-wrap items-center gap-4 md:gap-20 bg-txtblack py-4 md:py-6 px-2 md:px-7'>
            {/* edit */}
            <div className='token-gated-dropdown relative'>
              <button className='flex transition duration-150 ease-in-out   focus:outline-none focus:border-none '>
                <span className='mr-2'>Edit</span>
                <i className='fa-solid fa-chevron-down mt-[2px]'></i>
              </button>
              <div className='opacity-0 text-[14px] invisible token-gated-dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95'>
                <div className='absolute left-0 w-56 mt-5 md:mt-[1.5rem] origin-top-right bg-txtblack    outline-none'>
                  <div className='px-4 py-3'>
                    <p
                      className='cursor-pointer'
                      onClick={() =>
                        onContentActions(selectedContents, 'configureAll')
                      }
                    >
                      <i className='fa-solid fa-screwdriver-wrench mr-2'></i>
                      Edit Accessibility
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
                <div className='absolute left-0 w-56 mt-5 md:mt-[1.5rem] origin-top-right bg-txtblack  outline-none'>
                  <div className='px-4 py-3'>
                    <p
                      className='cursor-pointer'
                      onClick={() =>
                        onContentActions(selectedContents, 'publish')
                      }
                    >
                      <i className='fa-solid fa-play mr-2'></i>
                      Publish Contents
                    </p>
                  </div>
                  <div className='px-4 py-3'>
                    <p
                      className='cursor-pointer'
                      onClick={() =>
                        onContentActions(selectedContents, 'un-publish')
                      }
                    >
                      <i className='fa-solid fa-eye-slash mr-1'></i>
                      Un-Publish Contents
                    </p>
                  </div>
                  <div className='px-4 py-3'>
                    <p
                      className='cursor-pointer'
                      onClick={() =>
                        onContentActions(selectedContents, 'delete')
                      }
                    >
                      <i className='fa-solid fa-trash mr-2'></i>
                      Delete Contents
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
      <div
        {...getRootProps({
          className: `dropzone md:min-h-[60vh]`,
        })}
      >
        <input {...getInputProps()} />
        {project?.contents?.length > 0 ? (
          <div className='md:overflow-x-auto'>
            <table className='text-left w-full  md:!whitespace-nowrap'>
              <thead className='text-black border border-divider'>
                <tr>
                  <th scope='col' className='py-3 px-2 md:px-6 !font-black'>
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
                  <th
                    scope='col'
                    className='py-3 px-6 !font-black hidden md:table-cell'
                  >
                    Status
                  </th>
                  <th
                    scope='col'
                    className='py-3 px-6 !font-black hidden md:table-cell'
                  >
                    Accessibility
                  </th>
                  <th
                    scope='col'
                    className='py-3 px-6 !font-black hidden md:table-cell'
                  >
                    Date Created
                  </th>
                  <th
                    scope='col'
                    className='py-3 px-6 !font-black hidden md:table-cell'
                  >
                    File Type
                  </th>
                  <th
                    scope='col'
                    className='py-3 px-6 !font-black text-right md:text-center'
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {project?.contents?.map((content, index) => (
                  <tr key={index}>
                    <td className='py-4  pr-6 md:px-6'>
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
                        <div className='hidden md:block w-[40px]'>
                          <ContentPreview content={content}></ContentPreview>
                        </div>
                        <div>
                          <Link
                            href={`/token-gated/content/${content?.id}?projectId=${tokenProjectId}`}
                            className='font-bold !no-underline text-txtblack'
                          >
                            {content?.title}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-6 hidden md:table-cell'>
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
                    <td className='py-4 px-6 hidden md:table-cell'>
                      <div className='flex  items-center gap-2  text-white text-[12px] '>
                        {content?.config_names &&
                          content?.config_names?.length > 0 && (
                            <>
                              {content?.config_names
                                .slice(0, 2)
                                ?.map((c, index_config_names) => (
                                  <div
                                    key={index_config_names}
                                    className='bg-textSubtle py-1 px-3 rounded max-w-[150px] truncate cursor-pointer'
                                    onClick={() =>
                                      showCollection(index, index_config_names)
                                    }
                                  >
                                    {c}
                                  </div>
                                ))}
                            </>
                          )}
                        {content?.config_names &&
                          content?.config_names?.length > 2 && (
                            <div className='bg-textSubtle py-1 px-3 rounded'>
                              +{content?.config_names?.length - 2}
                            </div>
                          )}
                      </div>
                    </td>
                    <td className='py-4 px-6 hidden md:table-cell'>
                      {dayjs(content?.created_at).format('DD/MM/YYYY')}
                    </td>
                    <td className='py-4 px-6 capitalize hidden md:table-cell'>
                      {content?.file_type}
                    </td>
                    <td className='py-4 px-2 md:px-6 '>
                      <div className='hidden md:flex justify-center  items-center gap-3 '>
                        <button
                          onClick={() => onContentActions(content, 'publish')}
                          className='py-2  border bg-primary-900/[0.10] text-primary-900 font-bold rounded w-[140px]'
                        >
                          <i
                            className={`${
                              content?.status === 'draft'
                                ? 'fa-solid fa-play'
                                : 'fa-solid fa-eye-slash'
                            }  mr-2`}
                          ></i>
                          {content?.status === 'draft'
                            ? 'Publish'
                            : 'Un-Publish'}
                        </button>
                        <button
                          onClick={() => onContentActions(content, 'configure')}
                          className='py-2  border border-primary-900 text-primary-900 font-bold rounded w-[140px]'
                        >
                          <i className='fa-solid fa-screwdriver-wrench mr-2'></i>
                          Accessibility
                        </button>
                      </div>
                      <div
                        onClick={() => onContentActions(content, 'publish')}
                        className='text-center mb-4 md:hidden py-2 border bg-primary-900/[0.10] text-primary-900 font-bold ml-auto rounded w-[130px]'
                      >
                        <i
                          className={`${
                            content?.status === 'draft'
                              ? 'fa-solid fa-play'
                              : 'fa-solid fa-eye-slash'
                          }  mr-2`}
                        ></i>
                        {content?.status === 'draft' ? 'Publish' : 'Un-Publish'}
                      </div>
                      <div
                        onClick={() => onContentActions(content, 'configure')}
                        className='md:hidden py-2  text-center border border-primary-900 text-primary-900 font-bold ml-auto rounded w-[130px]'
                      >
                        <i className='fa-solid fa-screwdriver-wrench mr-2'></i>
                        Accessibility
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td align='center' colSpan={6}>
                    <div
                      className={`my-5 md:my-20 ${
                        isDragOver ? 'border border-dashed border-4' : ''
                      }`}
                    >
                      <Image
                        src={emptyStateSvg}
                        alt='token gated project empty state'
                        className='h-[245px] w-full md:max-w-[325px]'
                        height={245}
                        width={325}
                      />
                      <p className='mt-2 text-textSubtle mb-4'>
                        Drag content or click{' '}
                        <span className='font-bold'>Add new content</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className='my-5 md:py-20'>
            <Image
              src={emptyStateSvg}
              alt='token gated project empty state'
              className='h-[245px] w-full md:max-w-[325px] mx-auto'
              height={245}
              width={325}
            />
            <p className='mt-2 text-textSubtle text-center'>
              Drag content or click{' '}
              <span className='font-bold'>Add new content</span>
            </p>
          </div>
        )}
      </div>
      {/* table end */}

      {showPublishContentModal && (
        <PublishContentModal
          show={showPublishContentModal}
          handleClose={() => setShowPublishContentModal(false)}
          contents={lastSelectedContents}
          onContentPublished={onContentPublished}
          usedForPublish={usedForPublish}
          setIsEditContent={setIsEditContent}
        />
      )}
      {showConfigContentModal && (
        <AddNewContent
          show={showConfigContentModal}
          handleClose={() => {
            setShowConfigContentModal(false);
            setIsEditContent(false);
            setLinkDetails({ link: '', type: 'image' });
          }}
          tokenProjectId={tokenProjectId}
          onContentAdded={onContentPublished}
          contents={lastSelectedContents}
          setLinkDetails={setLinkDetails}
          setShowUploadByLinkModal={setShowUploadByLinkModal}
          linkDetails={linkDetails}
          setIsEditContent={setIsEditContent}
        />
      )}
      {showConfigureAllModal && (
        <AddNewContent
          show={showConfigureAllModal}
          handleClose={() => {
            setShowConfigureAllModal(false);
          }}
          tokenProjectId={tokenProjectId}
          onContentAdded={onContentPublished}
          allContents={lastSelectedContents}
          isConfigureAll={true}
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
      {showErrorModal && (
        <ErrorModal
          message={errorModalMessage}
          handleClose={() => {
            setErrorModalMessage('');
            setShowErrorModal(false);
          }}
          show={showErrorModal}
        />
      )}
    </>
  );
}
