import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'

const CLIENT_ID = 'a66f346d75674f0cb2f6f2f26ef8c00d';
const CLIENT_SECRET = '3220ae4076d145f6bfaf984cf1a14be5';

function App() {
  const [description, setDescription] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    //API Access Token
    try{
    var authParam = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParam)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token));
    }
    catch (err){
      console.error(err.message);
    }
  },[]);

  //Search
  async function search(){
    var artistParam = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken 
      }
    }
    var artistId = await fetch('https://api.spotify.com/v1/search?q=' + description + '&type=artist', artistParam)
      .then(response => response.json())
      .then(data => {return data.artists.items[0].id});


    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistId + '/albums' + '?include_groups=album&market=US&limit=50', artistParam)
      .then(response => response.json())
      .then(data => {
        setAlbums(data.items);
      });
  }

  console.log(albums);
  return (
    <div className="App">
      <Container>
        <InputGroup className = "mb-3" size ="lg">
          <FormControl
            placeholder="Search for an Artist"
            type='input'
            onKeyDown={e => {
              if(e.key === "Enter") {
                search();
              }
            }}
            onChange={e => setDescription(e.target.value)}/>

            <Button 
              className = "btn btn-success"
              onClick={() => {
                search();
              }}>
                Search
            </Button>
        </InputGroup>
      </Container>
      
      <Container>
        <Row className='mx-2 row row-cols-4'>
        {albums.map((album, i) => {
          return (
            <Card>
            <Card.Img src = {album.images[0].url}/>
            <Card.Body>
                <Card.Title>{album.name}</Card.Title>
            </Card.Body>
            </Card>);
        })
        }
        </Row>
      </Container>
    </div>
  );
}

export default App;
