import NFTImage from '../../assets/images/projectDetails/man-img.svg';

function EmbedNFT() {
  return (
    <div
      className={`h-[calc(100vh-71px)] flex flex-col items-center justify-center`}
    >
      <img src={NFTImage} alt='NFT' />
      <h2 className='text-white mt-8'>Bored APE</h2>
    </div>
  );
}

export default EmbedNFT;
