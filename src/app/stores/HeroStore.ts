import gql from "graphql-tag";

/*
  Defaults
*/

const heroDefaults = {
  currentHeros: [
    { id: "1", name: "message 1", __typename: "Hero" },
    { id: "2", name: "message 2", __typename: "Hero" }
  ]
};

/*
  GraphQL
*/

const heroQuery = gql`
  query GetHeros {
    currentHeros @client {
      id
      name
    }
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
  Cache Queries
*/
const heros = (_obj, { id }, { cache }) => {
  const query = heroQuery;
  // Read the Hero's from the cache
  const { currentHeros } = cache.readQuery({ query });

  return currentHeros.filter(todo => todo.id === id);
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
  },
  queries: {
    heros
  }
};

export { store };
