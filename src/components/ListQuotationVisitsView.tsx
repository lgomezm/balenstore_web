import { useEffect, useState } from "react";
import { QuotationService, QuotationVisit } from "../services/QuotationService";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import ViewContainer from "./ViewContainer";

const ListQuotationVisitView = () => {
    const [quotationVisits, setQuotationVisits] = useState<QuotationVisit[]>([]);
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => QuotationService.listQuotationVisits(
        (quotationVisits) => setQuotationVisits(quotationVisits),
        (_) => setIsError(true)
    ), []);

    return <ViewContainer>
        {isError && <Alert variant='danger'>Could not get quotation visits. Please try again later.</Alert>}
        <Container>
            <Row>
                <Col md={10}>
                    <h1>Quotation visits</h1>
                </Col>
                <Col md={2}>
                    <Button variant="primary" onClick={() => navigate('/quotation-visits/new')}>Create new</Button>
                </Col>
            </Row>
        </Container>
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
                    <td>
                        <Button variant="primary" onClick={() => navigate(`/quotation-visits/edit/${quotationVisit.id}`)}>Edit</Button>&nbsp;
                        <Button variant="primary" onClick={() => navigate(`/quotation-visits/${quotationVisit.id}/items`)}>Items</Button>
                    </td>
                </tr>)}
            </tbody>
        </table >
    </ViewContainer>;
};

export default ListQuotationVisitView;
