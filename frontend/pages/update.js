import UpdateItem from '../components/UpdateItem';
const Edit = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

export default Edit;