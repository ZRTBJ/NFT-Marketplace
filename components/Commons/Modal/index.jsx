import styles from './modal.module.css';
// temporarily disable the hide modal on  outside click function
// import { useDetectClickOutside } from "react-detect-click-outside";
const Modal = ({
  handleClose,
  show,
  children,
  height,
  width,
  overflow,
  showCloseIcon = true,
  gradientBg = false,
}) => {
  let styleObj = {
    height: height ? height + 'px' : '',
    width: width ? width + 'px' : '',
    overflow: overflow ? overflow : 'hidden',
  };

  // const ref = useDetectClickOutside({ onTriggered: handleClose });
  // ref = { ref };
  return (
    <div
      data-toggle='modal'
      data-backdrop='static'
      data-keyboard='false'
      className={`${
        show
          ? `${styles.modal} ${styles.displayBlock}`
          : `${styles.modal} ${styles.displayNone}`
      } z-[100]`}
    >
      <section
        style={styleObj}
        className={`${styles.modalMain} bg-white rounded-[12px] relative txtblack`}
      >
        <div
          className={`${
            gradientBg ? 'gradient-card-bg' : 'bg-white'
          } px-4 py-6`}
        >
          {showCloseIcon && (
            <i
              className='fa fa-xmark cursor-pointer text-xl absolute top-8 right-8 text-black'
              onClick={handleClose}
            ></i>
          )}
          <div className='mt-0'>{children}</div>
        </div>
      </section>
    </div>
  );
};

export default Modal;
