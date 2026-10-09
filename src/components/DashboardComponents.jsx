import { useLocation } from 'react-router-dom';
import DashboardOverview, { MessagesScreen } from './DashboardOverview';
import OrderContent from './OrderContent';
import AddressContent from './AddressContent';
import PaymentContent from './PaymentContent';
import AccountContent from './AccountContent';
import Specifications from '../pages/Specifications';

const DashboardComponents = () => {
  const { pathname } = useLocation();
  const accountPath = pathname.replace(/\/+$/, '') || '/';

  switch (accountPath) {
    case '/my-account':
      return <DashboardOverview />;
    case '/my-account/orders':
      return <OrderContent />;
    case '/my-account/submissions':
      return <DashboardOverview />;
    case '/my-account/specification':
      return <Specifications />;
    case '/my-account/messages':
      return <MessagesScreen />;
    case '/my-account/edit-address':
      return <AddressContent />;
    case '/my-account/payment-methods':
      return <PaymentContent />;
    case '/my-account/edit-account':
      return <AccountContent />;
    default:
      return <h1>Page not found</h1>;
  }
};

export default DashboardComponents;
