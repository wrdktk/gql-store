import React, { Component } from 'react';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id:ID!){
    deleteItem(id:$id){
      id
    }
  }
`;

class DeleteItem extends Component {
  render() {
    return (
      <button>{this.props.children}</button>
    );
  }
}

export default DeleteItem;