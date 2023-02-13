import Config from 'config/config';

export default async function sendHelpMessage(req, res) {
  const { email, message } = req.body;

  try {
    const text = `New Request!
  email: ${email}
  message: ${message}`;

    await fetch(Config.SLACK_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 'Content-Type': 'application/json' },
    });

    return res.status(200).json({ message: 'success' });
  } catch (err) {
    let message = err;

    return res.status(400).json({ message });
  }
}
