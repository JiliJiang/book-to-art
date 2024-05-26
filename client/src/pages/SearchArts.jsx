import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { SAVE_ART } from '../utils/mutations';
import { saveArtIds, getSavedArtIds } from '../utils/localStorage';

import Auth from '../utils/auth';

const SearchArts = () => {
  // create state for holding returned google api data
  const [searchedArts, setSearchedArts] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved artId values
  const [savedArtIds, setSavedArtIds] = useState(getSavedArtIds());

  const [saveArt, { error }] = useMutation(SAVE_ART);

  // set up useEffect hook to save `savedArtIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveArtIds(savedArtIds);
  });

  // create method to search for arts and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const artData = items.map((art) => ({
        artId: art.id,
        authors: art.volumeInfo.authors || ['No author to display'],
        title: art.volumeInfo.title,
        description: art.volumeInfo.description,
        image: art.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedArts(artData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a art to our database
  const handleSaveArt = async (artId) => {
    // find the art in `searchedArts` state by the matching id
    const artToSave = searchedArts.find((art) => art.artId === artId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveArt({
        variables: { artData: { ...artToSave } },
      });
      console.log(savedArtIds);
      setSavedArtIds([...savedArtIds, artToSave.artId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Arts!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a art"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedArts.length
            ? `Viewing ${searchedArts.length} results:`
            : 'Search for a art to begin'}
        </h2>
        <Row>
          {searchedArts.map((art) => {
            return (
              <Col md="4" key={art.artId}>
                <Card border="dark" className='mb-3'>
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
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedArtIds?.some(
                          (savedId) => savedId === art.artId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveArt(art.artId)}
                      >
                        {savedArtIds?.some((savedId) => savedId === art.artId)
                          ? 'Art Already Saved!'
                          : 'Save This Art!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchArts;
