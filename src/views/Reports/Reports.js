import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { DecisionReports, DecisionToolbar } from './components';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';
// import mockData from './data';
// import data from 'views/Dashboard/components/LatestOrders/data';

export const PATIENT_QUERY = gql`
{
  patient(id: "5ee4f47df7c60e2168ff6ba5"){
    name
    createdAt
    pathologyReport{
      title
      content
    }
    histologyReport{
      title
      content
    }
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

const Reports = () => {
  const classes = useStyles();

  // const [users] = useState(mockData);
  const [patient, setPatient] = useState([]);

  return (
    <div className={classes.root}>
      <DecisionToolbar users={patient}/>
      <div className={classes.content}>
        <Query query={PATIENT_QUERY}>
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
              setPatient(data.patient);
            }
            return <DecisionReports users={patient}/>
          }}
        </Query>
      </div>
    </div>
  );
};

export default Reports;
