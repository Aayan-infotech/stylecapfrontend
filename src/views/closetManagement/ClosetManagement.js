import React, { useState } from 'react';
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
import ClosetTypeSubcategoryTab from './Accessories';
// import CategoryTab from './CategoryTab';
// import SubcategoryTab from './SubcategoryTab'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* <h2>Admin Panel</h2> */}
      <CTabs activeTab={activeTab} onActiveTabChange={(idx) => setActiveTab(idx)}>
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
          <CNavItem>
            <CNavLink onClick={() => setActiveTab(2)} active={activeTab === 2}>
              Closet Type in subcategory
            </CNavLink>
          </CNavItem>
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
