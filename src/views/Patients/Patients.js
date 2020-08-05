import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { PatientsToolbar, PatientsTable } from './components';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';
import data from 'views/Dashboard/components/LatestOrders/data';

export const PATIENTS_QUERY = gql`
{
  patients{
    id
    name
    ic
    assignedClinician
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

const Patients = () => {
  const classes = useStyles();

  // const [users] = useState(mockData);
  const [patients, setPatients] = useState([]);

  return (
    <div className={classes.root}>
      <PatientsToolbar users={patients}/>
      <div className={classes.content}>
        <Query query={PATIENTS_QUERY}>
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
              setPatients(data.patients);
            }
            return <PatientsTable users={patients}/>
          }}
        </Query>
      </div>
    </div>
  );
};

export default Patients;
