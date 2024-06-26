import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export class QuotationVisit {
    id?: number;
    scheduled_at: Date;
    name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
    status: string;
    user?: number;
    created_at?: Date;

    constructor(scheduledAt: Date, name: string, address1: string, address2: string, city: string, state: string, zip: string, status: string) {
        this.scheduled_at = scheduledAt;
        this.name = name;
        this.address_1 = address1;
        this.address_2 = address2;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.status = status;

    }
}

export class QuotationItem {
    id?: number;
    name: string;
    year: number;
    manufacturer: string;
    country: string;
    description: string;
    quotation_visit?: number;
    image_url?: string;
    created_at?: Date;

    constructor(name: string, year: number, manufacturer: string, country: string, description: string, image_url?: string) {
        this.name = name;
        this.description = description;
        this.year = year;
        this.manufacturer = manufacturer;
        this.country = country;
        this.image_url = image_url;
    }
}

type OnQuotationVisitSuccess = (response: QuotationVisit) => void;

type OnQuotationItemSuccess = (response: QuotationItem) => void;

type OnQuotationVisitListSuccess = (response: QuotationVisit[]) => void;

type OnQuotationItemListSuccess = (response: QuotationItem[]) => void;

type OnError = (error: any) => void;

const getQuotationVisit = (id: string, onSuccess: OnQuotationVisitSuccess, onError: OnError): void => {
    axios.get<QuotationVisit>(
        `${API_URL}/api/quotation_visits/${id}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
}

const createQuotationVisit = (quotationVisit: QuotationVisit, onSuccess: OnQuotationVisitSuccess, onError: OnError): void => {
    axios.post<QuotationVisit>(
        `${API_URL}/api/quotation_visits/`,
        quotationVisit,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

const updateQuotationVisit = (id: number, quotationVisit: QuotationVisit, onSuccess: OnQuotationVisitSuccess, onError: OnError): void => {
    axios.put<QuotationVisit>(
        `${API_URL}/api/quotation_visits/${id}`,
        quotationVisit,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

const listQuotationVisits = (onSuccess: OnQuotationVisitListSuccess, onError: OnError): void => {
    axios.get<QuotationVisit[]>(
        `${API_URL}/api/quotation_visits/`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
}

const deleteQuotationVisit = (id: number, onSuccess: OnQuotationVisitSuccess, onError: OnError): void => {
    axios.delete<QuotationVisit>(
        `${API_URL}/api/quotation_visits/${id}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
}

const getQuotationItem = (quotationVisitId: number, quotationItemId: number, onSuccess: OnQuotationItemSuccess, onError: OnError): void => {
    axios.get<QuotationItem>(
        `${API_URL}/api/quotation_visits/${quotationVisitId}/items/${quotationItemId}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

const createQuotationItem = (quotationVisitId: number, quotationItem: QuotationItem, onSuccess: OnQuotationItemSuccess, onError: OnError): void => {
    axios.post<QuotationItem>(
        `${API_URL}/api/quotation_visits/${quotationVisitId}/items`,
        quotationItem,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

const updateQuotationItem = (quotationVisitId: number, quotationItem: QuotationItem, onSuccess: OnQuotationItemSuccess, onError: OnError): void => {
    axios.put<QuotationItem>(
        `${API_URL}/api/quotation_visits/${quotationVisitId}/items/${quotationItem.id}`,
        quotationItem,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

const listQuotationVisitItems = (quotationVisitId: number, onSuccess: OnQuotationItemListSuccess, onError: OnError): void => {
    axios.get<QuotationItem[]>(
        `${API_URL}/api/quotation_visits/${quotationVisitId}/items`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
}

const deleteQuotationItem = (quotationVisitId: string, quotationItemId: string, onSuccess: OnQuotationItemSuccess, onError: OnError): void => {
    axios.delete<QuotationItem>(
        `${API_URL}/api/quotation_visits/${quotationVisitId}/items/${quotationItemId}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
}

const uploadItemPicture = (file: File,
    onSuccess: (url: string) => void,
    onError: (errors: string[]) => void): void => {
    const apiUrl = `${API_URL}/api/quotation_visits/items/upload`;
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ file_name: file.name }),
    }).then(async (response) => {
        if (!response.ok) {
            onError(['Could not initiate upload']);
        } else {
            const responseBody = await response.json();
            const finalUrl = responseBody.final_url;
            response = await fetch(responseBody.url, {
                method: 'PUT',
                body: file
            });
            if (!response.ok) {
                onError(['Could not upload image']);
            } else {
                onSuccess(finalUrl);
            }
        }
    });
};

export const QuotationService = {
    getQuotationVisit,
    createQuotationVisit,
    updateQuotationVisit,
    listQuotationVisits,
    deleteQuotationVisit,
    getQuotationItem,
    createQuotationItem,
    updateQuotationItem,
    listQuotationVisitItems,
    deleteQuotationItem,
    uploadItemPicture,
};
