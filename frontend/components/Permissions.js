import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

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
const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
]
 
const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
    <div>
      <Error error={error} />
        <h2>Manage Permissions </h2>
        <Table>
          <thead>
            <tr>
              <td>NAME</td>
              <td>EMAIL</td>
              {possiblePermissions.map(permission =>
                <th key={permission}>{permission}</th>)}
              <th>UPDATE</th>
            </tr>
          </thead>
          <tbody>
           {data.users.map(user=><UserPermissions user={user} key={user.id}/>)}
          </tbody>
        </Table>
    </div>
    )}
  </Query>
)

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
       name: PropTypes.string,
       email: PropTypes.string,
       id: PropTypes.string,
       permissions: PropTypes.array,
    }).isRequired,
  }

  state = {
    permissions: this.props.user.permissions,
  }

  handlePermissionChange = (e) => {
    const checkbox = e.target;
    //take copy of current permissions
    let updatedPermissions = [...this.state.permissions] 
    //determine whether to add or remove this permission
    if (checkbox.checked) {
    // add permission
      updatedPermissions.push(checkbox.value); 
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !==  checkbox.value )
    }
    this.setState({permissions: updatedPermissions})
}
  render() {
    const user = this.props.user;
    return (

      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}><input type="checkbox"
              checked={this.state.permissions.includes(permission)}
              value={permission}
            onChange={this.handlePermissionChange }/></label>
          </td>
        ))}
        <td><SickButton>Update</SickButton></td>
      </tr>
    )
  }
}

export default Permissions;