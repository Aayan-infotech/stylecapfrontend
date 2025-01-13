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
import MarketplaceTab from './MarketTab';
import CategoryTab from './CategoryTab';
import SubcategoryTab from './SubcategoryTab'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* <h2>Admin Panel</h2> */}
      <CTabs activeTab={activeTab} onActiveTabChange={(idx) => setActiveTab(idx)}>
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink onClick={() => setActiveTab(0)} active={activeTab === 0}>
              Marketplace
            </CNavLink>
          </CNavItem>
          {/* <CNavItem>
            <CNavLink onClick={() => setActiveTab(1)} active={activeTab === 1}>
              Categories
            </CNavLink>
          </CNavItem> */}
          <CNavItem>
            <CNavLink onClick={() => setActiveTab(2)} active={activeTab === 2}>
              Products
            </CNavLink>
          </CNavItem>
        </CNav>
        
        <CTabContent>
          <CTabPane visible={activeTab === 0}>
            <MarketplaceTab />
          </CTabPane>
          <CTabPane visible={activeTab === 1}>
            <CategoryTab />
          </CTabPane>
          <CTabPane visible={activeTab === 2}>
            <SubcategoryTab />
          </CTabPane>
        </CTabContent>
      </CTabs>
    </>
  );
};

export default AdminPanel;
