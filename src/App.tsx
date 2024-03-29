import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginView from './components/LoginView'
import AdminHome from './components/AdminHome'
import UserHome from './components/UserHome'
import CreateQuotationVisitView from './components/CreateQuotationVisit'
import CreateQuotationItemView from './components/CreateQuotationItemView'
import ConvertToAuctionView from './components/ConvertToAuctionView'
import ListQuotationVisitsView from './components/ListQuotationVisitsView'
import ListQuotationItemsView from './components/ListQuotationItemsView'
import ListAuctionsView from './components/ListAuctionsView'
import AuctionDetailsView from './components/AuctionDetailsView'

function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/home" element={<UserHome />} />
      <Route path="/quotation-views" element={<ListQuotationVisitsView />} />
      <Route path="/quotation-views/new" element={<CreateQuotationVisitView />} />
      <Route path="/quotation-views/edit/:id" element={<CreateQuotationVisitView />} />
      <Route path="/quotation-views/:quotationVisitId/items" element={<ListQuotationItemsView />} />
      <Route path="/quotation-views/:quotationVisitId/items/new" element={<CreateQuotationItemView />} />
      <Route path="/quotation-views/:quotationVisitId/items/edit/:id" element={<CreateQuotationItemView />} />
      <Route path="/quotation-views/:id/convert" element={<ConvertToAuctionView />} />
      <Route path="/auctions" element={<ListAuctionsView />} />
      <Route path="/auctions/:id" element={<AuctionDetailsView />} />
    </Routes>
  </BrowserRouter>
}

export default App
