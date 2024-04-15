import { useEffect, useState } from "react";
import { Auction, AuctionService } from "../services/AuctionService";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import toStringDate from "../utils/DateUtils";
import { useNavigate } from "react-router-dom";
import ViewContainer from "./ViewContainer";

const ListAuctionsView = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => AuctionService.listAuctions(
        (auctions) => setAuctions(auctions),
        (_) => setIsError(true)
    ), []);

    return <ViewContainer>
        <Container>
            {isError && <Alert variant='danger'>Could not get auctions. Please try again later.</Alert>}
            <h1>Auctions</h1>
            <Row>
                {auctions.map((auction) => <Col key={auction.id} sm={6} md={4}>
                    <Card>
                        <Card.Img variant="top" src={auction.item_data?.image_url ?? 'https://d3m4dp4gwdswx.cloudfront.net/placeholder.avif'} />
                        <Card.Body>
                            <Card.Title>{auction.item_data!.name}</Card.Title>
                            <Card.Text>{auction.item_data!.description}</Card.Text>
                            <Card.Text><strong>Closes:</strong> {toStringDate(auction.closes_at)}</Card.Text>
                            <Card.Text><strong>Starting Bid:</strong> ${auction.starting_bid}</Card.Text>
                            <Card.Text><strong>Current Bid:</strong> {auction.current_bid ? `$${auction.current_bid}` : '-'}</Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/auctions/${auction.id}`)}>View details</Button>
                        </Card.Body>
                    </Card>
                </Col>)}
            </Row>
        </Container>
    </ViewContainer>;
};

export default ListAuctionsView;
