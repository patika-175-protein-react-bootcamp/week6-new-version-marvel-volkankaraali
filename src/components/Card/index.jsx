import React from 'react';
import { Link } from 'react-router-dom';

function Card({ data }) {
  return (
    <Link to={`detail/${data.id}`}>
      <div className="card">
        <div>
          <img src={data.thumbnail.path + '.' + data.thumbnail.extension} alt={data.name} />
        </div>
        <p>{data.name}</p>
      </div>
    </Link>
  );
}

export default Card;