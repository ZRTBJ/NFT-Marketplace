export const selectNotificationData = (state) => (
  state?.notifications?.notificationData || []
);

export const selectNotificationByUuid = (uuid) => (state) => {
  if (uuid == null) {
    return null;
  }

  const data = selectNotificationData(state);
  return data.find((event) => event.function_uuid === uuid)
};
