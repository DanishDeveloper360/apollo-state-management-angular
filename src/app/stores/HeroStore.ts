import gql from "graphql-tag";

/*
  Defaults
*/

const heroDefaults = {
  currentHeros: []
};

/*
  GraphQL
*/

const heroQuery = gql`
  query GetHeros {
    currentHeros @client
  }
`;

const clearHeroQuery = gql`
  mutation clearHero {
    clearHero @client
  }
`;

const addHeroQuery = gql`
  mutation addHero($item: String) {
    addHero(item: $item) @client
  }
`;

/*
  Cache Mutations
*/

const addHero = (_obj, { item }, { cache }) => {
  const query = heroQuery;
  // Read the Hero's from the cache
  const { currentHeros } = cache.readQuery({ query });

  // Add the item to the current Heros
  const updatedHeros = currentHeros.concat(item);

  // Update the cached Heros
  cache.writeQuery({ query, data: { currentHeros: updatedHeros } });

  return null;
};

const clearHero = (_obj, _args, { cache }) => {
  cache.writeQuery({ query: heroQuery, data: heroDefaults });
  return null;
};

/*
  Store
*/

/**
 * The Store object used to construct
 * Apollo Link State's Client State
 */
const store = {
  defaults: heroDefaults,
  mutations: {
    addHero,
    clearHero
  }
};

export { store };
