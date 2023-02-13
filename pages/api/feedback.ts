import createFeedbackAPI from '@upstash/feedback/api';
import Config from '../../config/config';

export default createFeedbackAPI({
  webhooks: [Config.SLACK_WEBHOOK],
});
