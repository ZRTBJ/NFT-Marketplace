import "assets/css/profileSettings.css";
import ProfileSettingsForm from "components/ProfileSettings/ProfileSettingsForm";
import TopNavigationCard from "components/ProfileSettings/TopNavigationCard";
const ProfileSettings = () => {
  return (
    <div>
      <TopNavigationCard />
      <ProfileSettingsForm />
    </div>
  );
};
export default ProfileSettings;
