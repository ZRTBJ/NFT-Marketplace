import { useMemo } from 'react';
import StatusModal from 'components/Modals/StatusModal';

const PublishRoyaltyModal = (props) => {
  const {
    status,
    ...otherProps
  } = props;

  const textStatus = useMemo(() => {
    if (status === 1) {
      return 'Creating the contract';
    }

    if (status === 2) {
      return 'Contract created. Now, we are publishing it.'
    }

    return '';
  }, [status]);

  return (
    <StatusModal
      {...otherProps}
      loadingMessage="Please wait we’re publishing your royalty splitter"
      successMessage="You have successfully published your royalty splitter!"
      status={textStatus}
    />
  );
};

export default PublishRoyaltyModal;
