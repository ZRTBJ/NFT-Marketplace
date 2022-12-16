import Link from 'next/link';
import thumbIcon from 'assets/images/profile/card.svg';
import Image from 'next/image';
// import SalesSuccessModal from "Pages/Collection/SaleSetting/SalesSuccessModal";

const ProductNFTTab = ({ project, projectId, productCollectionList }) => {
  const truncateArray = (members) => {
    let slicedItems = members?.slice(0, 3);
    return { slicedItems, restSize: members.length - slicedItems.length };
  };
  return (
    <section
      className='flex flex-wrap  mb-6'
      id='product-nft'
      role='tabpanel'
      aria-labelledby='product-nft-tab'
    >
      {/* Create New */}
      {project?.is_owner && (
        <div className='h-[156px] w-[140px] md:h-[276px]  md:w-[276px] mb-4 mx-2'>
          <Link href={`/collection/create/?dao_id=${projectId}&type=product`}>
            <div className='h-full rounded-xl gradient-border bg-opacity-20 flex flex-col items-center justify-center'>
              <i className='fa-solid fa-circle-plus gradient-text text-2xl mb-2'></i>
              <p className='gradient-text text-lg font-black font-satoshi-bold'>
                Create new
              </p>
            </div>
          </Link>
        </div>
      )}
      {/* Card */}
      {productCollectionList &&
        productCollectionList.length > 0 &&
        productCollectionList.map((collection, index) => {
          let image = collection?.assets?.find(
            (asset) =>
              asset?.asset_purpose === 'cover' ||
              asset?.asset_purpose === 'logo'
          );
          return (
            <div
              className='md:min-h-[390px] mx-2 md:mr-4 w-[140px]  md:w-[276px]  rounded-x'
              key={`nft-collection-membership-${index}`}
            >
              <Link href={`/collection/${collection?.id}`}>
                <Image
                  className='rounded-xl h-[156px] w-[140px] md:h-[276px] md:w-[276px] object-cover '
                  src={image?.path ? image.path : thumbIcon}
                  alt=''
                  width={276}
                  height={276}
                />
              </Link>
              <div className='py-5'>
                <div className='flex'>
                  <h2 className='pb-2 text-txtblack break-all md:truncate flex-1 mr-3 m-w-0'>
                    {collection?.name}
                  </h2>
                  <div className='relative'>
                    {/* Hide dropdown menu <button
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById(
                                    `collection-option-${index}`
                                  );
                                  el.classList.toggle("hidden");
                                }}
                              >
                                {project?.is_owner && (
                                  <i className="fa-regular fa-ellipsis-vertical text-textSubtle"></i>
                                )}
                              </button> 

                    {project?.is_owner && (
                      <div
                        id={`collection-option-${index}`}
                        className="z-10 w-48 bg-white border border-divide rounded-md  absolute left-0 top-8 hidden"
                      >
                        <ul className="text-sm">
                          <li className="border-b border-divide cursor-pointer">
                            <a
                              onClick={() => {
                                setShowSalesPageModal(true);
                                setCollectionId(collection?.id);
                                setCollectionType("product");
                              }}
                              className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              Sales Page
                            </a>
                          </li>
                          <li className="border-b border-divide">
                            <Link
                              to={`/collection/create/?id=${collection?.id}`}
                              className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              Edit Collections
                            </Link>
                          </li>
                          <li className="border-b border-divide">
                            <a
                              href="#"
                              className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              Connect right-attach NFT
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}*/}
                    {/* Dropdown menu  */}
                  </div>
                </div>
                <p className='mb-3 text-textSubtle text-[13px]'>
                  {collection.description && collection.description.length > 70
                    ? collection.description.substring(0, 67) + '...'
                    : collection.description}
                </p>
                <div className='flex items-center'>
                  {collection.members &&
                    collection.members.length > 0 &&
                    truncateArray(collection.members).slicedItems.map(
                      (member) => (
                        <Image
                          key={member.id}
                          src={member.avatar}
                          alt={member.id}
                          width={276}
                          height={276}
                          className='rounded-full w-9 h-9 -ml-2 border-2 border-white'
                        />
                      )
                    )}
                  {collection.members && collection.members.length > 3 && (
                    <div className='flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]'>
                      <p className='text-[12px] text-[#9A5AFF]'>
                        +{truncateArray(collection.members).restSize}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </section>
  );
};

export default ProductNFTTab;
