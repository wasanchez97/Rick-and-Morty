import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import useFetch from './hooks/UseFetch';
import GetRandomNumbers from './helpers/getRandomNumber';
import LocationInfo from './components/LocationInfo';
import ResidentCard from './components/ResidentCard';
import getNumbers from './helpers/getNumbers';
import Loader from './components/Loader';

function App() {
  const [locationID, setLocationID] = useState(GetRandomNumbers(126));
  const [errorMessage, setErrorMessage] = useState('');
  const [showLoader, setShowLoader] = useState(true);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [loadingStarted, setLoadingStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const cardsPerPage = 8; // Máximo de tarjetas por página

  const url = `https://rickandmortyapi.com/api/location/${locationID}`;
  const [location, getLocation, hasError, isLoading] = useFetch(url);
  const [locations, getLocations, hasErrorLocations, isLoadingLocations] = useFetch(
    `https://rickandmortyapi.com/api/location/${getNumbers()}`
  );

  useEffect(() => {
    setLoadingStarted(true);
    setShowLoader(true);
    getLocation();
  }, [locationID]);

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    if (!isLoading && allImagesLoaded && loadingStarted) {
      const timer = setTimeout(() => {
        setShowLoader(false);
        setLoadingStarted(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else if (isLoading) {
      setShowLoader(true);
    }
  }, [isLoading, allImagesLoaded, loadingStarted]);

  useEffect(() => {
    const handleImagesLoad = () => {
      if (location && location.residents) {
        const imagePromises = location.residents.map(url => new Promise(resolve => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }));

        Promise.all(imagePromises).then(() => {
          setAllImagesLoaded(true);
        });
      } else {
        setAllImagesLoaded(true);
      }
    };

    handleImagesLoad();
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = inputName.current.value.trim();
    const selectedLocation = locations.find(
      (location) => location.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (inputValue) {
      setLocationID(selectedLocation ? selectedLocation.id : null);
      setErrorMessage(selectedLocation ? '' : 'No location found with that name');
      inputName.current.value = '';
      setCurrentPage(1); // Resetear la página a 1
    }
  };

  const inputName = useRef();

  // Obtener las tarjetas actuales basadas en la paginación
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = location?.residents.slice(indexOfFirstCard, indexOfLastCard);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='app flex-container'>
      <header className='app_hero'>
        <img className='hero_image' src='/img/RickandMorty.png' alt='Hero Image' />
      </header>
      <section className='app_body'>
        <form className='form' onSubmit={handleSubmit}>
          <input
            className='form_input'
            type='text'
            placeholder='Search location name'
            ref={inputName}
            list='locations'
          />
          <datalist id='locations'>
            {isLoadingLocations ? (
              <option>
                <Loader />
              </option>
            ) : (
              locations?.map((location) => <option value={location.name} key={location.id}></option>)
            )}
          </datalist>
          <button className='form_btn'>Search</button>
        </form>
        {showLoader ? (
          <div className='loader-container'>
            <Loader />
          </div>
        ) : errorMessage ? (
          <h1>{errorMessage}</h1>
        ) : (
          <>
            <LocationInfo location={location} />
            <section className='cards_container flex-container'>
              {currentCards?.map((url) => (
                <ResidentCard key={url} url={url} />
              ))}
            </section>
            <div className="pagination">
              {[...Array(Math.ceil(location?.residents.length / cardsPerPage)).keys()].map(number => (
                <button 
                  key={number} 
                  onClick={() => paginate(number + 1)} 
                  className={currentPage === number + 1 ? 'active' : ''}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
