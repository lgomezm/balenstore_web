import axios from 'axios';
import { QuotationItem } from './QuotationService';

const API_URL = import.meta.env.VITE_API_URL || '';

export class ItemToAuction {
    item_id: number;
    starting_bid: number;
    closes_at: Date;

    constructor(itemId: number) {
        this.item_id = itemId;
        this.starting_bid = 0;
        this.closes_at = new Date();
    }
}

export class Auction {
    id: number;
    item: number;
    starting_bid: number;
    current_bid: number;
    closes_at: Date;
    created_at: Date;
    updated_at: Date;
    item_data?: QuotationItem;

    constructor(id: number, item: number, startingBid: number, closesAt: Date, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.item = item;
        this.starting_bid = startingBid;
        this.current_bid = 0;
        this.closes_at = closesAt;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
    }
}

export class Bid {
    id?: number;
    auction: number;
    bidder?: number;
    amount: number;
    created_at?: Date;

    constructor(auction: number, amount: number) {
        this.auction = auction;
        this.amount = amount;
    }
}

type OnAuctionListSuccess = (response: Auction[]) => void;

type OnAuctionSuccess = (response: Auction) => void;

type OnBidListSuccess = (response: Bid[]) => void;

type OnBidSuccess = (response: Bid) => void;

type OnError = (error: any) => void;

const convertToAuctions = (quotationVisitId: number, items: ItemToAuction[], onSuccess: OnAuctionListSuccess, onError: OnError): void => {
    axios.post<Auction[]>(
        `${API_URL}/api/auctions/convert`,
        { quotation_visit_id: quotationVisitId, items },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

const listAuctions = (onSuccess: OnAuctionListSuccess, onError: OnError): void => {
    axios.get<Auction[]>(
        `${API_URL}/api/auctions/`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
}

const getAuction = (id: string, onSuccess: OnAuctionSuccess, onError: OnError): void => {
    axios.get<Auction>(
        `${API_URL}/api/auctions/${id}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

const getBids = (auctionId: string, onSuccess: OnBidListSuccess, onError: OnError): void => {
    axios.get<Bid[]>(
        `${API_URL}/api/auctions/${auctionId}/bids`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
}

const placeBid = (auctionId: string, bid: number, onSuccess: OnBidSuccess, onError: OnError): void => {
    axios.post<Bid>(
        `${API_URL}/api/auctions/${auctionId}/bids`,
        { bid },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

export const AuctionService = {
    convertToAuctions,
    listAuctions,
    getAuction,
    getBids,
    placeBid,
};
