import styles from './style.module.css';
import Edit from 'assets/images/icons/edit.svg';
import Trash from 'assets/images/icons/trash.svg';
import Left from 'assets/images/icons/chevron-left.svg';
import Right from 'assets/images/icons/chevron-right.svg';

const MemberListTable = ({ headers, list, handlePublish }) => {
  return (
    <div className='overflow-x-auto relative mb-[54px] relative'>
      <table className='w-full text-left'>
        <thead>
          <tr className='text-textSubtle text-[12px] '>
            {headers.map((item) => (
              <th
                scope='col'
                className={`px-5 text-[14px] text-[#303548] ${styles.tableHeader}`}
                key={item.id}
              >
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((r, index) => (
            <tr
              key={r.id}
              className={`${
                index < list.length - 1 ? 'border-b' : ''
              } text-left text-[13px]`}
            >
              <td className='py-4 px-5'>{r.walletAddress}</td>
              <td className='py-4 px-5'>{r.name}</td>
              <td className='py-4 px-5'>{r.email}</td>
              <td className={`py-4 px-5 flex`}>
                <span className='w-[40px]'>
                  {r.percentage ? r.percentage : '-'}
                </span>
                <img src={Edit} alt='edit' className='cursor-pointer' />
              </td>
              <td className={`py-4 px-5`}>{r.tokenID}</td>
              <td className={`py-4 px-5`}>
                <p
                  className={`text-[13px] bg-opacity-[0.2] py-1 px-2 w-fit rounded-[4px] font-bold ${
                    r.role === 'Owner'
                      ? 'text-info-1 bg-[#46A6FF]'
                      : ' text-success-1 bg-[#32E865]'
                  }`}
                >
                  {r.role}
                </p>
              </td>
              {/* <td className='py-4 px-5'>
                <div className='w-[32px] h-[32px] bg-[#FF3C3C] rounded-[4px] flex items-center justify-center cursor-pointer'>
                  <img src={Trash} alt='delete' />
                </div>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex items-center justify-center mt-10 w-fit mx-auto'>
        <div className='w-[32px] h-[32px] bg-[#9A5AFF] bg-opacity-[0.1] flex align-items justify-center'>
          <img src={Left} alt='Previous' className='w-[8px]' />
        </div>
        <p className='mx-3'>1</p>
        <p className='mx-3'>2</p>
        <p className='mx-3'>3</p>
        <p className='mx-3'>4</p>
        <div className='w-[32px] h-[32px] bg-[#9A5AFF] bg-opacity-[0.1] flex align-items justify-center'>
          <img src={Right} alt='Next' className='w-[8px]' />
        </div>
      </div>
      <button
        className='absolute right-12 bottom-0 rounded-[4px] bg-[#9A5AFF] text-white text-[12px] font-bold px-4 py-2'
        onClick={() => handlePublish(true)}
      >
        Publish
      </button>
    </div>
  );
};

export default MemberListTable;
