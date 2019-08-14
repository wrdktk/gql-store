import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY{
    users {
      id
      name
      email
      permissions
    } 
  }
`

 
const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
    <div>
      <Error error={error} />
      <p>hey</p>
    </div>
    )}
  </Query>
)

export default Permissions;