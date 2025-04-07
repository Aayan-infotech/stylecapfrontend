import React, { useEffect, useState } from 'react';
import {
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CContainer,
} from '@coreui/react';
import ClosetCategoryTab from './ClosetCategory';
import ClosetSubcategoryTab from './ClosetSubcategory';
import ClosetTypeSubcategoryTab from './closetTypeSubcategory';
// import CategoryTab from './CategoryTab';
// import SubcategoryTab from './SubcategoryTab'



const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabChange = (idx) => {
    console.log(idx, "idx")
    setActiveTab(idx);
    setRefreshKey((prevKey) => prevKey + 1); // Update key to force re-render
  };

  useEffect(() => {
    console.log(refreshKey, "idx");
  });

  return (
    <>
      {/* <h2>Admin Panel</h2> */}
      <CTabs key={refreshKey} activeTab={activeTab} onActiveTabChange={handleTabChange}>
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink onClick={() => setActiveTab(0)} active={activeTab === 0}>
              Closet Category 
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => setActiveTab(1)} active={activeTab === 1}>
              Closet Subcategory
            </CNavLink>
          </CNavItem>
          {/* <CNavItem>
            <CNavLink onClick={() => setActiveTab(2)} active={activeTab === 2}>
              Closet Type in subcategory
            </CNavLink>
          </CNavItem> */}
        </CNav>
        
        <CTabContent>
          <CTabPane visible={activeTab === 0}>
            <ClosetCategoryTab />
          </CTabPane>
          <CTabPane visible={activeTab === 1}>
            <ClosetSubcategoryTab />
          </CTabPane>
          <CTabPane visible={activeTab === 2}>
            <ClosetTypeSubcategoryTab />
          </CTabPane>
        </CTabContent>
      </CTabs>
    </>
  );
};

export default AdminPanel;
