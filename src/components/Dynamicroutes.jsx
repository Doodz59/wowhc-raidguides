import React from 'react'
import Routesdata from '../data/routes/routes.json'

export default function Dynamicroutes({ raidId }) {


  const route = Routesdata.find(r => r.id === raidId);

  if (!route) {
    return <p>Aucune route trouvée pour : {raidId}</p>;
  }

  return (
    <p>{route.path}</p>
  );
}
