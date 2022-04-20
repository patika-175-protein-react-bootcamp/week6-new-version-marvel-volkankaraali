import React, { useEffect, useState } from 'react';

import MarvelService from '../../services/marvelService';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function SearchBar() {

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  //if api return 0 item according to input that will be true
  const [emptyResult, setEmptyResult] = useState(false);
  //that will be true while request to api
  const [loading, setLoading] = useState(false);

  //for languages
  const { t } = useTranslation();

  //for api management
  const marvelService = new MarvelService();

  useEffect(() => {
    findCharacterByInput(input, 5);

  }, [input]);

  const onChangeHandler = (e) => {
    setInput(e.target.value);
  };


  const findCharacterByInput = (input, limit) => {
    //api is require an input and limit for display suggestion list.
    //if input is not empty that will request to api for characters
    //if input char length bigger than 1 that will be request
    if (input !== '' && input.length > 1) {
      setLoading(true);
      setEmptyResult(false);

      marvelService.getCharactersByInput(input, limit)
        .then(res => {
          if (res.data?.data.results.length > 0) {
            setSuggestions(res.data?.data.results);
            setLoading(false);
          }
          else {
            setLoading(false);
            setEmptyResult(true);

          }
        })
        .catch(e => console.log(e));
    }
    else {
      setEmptyResult(false);
      setSuggestions([]);
    }
  };

  return (
    <div className='searchbar'>
      <label> {t('characterName')}</label>
      <div className='searchbarContainer'>

        <input type="text" placeholder={t('searchInput')} onChange={onChangeHandler} />

        {
          suggestions.length > 0 && (
            <div className='suggestions'>
              {
                loading ? <div className='suggestionItem'>{t('loading')}</div>
                  : (emptyResult ? <div className='suggestionItem'>{t('characterNotFound')}</div> : suggestions.map((item, i) => <div className='suggestionItem' key={i}> <Link to={`detail/${item.id}`}>{t('characterName')}: {item.name}</Link>  </div>))
              }
            </div>
          )
        }

        {
          emptyResult && (
            <div className='suggestions'>
              <div className='suggestionItem'>{t('characterNotFound')}</div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default SearchBar;