const Tabs = ({ values, setSelectedTab, selectedTab }) => {
  return (
    <div className='bg-[#E1ECF0] flex items-center rounded-[10px] w-[95%] md:w-[65%] mx-auto mb-4'>
      {values.map((value) => (
        <div
          key={value.key}
          className={`w-2/6 text-center m-1 rounded-[8px] cursor-pointer ${
            value.key === selectedTab ? 'bg-[#fff]' : ''
          }`}
          onClick={() => setSelectedTab(value.key)}
        >
          <p className='font-bold text-[15px] md:text-[16px]'>{value.label}</p>
          <p className='text-[12px] mt-[4px]'>
            ~ {value?.key !== 'royalty' ? ' $' : ' '} {value.value}{' '}
            {value?.key === 'royalty' ? ' Token' : ' USD'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
