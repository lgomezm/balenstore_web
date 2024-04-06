import { SetStateAction, useCallback, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { QuotationService, QuotationItem } from "../services/QuotationService";
import ErrorList from "./ErrorList";
import { useNavigate, useParams } from "react-router-dom";
import ViewContainer from "./ViewContainer";
import { FileRejection, useDropzone } from "react-dropzone";

const CreateQuotationItemView = () => {
    const [name, setName] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [manufacturer, setManufacturer] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>(undefined);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
                setExistingImageUrl(item.image_url);
            },
            (_) => setError({ unknown: ['Something went wrong'] })
        );
    }, []);

    const handleYearChange = (value: string) => {
        if (value === '' || !isNaN(Number(value))) {
            setYear(value === '' ? '' : Number(value));
        }
    };

    const handleError = (error: { response: { status: number; data: SetStateAction<{}>; }; }) => {
        if (error.response.status === 400) {
            setError(error.response.data);
        } else {
            setError({ unknown: ['Something went wrong'] });
        }
    };

    const onDrop = useCallback((accFiles: File[], _rejFiles: FileRejection[]) => {
        if (accFiles.length > 0) {
            setFile(accFiles[0])
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop,
        accept: { 'image/*': [] },
        maxSize: 10000 * 1024,
    });

    const onSubmit = () => {
        if (file) {
            QuotationService.uploadItemPicture(
                file,
                saveItem,
                ([errors]) => setError({ unknown: [errors] }),
            )
        } else {
            saveItem(undefined);
        }
    };

    const saveItem = (uploadedImageUrl?: string) => {
        let imageUrl: string | undefined;
        if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl;
        } else if (existingImageUrl) {
            imageUrl = existingImageUrl;
        }
        const quotationItem = new QuotationItem(name, Number(year), manufacturer, country, description, imageUrl);
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
                handleError,
            )
        } else {
            QuotationService.createQuotationItem(
                parseInt(quotationVisitId!),
                quotationItem,
                (_) => {
                    setSuccessMessage('The quotation item has been created!');
                    setError({});
                },
                handleError,
            )
        }
    };

    const deleteQuotationItem = () => QuotationService.deleteQuotationItem(
        quotationVisitId!, id!,
        (_) => {
            setSuccessMessage('The quotation item has been deleted successfully!');
            setError({});
        },
        (error) => {
            if (error.response.status === 400) {
                setError(error.response.data);
            } else {
                setError({ unknown: ['Something went wrong'] });
            }
        }
    );

    const handleCloseModal = () => navigate(`/quotation-visits/${quotationVisitId}/items`);

    return <ViewContainer>
        <Container>
            <h1 className="display-5">New quotation item</h1>
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

                <Col md={12} className="my-2">
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        {file ? <p>Selected file: {file.name}</p> : <p>Drop an awesome picture of the item here!</p>}
                    </div>
                </Col>

                <Col md={4} />
                <Col md={4} className="align-items-center text-center mt-4">
                    <Button variant='primary' onClick={onSubmit}>Submit</Button>&nbsp;
                    {id && <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete</Button>}
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
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Quotation Visit</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this quotation visit?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteQuotationItem}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    </ViewContainer>;
};

export default CreateQuotationItemView;
