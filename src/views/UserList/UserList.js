import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { UsersToolbar, UsersTable } from './components';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';
import mockData from './data';
import data from 'views/Dashboard/components/LatestOrders/data';

export const CLINICIANS_QUERY = gql`
{
  clinicians{
    id
    name
    email
    createdAt
  }
}
`;

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UserList = () => {
  const classes = useStyles();

  const [users] = useState(mockData);
  const [clinicians, setClinicians] = useState([]);

  return (
    <div className={classes.root}>
      <UsersToolbar users={clinicians}/>
      <div className={classes.content}>
        <Query query={CLINICIANS_QUERY}>
          {result => {
            const { loading, error, data } = result;

            
            if (loading) {
              return <div>Loading</div>;
            }
            if (error) {
              console.log(error);
              return <h1>ERROR</h1>;
            }
            if (data){
              setClinicians(data.clinicians);
            }
            return <UsersTable users={clinicians}/>
          }}
        </Query>
      </div>
    </div>
  );
};

export default UserList;
