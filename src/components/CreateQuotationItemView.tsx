import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { QuotationService, QuotationItem } from "../services/QuotationService";
import ErrorList from "./ErrorList";
import { useNavigate, useParams } from "react-router-dom";

const CreateQuotationItemView = () => {
    const [name, setName] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [manufacturer, setManufacturer] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState({});

    const navigate = useNavigate();
    const { quotationVisitId, id } = useParams();

    useEffect(() => {
        if (!id) {
            return;
        }
        QuotationService.getQuotationItem(
            parseInt(quotationVisitId!),
            parseInt(id),
            (item) => {
                setName(item.name);
                setYear(item.year);
                setManufacturer(item.manufacturer);
                setCountry(item.country);
                setDescription(item.description);
            },
            (_) => setError({ unknown: ['Something went wrong'] })
        );
    }, []);

    const handleYearChange = (value: string) => {
        if (value === '' || !isNaN(Number(value))) {
            setYear(value === '' ? '' : Number(value));
        }
    };

    const onSubmit = () => {
        const quotationItem = new QuotationItem(name, Number(year), manufacturer, country, description);
        if (id) {
            quotationItem.id = parseInt(id);
            quotationItem.quotation_visit = parseInt(quotationVisitId!);
            QuotationService.updateQuotationItem(
                parseInt(quotationVisitId!),
                quotationItem,
                (_) => {
                    setSuccessMessage('The quotation item has been updated!');
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
            QuotationService.createQuotationItem(
                parseInt(quotationVisitId!),
                quotationItem,
                (_) => {
                    setSuccessMessage('The quotation item has been created!');
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

    return <Container>
        <h1 className="display-5">New quotation item for </h1>
        <Row>
            {Object.keys(error).length > 0 && <Alert variant='danger'>
                <ErrorList error={error} />
            </Alert>}

            <Col sm={12} md={3}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
            </Col>

            <Col sm={12} md={3}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Year</Form.Label>
                    <Form.Control type="number" value={year} onChange={(e) => handleYearChange(e.target.value)} />
                </Form.Group>
            </Col>

            <Col sm={12} md={3}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Manufacturer</Form.Label>
                    <Form.Control type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
                </Form.Group>
            </Col>

            <Col sm={12} md={3}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Country</Form.Label>
                    <Form.Control type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                </Form.Group>
            </Col>

            <Col sm={12} md={12}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
            </Col>

            <Col md={4} />
            <Col md={4} className="align-items-center text-center mt-4">
                <Button variant='primary' onClick={onSubmit}>Submit</Button>
            </Col>
            <Col md={4} />
        </Row>
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

export default CreateQuotationItemView;
