import React from 'react';
import Nav from '../pages/navBar';
import UpperDashboard from './upperDashboard';
import MonthOverview from './monthOverview';
import MembersOverview from './memberOverview';
// import {useState} from 'react';

export default function Head() {
  // const [darkMode, setDarkMode] = useState(false);
  return (
    // <div className={darkMode ? 'dark' : ''}>
    <div>
      <main className="bg-neutral-900 px-10 md:px-20 lg:px-40">
        <section className="min-h-screen">
          <Nav />
          <UpperDashboard />
          <div className="flex flex-col lg:flex-row gap-4">
            <MonthOverview />
            <MembersOverview />
          </div>
        </section>
      </main>
    </div>
  );
}