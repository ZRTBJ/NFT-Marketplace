const DAOCard = ({ item }) => {
  const truncateArray = (users) => {
    let slicedItems = users.slice(0, 3);
    return { slicedItems, restSize: users.length - slicedItems.length };
  };
  return (
    <div className='cursor-pointer text-center w-[282px] h-[279px] rounded-[12px] mr-6 relative flex flex-col'>
      <img
        src={item.coverImage}
        alt={item.name}
        className='w-[282px] h-[88px]'
      />
      <img
        src={item.profileImage}
        alt={item.name}
        className='absolute top-10 left-24'
      />
      <h3 className='mt-10 font-bold text-[24px]'>{item.name}</h3>
      <p className='text-[13px] mt-3 text-[#7D849D]'>Value: {item.value} USD</p>
      <div className='flex mx-auto mt-3'>
        {truncateArray(item.users).slicedItems.map((user) => (
          <img
            src={user.profileImage}
            alt={user.id}
            className='w-[36px] h-[36px] -ml-3'
          />
        ))}
        {item.users.length > 3 && (
          <div className='flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]'>
            <p className='text-[12px] text-[#9A5AFF]'>
              +{truncateArray(item.users).restSize}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DAOCard;
