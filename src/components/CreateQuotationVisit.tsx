import { SetStateAction, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { US_STATES } from "../utils/UsStates";
import { QuotationVisit, QuotationService } from "../services/QuotationService";
import { useNavigate, useParams } from "react-router-dom";
import ErrorList from "./ErrorList";
import ViewContainer from "./ViewContainer";

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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
                setScheduledAt(new Date(quotation.scheduled_at));
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

    const handleError = (error: { response: { status: number; data: SetStateAction<{}>; }; }) => {
        if (error.response.status === 400) {
            setError(error.response.data);
        } else {
            setError({ unknown: ['Something went wrong'] });
        }
    };

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
                handleError,
            )
        } else {
            QuotationService.createQuotationVisit(
                quotationVisit,
                (_) => {
                    setSuccessMessage('The quotation visit has been created. It will be reviewed soon!');
                    setError({});
                },
                handleError,
            )
        }
    };

    const handleCloseModal = () => navigate("/quotation-visits");

    const deleteQuotationVisit = () => QuotationService.deleteQuotationVisit(
        parseInt(id!),
        (_) => {
            setSuccessMessage('The quotation visit has been deleted successfully!');
            setError({});
        },
        handleError,
    );

    return <ViewContainer>
        <Container>
            <h1>Quotation Visit</h1>
            <Row className="mt-3">
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
                        <Form.Control data-testid='visit-name' type="text" placeholder="Name of this visit" value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                </Col>

                <Col className="col-md-6">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Address 1</Form.Label>
                        <Form.Control data-testid='visit-address-1' type="text" placeholder="Address line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
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
                        <Form.Control data-testid='visit-city' type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    </Form.Group>
                </Col>

                <Col className="col-md-4">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>State</Form.Label>
                        <Form.Select data-testid='visit-state' value={state} onChange={(e) => setState(e.target.value)}>
                            {Object.keys(US_STATES).map(abbreviation => <option key={abbreviation} value={abbreviation}>{US_STATES[abbreviation]}</option>)}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col className="col-md-4">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Zip</Form.Label>
                        <Form.Control data-testid='visit-zip' type="number" placeholder="ZIP code" value={zip} onChange={(e) => setZip(e.target.value)} />
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
                    <Button variant='primary' data-testid='visit-submit-button' onClick={onSubmit}>Submit</Button>
                </Col>
                <Col className="col-md-4"></Col>
            </Row>
            {id && <hr />}
            {id && <Row className="mt-3">
                {localStorage.getItem('user_type') === 'Admin' ?
                    <Col md={4}>
                        <Button variant="success" onClick={() => navigate(`/quotation-visits/${id}/convert`)}>Convert to Auction</Button>
                    </Col> : <Col md={4} />}
                <Col md={4}>
                    <Button variant="primary" onClick={() => navigate(`/quotation-visits/${id}/items`)}>View Items</Button>
                </Col>
                <Col md={4}>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete</Button>
                </Col>
            </Row>}
            <Modal data-testid='visit-success-modal' show={successMessage !== ''} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title data-testid='visit-success-modal-title'>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body data-testid='visit-success-modal-body'>{successMessage}</Modal.Body>
                <Modal.Footer>
                    <Button data-testid='visit-success-modal-close-button' variant="primary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Quotation Visit</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this quotation visit?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteQuotationVisit}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    </ViewContainer>;
};

export default CreateQuotationVisitView;
