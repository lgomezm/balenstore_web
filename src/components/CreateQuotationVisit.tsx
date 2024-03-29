import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { US_STATES } from "../utils/UsStates";
import { QuotationVisit, QuotationService } from "../services/QuotationService";
import { useNavigate, useParams } from "react-router-dom";
import ErrorList from "./ErrorList";

const CreateQuotationVisitView = () => {
    const [scheduledAt, setScheduledAt] = useState(new Date());
    const [name, setName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [status, setStatus] = useState('');
    const [quotationOwner, setQuotationOwner] = useState(0);

    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState({});

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            return;
        }
        QuotationService.getQuotationVisit(
            id,
            (quotation) => {
                setName(quotation.name);
                setAddress1(quotation.address_1);
                setAddress2(quotation.address_2);
                setCity(quotation.city);
                setState(quotation.state);
                setZip(quotation.zip);
                setStatus(quotation.status);
                setQuotationOwner(quotation.user!);
            },
            (_) => setError({ unknown: ['Something went wrong'] })
        );
    }, []);

    const onSubmit = () => {
        const quotationVisit = new QuotationVisit(
            scheduledAt,
            name,
            address1,
            address2,
            city,
            state,
            zip,
            status,
        );
        if (id) {
            quotationVisit.id = parseInt(id);
            quotationVisit.user = quotationOwner;
            QuotationService.updateQuotationVisit(
                quotationVisit.id,
                quotationVisit,
                (_) => {
                    setSuccessMessage('The quotation visit has been updated successfully!');
                    setError({});
                },
                (error) => {
                    if (error.response.status === 400) {
                        setError(error.response.data);
                    } else {
                        setError({ unknown: ['Something went wrong'] });
                    }
                }
            )
        } else {
            QuotationService.createQuotationVisit(
                quotationVisit,
                (_) => {
                    setSuccessMessage('The quotation visit has been created. It will be reviewed soon!');
                    setError({});
                },
                (error) => {
                    if (error.response.status === 400) {
                        setError(error.response.data);
                    } else {
                        setError({ unknown: ['Something went wrong'] });
                    }
                }
            )
        }
    };

    const handleCloseModal = () => navigate("/home");
    const goToConvert = () => navigate(`/quotation-views/${id}/convert`);

    return <Container>
        <Row>
            {Object.keys(error).length > 0 && <Alert variant='danger'>
                <ErrorList error={error} />
            </Alert>}
            <Col className="col-md-3">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Scheduled at</Form.Label>
                    <Form.Control type="date" value={scheduledAt.toISOString().split('T')[0]} onChange={(e) => setScheduledAt(new Date(e.target.value))} />
                </Form.Group>
            </Col>

            <Col className="col-md-9">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Name of this visit" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
            </Col>

            <Col className="col-md-6">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Address 1</Form.Label>
                    <Form.Control type="text" placeholder="Address line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
                </Form.Group>
            </Col>

            <Col className="col-md-6">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Address 2</Form.Label>
                    <Form.Control type="text" placeholder="Address line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
                </Form.Group>
            </Col>

            <Col className="col-md-4">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                </Form.Group>
            </Col>

            <Col className="col-md-4">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>State</Form.Label>
                    <Form.Select value={state} onChange={(e) => setState(e.target.value)}>
                        {Object.keys(US_STATES).map(abbreviation => <option key={abbreviation} value={abbreviation}>{US_STATES[abbreviation]}</option>)}
                    </Form.Select>
                </Form.Group>
            </Col>

            <Col className="col-md-4">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control type="number" placeholder="ZIP code" value={zip} onChange={(e) => setZip(e.target.value)} />
                </Form.Group>
            </Col>

            {localStorage.getItem('user_type') === 'Admin' ? <Col className="col-md-3">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Status</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option>Open this select menu</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </Form.Select>
                </Form.Group>
            </Col> : null}

            {localStorage.getItem('user_type') === 'Admin' ? <Col className="col-md-9"></Col> : null}

            <Col className="col-md-4"></Col>
            <Col className="col-md-4">
                <Button variant='primary' onClick={onSubmit}>Submit</Button>
            </Col>
            <Col className="col-md-4"></Col>
        </Row>
        {id && localStorage.getItem('user_type') === 'Admin' ? <Row>
            <Col md={4}>
                <Button variant="primary" onClick={goToConvert}>Convert to Auction</Button>
            </Col>
        </Row> : null}
        <Modal show={successMessage !== ''} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Success!</Modal.Title>
            </Modal.Header>
            <Modal.Body>{successMessage}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </Container>;
};

export default CreateQuotationVisitView;
