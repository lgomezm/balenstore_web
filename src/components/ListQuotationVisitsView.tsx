import { useEffect, useState } from "react";
import { QuotationService, QuotationVisit } from "../services/QuotationService";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ViewContainer from "./ViewContainer";

const ListQuotationVisitView = () => {
    const [quotationVisits, setQuotationVisits] = useState<QuotationVisit[]>([]);

    const navigate = useNavigate();

    useEffect(() => QuotationService.listQuotationVisits(
        (quotationVisits) => setQuotationVisits(quotationVisits),
        (error) => console.log(error)
    ), []);

    return <ViewContainer>
        <h1>Quotation visits</h1>
        <table className="table table-striped mt-3">
            <thead>
                <tr>
                    <th scope="col">Scheduled at</th>
                    <th scope="col">Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">City</th>
                    <th scope="col">State</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {quotationVisits.map(quotationVisit => <tr key={quotationVisit.id}>
                    <td>{quotationVisit.scheduled_at.toString().split('T')[0]}</td>
                    <td>{quotationVisit.name}</td>
                    <td>{quotationVisit.address_1}</td>
                    <td>{quotationVisit.city}</td>
                    <td>{quotationVisit.state}</td>
                    <td><Button variant="primary" onClick={() => navigate(`/quotation-visits/edit/${quotationVisit.id}`)}>Edit</Button></td>
                </tr>)}
            </tbody>
        </table >
    </ViewContainer>;
};

export default ListQuotationVisitView;
