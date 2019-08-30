import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart'; 

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    //local data/state
    clientState: {
      resolvers: {
        Mutatation: {
          toggleCart(_, variables, { cache }) {
            // read the cart open value from cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY
            })
          }
        }
      },
      defaults: {
        cartOpen: true
      }
    }
  });
}

export default withApollo(createClient);
