import { useState } from 'react';
import Modal from 'components/Commons/Modal';
import Image from 'next/image';
import Logo from 'assets/images/header/logo.svg';
import Plus from 'assets/images/accordian-plus.svg';
import Minus from 'assets/images/accordian-minus.svg';
import NFT from 'assets/images/nft-grad.svg';
import Royalty from 'assets/images/royalty.svg';
import TokenGate from 'assets/images/token-gate.svg';
import LogoBG from 'assets/images/bg-logo.svg';
import Link from 'next/link';

const WelcomeModal = ({ show, handleClose }) => {
  const [open, setOpen] = useState([]);

  const handleShowModal = (value) => {
    if (open.includes(value)) {
      let values = open.filter((item) => item !== value);
      setOpen(values);
    } else {
      setOpen([...open, value]);
    }
  };
  return (
    <Modal
      width={1250}
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={false}
      addPadding={false}
      overflow={'auto'}
    >
      <div className='flex bg-[#E1ECF0] rounded-[20px]'>
        <div className='w-full md:w-4/6 text-center py-[30px]'>
          <div className=' w-5/6 md:w-4/6 mx-auto'>
            <p className='text-[24px] font-bold text-[#021118]'>Welcome to</p>
            <Image src={Logo} alt='DeCir' className='mx-auto my-[18px]' />
            <p className='text-[#727E83] text-[16px] word-break'>
              Unlock the power of your community by building a truly seamless
              web3 experience through token-gated NFT.
            </p>
            <p className='mt-[20px] text-[16px] text-[#3E4649]'>
              What you can do on DeCir?
            </p>
            <div className='mt-4'>
              <div className='accordion-item bg-[#fff] mb-4 rounded-[16px]'>
                <h2 className='accordion-header mb-0' id={`heading-1`}>
                  <button
                    className='
            group
            relative
            flex
            items-center
            w-full
            py-4
            bg-[#fff]
            px-5
            text-base text-gray-800 text-left
            border-0
            rounded-none
            transition
            focus:outline-none
            rounded-[16px]
          '
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target={`#configure-1`}
                    aria-expanded='false'
                    aria-controls={`configure-1`}
                    onClick={() => handleShowModal(1)}
                  >
                    Create membership NFT
                    <span className='ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out '>
                      {open.includes(1) ? (
                        <Image src={Minus} alt='Accordian Minus' />
                      ) : (
                        <Image src={Plus} alt='Accordian Plus' />
                      )}
                    </span>
                  </button>
                </h2>

                <div
                  id={`configure-1`}
                  className={`accordion-collapse accordian-detail-content collapse rounded-[16px]`}
                  aria-labelledby={`heading-1`}
                  data-bs-parent='#content-configure'
                >
                  <div className='accordion-body py-4 px-5 text-[#4E5356] text-left accordian-body-bg rounded-[16px]'>
                    <Image src={NFT} alt='NFT' className='mx-auto mb-5' />
                    Issue NFTs that serve as digital access cards. Grant holders
                    access to an exclusive community that offers members-only
                    utilities such as live events, online experiences, and
                    personalized metaverse immersive experiences.
                  </div>
                </div>
              </div>
              <div className='accordion-item bg-[#fff] mb-4 rounded-[16px]'>
                <h2 className='accordion-header mb-0' id={`heading-2`}>
                  <button
                    className='
            group
            relative
            flex
            items-center
            w-full
            py-4
            bg-[#fff]
            px-5
            text-base text-gray-800 text-left
            border-0
            rounded-none
            transition
            focus:outline-none
            rounded-[16px]
          '
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target={`#configure-2`}
                    aria-expanded='false'
                    aria-controls={`configure-2`}
                    onClick={() => handleShowModal(2)}
                  >
                    Create token-gated contents
                    <span className='ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out '>
                      {open.includes(2) ? (
                        <Image src={Minus} alt='Accordian Minus' />
                      ) : (
                        <Image src={Plus} alt='Accordian Plus' />
                      )}
                    </span>
                  </button>
                </h2>

                <div
                  id={`configure-2`}
                  className={`accordion-collapse accordian-detail-content collapse rounded-[16px]`}
                  aria-labelledby={`heading-2`}
                  data-bs-parent='#content-configure'
                >
                  <div className='accordion-body py-4 px-5 text-[#4E5356] text-left accordian-body-bg rounded-[16px]'>
                    <Image src={TokenGate} alt='NFT' className='mx-auto mb-5' />
                    Offer gated experiences to your community or fanbase. Grant
                    exclusive access to token holders to partake in limited
                    experiences such as exclusive art shows, premium videos,
                    photographs and metaverse galleries, writings, and other
                    forms of personalized digital content.
                  </div>
                </div>
              </div>
              <div className='accordion-item bg-[#fff] rounded-[16px] !rounded-bl-[16px] !rounded-br-[16px]'>
                <h2
                  className='accordion-header mb-0 rounded-[16px]'
                  id={`heading-3`}
                >
                  <button
                    className='
            group
            relative
            flex
            items-center
            w-full
            py-4
            bg-[#fff]
            px-5
            text-base text-gray-800 text-left
            border-0
            rounded-none
            transition
            focus:outline-none
            rounded-[16px]
          '
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target={`#configure-3`}
                    aria-expanded='false'
                    aria-controls={`configure-3`}
                    onClick={() => handleShowModal(3)}
                  >
                    Automate Royalty Splitting
                    <span className='ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out '>
                      {open.includes(3) ? (
                        <Image src={Minus} alt='Accordian Minus' />
                      ) : (
                        <Image src={Plus} alt='Accordian Plus' />
                      )}
                    </span>
                  </button>
                </h2>

                <div
                  id={`configure-3`}
                  className={`accordion-collapse accordian-detail-content collapse rounded-[16px] !rounded-bl-[16px] !rounded-br-[16px]`}
                  aria-labelledby={`heading-3`}
                  data-bs-parent='#content-configure'
                >
                  <div className='accordion-body py-4 px-5 text-[#4E5356] text-left accordian-body-bg rounded-[16px] !rounded-bl-[16px] !rounded-br-[16px]'>
                    <Image src={Royalty} alt='NFT' className='mx-auto mb-5' />
                    DeCir allows you to list your NFT collection on multiple
                    marketplaces with just a single click. Our Royalty Splitter
                    also helps you to collect royalties and aggregate sales
                    revenue across marketplaces. It also automatically handles
                    the distribution of royalties and revenue to contributors
                    who participated in the NFT creation process.
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-[32px]'>
              <p className='text-[#4A4A4A] text-[14px]'>
                You are required to have a metamask wallet to create an account
              </p>
              <a
                className='text-[#E100FF] text-[14px] underline cursor-pointer'
                href='https://metamask.io/'
                target='_blank'
                rel='noreferrer'
              >
                I don’t have a wallet
              </a>
              <button
                className='contained-button-new mt-[28px] text-[16px] w-full md:w-[320px] flex items-center justify-between mx-auto h-[52px]'
                onClick={handleClose}
              >
                <span>Get started</span>
                <i className='fa-regular fa-arrow-right ml-1'></i>
              </button>
              <p className='font-black text-[16px] mt-[24px] '>
                Want to know more about DeCir?
              </p>
              <p className='text-[#828282] text-[12px] mt-0'>
                Learn about our features and many more in the DeCir whitepaper
              </p>
              <Link
                className='text-[12px] font-bold mt-0'
                href='https://decir.gitbook.io/decir/'
                passHref
                target='_blank'
              >
                Learn more <i className='fa-regular fa-arrow-right ml-1'></i>
              </Link>
            </div>
          </div>
        </div>
        <div className='w-2/6 welcome-gradient-bg relative hidden md:block ml-[1px]'>
          <h1 className='!text-[47px] mb-4 !leading-tight'>
            No Code DAO Creation Platform
          </h1>
          <p className='!text-[32px] !leading-tight word-break'>
            Create Token Gated Community in 5 min
          </p>
          <Image src={LogoBG} alt='Logo' className='absolute bottom-0 left-0' />
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
