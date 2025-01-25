import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardHome from '../components/dashboard/DashboardHome';
import Corrections from '../components/dashboard/Corrections';
import CorrectionProjectDetails from '../components/dashboard/CorrectionProjectDetails';
import Courses from '../components/dashboard/Courses';
import Analytics from '../components/dashboard/Analytics';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/corrections" element={<Corrections />} />
        <Route path="/corrections/:id" element={<CorrectionProjectDetails />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </DashboardLayout>
  );
}