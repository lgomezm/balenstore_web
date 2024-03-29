import { useEffect, useState } from "react";
import { QuotationItem, QuotationService } from "../services/QuotationService";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useNavigate, useParams } from "react-router-dom";
import ViewContainer from "./ViewContainer";

const ListQuotationItemsView = () => {
    const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();
    const { quotationVisitId } = useParams();

    useEffect(() => QuotationService.listQuotationVisitItems(
        parseInt(quotationVisitId!),
        (quotationItems) => setQuotationItems(quotationItems),
        (_) => setIsError(true)
    ), []);

    const isAdmin = localStorage.getItem('user_type') === 'Admin';

    return <ViewContainer>
        {isError && <Alert variant='danger'>Could not get quotation items. Please try again later.</Alert>}
        <Container>
            <Row>
                <Col md={isAdmin ? 12 : 10}>
                    <h1>Quotation items</h1>
                </Col>
                {!isAdmin && <Col md={2}>
                    <Button variant="primary" onClick={() => navigate(`/quotation-visits/${parseInt(quotationVisitId!)}/items/new`)}>Add item</Button>
                </Col>}
            </Row>
        </Container>
        <table className="table table-striped mt-3">
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
                    <td><Button variant="primary" onClick={() => navigate(`/quotation-visits/${parseInt(quotationVisitId!)}/items/edit/${quotationItem.id}`)}>Edit</Button></td>
                </tr>)}
            </tbody>
        </table>
    </ViewContainer>;
};

export default ListQuotationItemsView;
