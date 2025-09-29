import Layout from "@/components/layout";
import { UserProfile } from "@clerk/react-router";

const ProfilePage = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center h-full">
        <UserProfile />
      </div>
    </Layout>
  );
};

export default ProfilePage;
