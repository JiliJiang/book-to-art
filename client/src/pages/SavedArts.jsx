import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_ART } from '../utils/mutations';
import { removeArtId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedArts = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeArt, { error }] = useMutation(REMOVE_ART);

  const userData = data?.me || {};
console.log("userData", userData)
  // create function that accepts the art's mongo _id value as param and deletes the art from the database
  const handleDeleteArt = async (artId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeArt({
        variables: { artId },
      });

      // upon success, remove art's id from localStorage
      removeArtId(artId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing {userData.username}'s arts!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedArts?.length
            ? `Viewing ${userData.savedArts.length} saved ${userData.savedArts.length === 1 ? 'art' : 'arts'
            }:`
            : 'You have no saved arts!'}
        </h2>
        <div>
          <Row>
            {userData.savedArts?.map((art) => {
              return (
                <Col md="4">
                  <Card key={art.artId} border="dark">
                    {art.image ? (
                      <Card.Img
                        src={art.image}
                        alt={`The cover for ${art.title}`}
                        variant="top"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{art.title}</Card.Title>
                      <p className="small">Authors: {art.authors}</p>
                      <Card.Text>{art.description}</Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteArt(art.artId)}
                      >
                        Delete this Art!
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default SavedArts;
