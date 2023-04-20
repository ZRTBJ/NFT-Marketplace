import styles from './LoadingText.module.css';

const LoadingText = ({ text }) => {
  return (
    <div className={styles.loadingText}>
      <p className='text-gray-600'>
        {text}
        <span className={styles.dotOne}> .</span>
        <span className={styles.dotTwo}> .</span>
        <span className={styles.dotThree}> .</span>
      </p>
    </div>
  );
};

export default LoadingText;
