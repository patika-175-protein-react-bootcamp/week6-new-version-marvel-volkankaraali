import React, { useEffect, useState } from 'react';

import Loading from '../../constant/icons/Loading';
import MarvelService from '../../services/marvelService';
import Card from '../Card';
import Pagination from '../Pagination';

function Cards() {
  const [characters, setCharacter] = useState([]);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(true);

  //creates marvelservice for manage api request.
  let marvelService = new MarvelService();

  useEffect(() => {
    setLoading(true);

    /*
    before request to api, if there is current page in session storage,reads data in storage.
    if there isnt, gets new request.
    */

    let charactersInStorage = JSON.parse(sessionStorage.getItem('charactersInSessionStorage')) || [];
    let isTherePageInStorage = charactersInStorage.filter(item => item.page == currentPage && item);

    if (isTherePageInStorage.length > 0) {
      setCharacter(isTherePageInStorage[0]?.characters);

      setTotalCharacters(sessionStorage.getItem('totalCharacters'));
      setLoading(false);

    } else {
      getCharactersByPage(currentPage);
    }


  }, [currentPage]);


  const getCharactersByPage = (pageNumber) => {
    setLoading(true);

    marvelService.getCharactersByPage(pageNumber)
      .then(res => {

        //creates new session storage and add new page's characters to new session storage.
        let newCharactersInSessionStorage = JSON.parse(sessionStorage.getItem('charactersInSessionStorage')) || [];
        newCharactersInSessionStorage.push({ page: pageNumber, characters: res.data.data.results });

        //sets new storage to session storage and state.
        sessionStorage.setItem('charactersInSessionStorage', JSON.stringify(newCharactersInSessionStorage));
        setCharacter(res.data.data.results);

        //sets total characters to state in api.
        sessionStorage.setItem('totalCharacters', res.data.data.total);
        setTotalCharacters(res.data.data.total);
        setLoading(false);

      });
  };
  return (
    <>
      <div className="cards">
        {
          loading ? <div className='loading'><Loading /></div> : (
            characters.map(item => (
              <Card key={item.id} data={item} />
            ))
          )
        }

      </div>
      <Pagination totalCharacters={totalCharacters} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  );
}

export default Cards;