'use client';

import Layout from '@/components/Layout';
import ProfileManager from '@/components/ProfileManager';

export default function ProfilePage() {
  return (
    <Layout title="Profile Settings">
      <div className="animate-fade-in">
        <ProfileManager />
      </div>
    </Layout>
  );
}