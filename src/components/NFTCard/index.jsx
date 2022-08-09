const NFTCard = ({ item }) => {
  const truncateArray = (users) => {
    let slicedItems = users.slice(0, 3);
    return { slicedItems, restSize: users.length - slicedItems.length };
  };
  return (
    <div className='rounded-[12px] relative flex flex-col'>
      <img src={item.image} alt={item.name} className='w-[276px] h-[276px]' />
      <h3 className='text-[24px] font-bold mt-4'>{item.name}</h3>
      <p className='w-[260px] text-[13px] font-light mt-2 text-[#7D849D]'>
        {item.description}
      </p>
      <div className='flex mt-3 ml-3'>
        {truncateArray(item.nfts).slicedItems.map((user) => (
          <img
            src={user.profileImage}
            alt={user.id}
            className='w-[24px] h-[24px] -ml-3'
          />
        ))}
        {item.nfts.length > 3 && (
          <div className='flex items-center mt-[2px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[22px] h-[22px]'>
            <p className='text-[8px] text-[#9A5AFF]'>
              +{truncateArray(item.nfts).restSize}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
