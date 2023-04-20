import { useEffect, useState } from 'react';
import {
  getProjectDetailsById,
  getNewWorth,
} from 'services/project/projectService';
import PublishProjectModal from './Deploy/PublishProjectModal';
import ErrorModal from 'components/Modals/ErrorModal';
import SuccessModal from 'components/Modals/SuccessModal';
import DeployingProjectModal from './Deploy/DeployingProjectModal';
import { getCollections } from 'services/collection/collectionService';
import LeavingSite from './Components/LeavingSite';
import CollectionTab from './CollectionTab/CollectionTab';
import SalesSettingsTab from './SalesSettingTab/SalesSettingTab';
import RoyaltySplitter from './RoyaltySplitter/RoyaltySplitter';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import { getCurrentNetworkId } from 'util/MetaMask';
import CoverGallery from './CoverGallery';
import InfoCard from './InfoCard.jsx';
import MembershipNFTTab from './MembershipNFTTab/MembershipNFTTab';
import ProductNFTTab from './ProductNFTTab/ProductNFTTab';
import { useSelector } from 'react-redux';
import { ls_GetChainID, ls_GetWalletType } from 'util/ApplicationStorage';

const TABS = [
  { id: 1, label: 'Membership NFT' },
  { id: 2, label: 'Product NFT' },
  { id: 3, label: 'Collections' },
  { id: 4, label: 'Royalty Splitter' },
  { id: 5, label: 'Sales Settings' },
];

function ProjectDetailsContent({ id }) {
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState({});
  const projectId = id;
  const [coverImages, setCoverImages] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [links, setLinks] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [publishStep, setPublishStep] = useState(1);
  const [selectedTab, setSelectedTab] = useState(3);
  const [membershipCollectionList, setMembershipCollectionList] = useState([]);
  const [productCollectionList, setProductCollectionList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showTransferFundModal, setShowTransferFundModal] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [collection, setCollection] = useState();
  const [newWorth, setNetWorth] = useState({
    balance: 0,
    currency: '',
    balanceUSD: 0,
  });
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);
  const userInfo = useSelector((state) => state.user.userinfo);
  let walletType = ls_GetWalletType();
  useEffect(() => {
    if (projectId) {
      projectDetails(projectId);
      getProjectNetWorth();
    }
  }, [projectId, userInfo?.id]);

  const getProjectNetWorth = () => {
    setBalanceLoading(true);
    getNewWorth(projectId).then((resp) => {
      if (resp.code === 0) {
        setBalanceLoading(false);
        setNetWorth({
          balance: resp.balance,
          currency: resp.currency,
          balanceUSD: resp.balance_usd,
        });
      } else {
        setBalanceLoading(false);
        setNetWorth({ balance: 0, currency: '', balanceUSD: 0 });
      }
    });
  };

  useEffect(() => {
    getCollectionList();
  }, [userInfo?.id]);

  async function projectDetails(pid) {
    setIsLoading(true);
    await getProjectDetailsById({ id: pid })
      .then((res) => {
        if (res.code === 0) {
          setProject(res.project);
          if (res?.project?.assets && res?.project?.assets?.length > 0) {
            setCoverImages(
              res.project?.assets?.find(
                (img) => img['asset_purpose'] === 'cover'
              )
            );
          }
          if (res.project?.urls) {
            const urls = JSON.parse(res.project.urls);
            if (urls.length) setLinks(urls);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  async function intiProjectPublish() {
    setShowPublishModal(false);
    if (project?.project_status === 'publishing') {
      setPublishStep(1);
      setShowDeployModal(true);
    } else {
      setShowDeployModal(true);
    }
  }

  async function getCollectionList() {
    setIsLoading(true);
    await getCollections('project', projectId, page, limit)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          setCollection(e);
          const membershipcoll = e.data.filter(
            (col) => col.type === 'membership'
          );

          if (membershipcoll) {
            setMembershipCollectionList(membershipcoll);
          }
          const productcoll = e.data.filter((col) => col.type === 'product');
          if (productcoll) {
            setProductCollectionList(productcoll);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  const handlePublishModal = async () => {
    if (walletType === 'magicwallet') {
      let chainId = await ls_GetChainID();
      if (Number(project?.blockchain) === chainId) {
        setShowPublishModal(true);
      } else {
        setShowNetworkHandler(true);
      }
    } else {
      let networkId = await getCurrentNetworkId();
      if (Number(project?.blockchain) === networkId) {
        setShowPublishModal(true);
      } else {
        setShowNetworkHandler(true);
      }
    }
  };

  return (
    <>
      {isLoading && <div className='loading'></div>}
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={project?.blockchain}
        />
      )}
      {!isLoading && (
        <div className='mx-4'>
          {/* dekstop gallery  */}
          <CoverGallery assets={project?.assets} coverImages={coverImages} />

          {/* profile information section */}
          <InfoCard
            links={links}
            project={project}
            coverImages={coverImages}
            setShowTransferFundModal={setShowTransferFundModal}
            handlePublishModal={handlePublishModal}
            getProjectNetWorth={getProjectNetWorth}
            balanceLoading={balanceLoading}
            newWorth={newWorth}
            collection={collection}
          />

          {/* Tab Section */}
          <section className='mb-10 mt-4'>
            <div className='mb-4'>
              <ul
                className='flex flex-wrap  border-b  border-b-[2px] text-sm font-medium text-center '
                id='myTab'
                data-tabs-toggle='#myTabContent'
                role='tablist'
              >
                {TABS.map((tab) => {
                  if (
                    !membershipCollectionList.length &&
                    tab.label === 'Membership NFT'
                  )
                    return;
                  if (
                    !productCollectionList.length &&
                    tab.label === 'Product NFT'
                  )
                    return;

                  if (
                    (!project?.is_owner && tab.label === 'Royalty Splitter') ||
                    (!project?.is_owner && tab.label === 'Sales Settings')
                  )
                    return;
                  if (
                    !productCollectionList.length &&
                    !membershipCollectionList.length &&
                    (tab.label === 'Royalty Splitter' ||
                      tab.label == 'Sales Settings')
                  )
                    return;

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

            <div id='myTabContent'>
              {/* Membership NFT tab */}
              {selectedTab === 1 && (
                <MembershipNFTTab
                  project={project}
                  projectId={projectId}
                  membershipCollectionList={membershipCollectionList}
                />
              )}

              {/* Product NFT tab */}
              {selectedTab === 2 && (
                <ProductNFTTab
                  project={project}
                  projectId={projectId}
                  productCollectionList={productCollectionList}
                />
              )}

              {/* collection tab */}
              {selectedTab === 3 && (
                <CollectionTab projectOwner={project?.is_owner}></CollectionTab>
              )}

              {/* Royalty Splitter tab */}
              {selectedTab === 4 && (
                <RoyaltySplitter projectNetwork={project?.blockchain} />
              )}

              {/* Sales Setting tab */}
              {selectedTab === 5 && (
                <SalesSettingsTab projectNetwork={project?.blockchain} />
              )}
            </div>
          </section>
          {showDeployModal ? (
            <DeployingProjectModal
              show={showDeployModal}
              handleClose={(status) => {
                setShowDeployModal(status);
                projectDetails(projectId);
              }}
              errorClose={(msg) => {
                setErrorMsg(msg);
                setShowDeployModal(false);
                setShowErrorModal(true);
                projectDetails(projectId);
              }}
              projectId={projectId}
              projectName={project?.name}
              publishStep={publishStep}
            />
          ) : null}
          {showSuccessModal && (
            <SuccessModal
              handleClose={() => setShowSuccessModal(false)}
              show={showSuccessModal}
            />
          )}
          {showErrorModal && (
            <ErrorModal
              title={'DAO Publish failed !'}
              message={`${errorMsg}`}
              handleClose={() => {
                setShowErrorModal(false);
                setErrorMsg(null);
              }}
              show={showErrorModal}
            />
          )}
          {showPublishModal && (
            <PublishProjectModal
              handleClose={() => setShowPublishModal(false)}
              publishProject={intiProjectPublish}
              show={showPublishModal}
              type='DAO'
            />
          )}
          {showTransferFundModal && (
            <LeavingSite
              network={project?.blockchain}
              treasuryAddress={project?.treasury_wallet}
              show={showTransferFundModal}
              handleClose={() => setShowTransferFundModal(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

export default ProjectDetailsContent;
