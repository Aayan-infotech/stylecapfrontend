import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTachometerAlt,
  faUser,
  faTshirt,
  faShoePrints,
  faHatCowboy,
  faStar,
  faBell,
  faBoxOpen,
  faHiking,
  faUserCheck,
  faSpa,
  faBrush,
  faStore,
} from '@fortawesome/free-solid-svg-icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <FontAwesomeIcon icon={faTachometerAlt} style={{ color: 'blue' }} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'User Management',
    to: '/userManagement',
    icon: <FontAwesomeIcon icon={faUser} style={{ color: 'green' }} className="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Closet Management',
    icon: <FontAwesomeIcon icon={faTshirt} style={{ color: 'orange' }} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Cloths',
        to: '/closetManagement/cloths',
        style: { marginLeft: '20px' },
        icon: <FontAwesomeIcon icon={faTshirt} style={{ color: 'purple' }} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Shoes',
        to: '/closetManagement/shoes',
        style: { marginLeft: '20px' },
        icon: <FontAwesomeIcon icon={faShoePrints} style={{ color: 'brown' }} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Accessories',
        to: '/closetManagement/accessories',
        style: { marginLeft: '20px' },
        icon: <FontAwesomeIcon icon={faHatCowboy} style={{ color: 'red' }} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Miscellaneous',
        to: '/closetManagement/miscellaneous',
        style: { marginLeft: '20px' },
        icon: <FontAwesomeIcon icon={faBoxOpen} style={{ color: 'teal' }} className="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Subscription Management',
    to: '/subscriptionManagement',
    icon: <FontAwesomeIcon icon={faStar} style={{ color: 'brown' }} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Stylist Management',
    to: '/stylistManagement',
    icon: <FontAwesomeIcon icon={faBrush} style={{ color: 'pink' }} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Market Place',
    to: '/marketPlace',
    icon: <FontAwesomeIcon icon={faStore} style={{ color: 'purple' }} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Review Managment',
    to: '/reviewManagement',
    icon: <FontAwesomeIcon icon={faStar} style={{ color: 'brown' }} className="nav-icon" />,
  },
]

export default _nav
