import { useNavigate, useParams } from "react-router-dom";
import { QuotationItem, QuotationService } from "../services/QuotationService";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { AuctionService, ItemToAuction } from "../services/AuctionService";
import ErrorList from "./ErrorList";
import ViewContainer from "./ViewContainer";

const ConvertToAuctionView = () => {
    const [items, setItems] = useState<QuotationItem[]>([]);
    const [itemsToAuctions, setItemsToAuctions] = useState<ItemToAuction[]>([]);

    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState({});

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => QuotationService.listQuotationVisitItems(
        parseInt(id!),
        (items) => {
            setItems(items);
            setItemsToAuctions(items.map((item) => new ItemToAuction(item.id!)))
        },
        (_) => setError({ unknown: ['Could not get quotation items. Please try again later'] })
    ), []);

    const updateItemStartingBid = (index: number, value: any) => {
        if (value !== '' && !isNaN(Number(value))) {
            const newItemsToAuctions = [...itemsToAuctions];
            const item = newItemsToAuctions[index];
            item.starting_bid = value;
            setItemsToAuctions(newItemsToAuctions);
        }
    };
    const updateItemClosesAt = (index: number, value: Date) => {
        const newItemsToAuctions = [...itemsToAuctions];
        const item = newItemsToAuctions[index];
        item.closes_at = value;
        setItemsToAuctions(newItemsToAuctions);
    };

    const convert = () => AuctionService.convertToAuctions(
        parseInt(id!),
        itemsToAuctions,
        (_) => {
            const message = `Created auctions successfully!`;
            setSuccessMessage(message);
            setError({});
        },
        (error) => {
            if (error.response.status === 400) {
                setError({ data: ['Check your data: Starting bids must be positive numbers and closing date must be in the future!'] });
            } else {
                setError({ unknown: ['Something went wrong'] });
            }
        }
    );

    const handleCloseModal = () => navigate("/admin");

    return <ViewContainer>
        <Container>
            <h1 className="display-5">Creating new auctions</h1>
            {Object.keys(error).length > 0 && <Alert variant='danger'>
                <ErrorList error={error} />
            </Alert>}
            <Row>
                <Col md={4}><h3>Item</h3></Col>
                <Col md={4}><h3>Starting Bid</h3></Col>
                <Col md={4}><h3>Closes At</h3></Col>
            </Row>
            {itemsToAuctions.map((item, index) => <Row key={item.item_id}>
                <Col><Form.Control type="text" value={items[index].name} readOnly={true} /></Col>
                <Col>
                    <Form.Control type="number" value={item.starting_bid} onChange={(e) => updateItemStartingBid(index, e.target.value)} />
                </Col>
                <Col>
                    <Form.Control type="date" value={item.closes_at.toISOString().split('T')[0]} onChange={(e) => updateItemClosesAt(index, new Date(e.target.value))} />
                </Col>
            </Row>)}
            <Row className="mt-3">
                <Col md={4} />
                <Col md={4}>
                    <Button variant="primary" onClick={convert}>Create Auctions</Button>
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
        </Container>
    </ViewContainer>;
};

export default ConvertToAuctionView;
