import { useEffect, useState } from "react";
import { Auction, AuctionService, Bid } from "../services/AuctionService";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import toStringDate from "../utils/DateUtils";
import { useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import ErrorList from "./ErrorList";
import ViewContainer from "./ViewContainer";

const AuctionDetailsView = () => {
    const [auction, setAuction] = useState<Auction | undefined>(undefined);
    const [bids, setBids] = useState<Bid[]>([]);

    const [bidAmount, setBidAmount] = useState<number | ''>('');
    const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState({});

    const { id } = useParams();

    const getBids = () => AuctionService.getBids(
        id!,
        (bids) => setBids(bids.reverse()),
        (error) => console.log(error)
    );

    const handleBidAmountChange = (value: string) => {
        if (value === '' || !isNaN(Number(value))) {
            setBidAmount(value === '' ? '' : Number(value));
        }
    };

    useEffect(() => {
        AuctionService.getAuction(
            id!,
            (auction) => setAuction(auction),
            (error) => console.log(error)
        );
        getBids();
    }, []);

    const placeBid = () => AuctionService.placeBid(
        id!, parseInt(bidAmount.toString()),
        (_) => {
            getBids();
            setShowPlaceBidModal(false);
            setSuccessMessage('Bid placed successfully!');
            setError({});
        },
        (error) => {
            if (error.response.status === 400) {
                setError(error.response.data);
            } else {
                setError({ unknown: ['Something went wrong'] });
            }
            setShowPlaceBidModal(false);
        }
    );

    return <ViewContainer>
        <Container>
            {successMessage && <Alert variant='success' dismissible>{successMessage}</Alert>}
            {Object.keys(error).length > 0 && <Alert variant='danger' dismissible onClose={() => setError({})}>
                <ErrorList error={error} />
            </Alert>}
            <Row>
                {auction && <Col md={10} className="text-start">
                    <h1>{auction.item_data!.name}</h1>
                    <p>{auction.item_data!.description}</p>
                    <p><strong>Current Bid:</strong> {auction.current_bid ? `${auction.current_bid}` : '-'}</p>
                    <p><strong>Starting Bid:</strong> ${auction.starting_bid}</p>
                    <p><strong>Open since:</strong> {toStringDate(auction.created_at)}</p>
                    <p><strong>Closes:</strong> {toStringDate(auction.closes_at)}</p>
                    <Button variant="primary" onClick={() => setShowPlaceBidModal(true)}>Place Bid</Button>
                </Col>}
                <Col md={2}>
                    <h3>Bid history</h3>
                    {bids.map((bid) => <Card className="mt-2">
                        <Card.Body>
                            <Card.Title>${bid.amount}</Card.Title>
                            <Card.Text>{toStringDate(bid.created_at!)}</Card.Text>
                        </Card.Body>
                    </Card>)}
                </Col>
            </Row>
            <Modal show={showPlaceBidModal} onHide={() => setShowPlaceBidModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Place a bid!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount:</Form.Label>
                        <Form.Control type="number" value={bidAmount} onChange={(e) => handleBidAmountChange(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={placeBid}>
                        Place Bid
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    </ViewContainer>;
};

export default AuctionDetailsView;
