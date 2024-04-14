import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import LoginView from './components/LoginView'
import CreateQuotationVisitView from './components/CreateQuotationVisit'
import CreateQuotationItemView from './components/CreateQuotationItemView'
import ConvertToAuctionView from './components/ConvertToAuctionView'
import ListQuotationVisitsView from './components/ListQuotationVisitsView'
import ListQuotationItemsView from './components/ListQuotationItemsView'
import ListAuctionsView from './components/ListAuctionsView'
import AuctionDetailsView from './components/AuctionDetailsView'
import { useEffect } from 'react'
import { AuthService } from './services/AuthService'

interface Props {
  view: React.ReactNode;
}

const PrivateRoute = ({ view }: Props) => {
  const navigate = useNavigate();
  useEffect(() => {
    AuthService.getMe(
      (_) => { },
      (_) => navigate('/login')
    )
  }, []);
  return view;
};

function App() {
  console.log('cargado...')
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/quotation-visits" element={<PrivateRoute view={<ListQuotationVisitsView />} />} />
      <Route path="/quotation-visits/new" element={<PrivateRoute view={<CreateQuotationVisitView />} />} />
      <Route path="/quotation-visits/edit/:id" element={<PrivateRoute view={<CreateQuotationVisitView />} />} />
      <Route path="/quotation-visits/:quotationVisitId/items" element={<PrivateRoute view={<ListQuotationItemsView />} />} />
      <Route path="/quotation-visits/:quotationVisitId/items/new" element={<PrivateRoute view={<CreateQuotationItemView />} />} />
      <Route path="/quotation-visits/:quotationVisitId/items/edit/:id" element={<PrivateRoute view={<CreateQuotationItemView />} />} />
      <Route path="/quotation-visits/:id/convert" element={<PrivateRoute view={<ConvertToAuctionView />} />} />
      <Route path="/auctions" element={<PrivateRoute view={<ListAuctionsView />} />} />
      <Route path="/auctions/:id" element={<PrivateRoute view={<AuctionDetailsView />} />} />
    </Routes>
  </BrowserRouter>
}

export default App
