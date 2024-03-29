import { useEffect, useState } from "react";
import { QuotationItem, QuotationService } from "../services/QuotationService";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const ListQuotationItemsView = () => {
    const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);

    const navigate = useNavigate();
    const { quotationVisitId } = useParams();

    useEffect(() => QuotationService.listQuotationVisitItems(
        parseInt(quotationVisitId!),
        (quotationItems) => setQuotationItems(quotationItems),
        (error) => console.log(error)
    ), []);

    return <table className="table table-striped">
        <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Year</th>
                <th scope="col">Country</th>
                <th scope="col">Manufacturer</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            {quotationItems.map(quotationItem => <tr key={quotationItem.id}>
                <td>{quotationItem.name}</td>
                <td>{quotationItem.year}</td>
                <td>{quotationItem.country}</td>
                <td>{quotationItem.manufacturer}</td>
                <td><Button variant="primary" onClick={() => navigate(`/quotation-views/${parseInt(quotationVisitId!)}/items/edit/${quotationItem.id}`)}>Edit</Button></td>
            </tr>)}
        </tbody>
    </table >
};

export default ListQuotationItemsView;
