import React, { useState, useEffect } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  FormHelperText,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  ic: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 12
    }
  },
  assignedClinician: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 24
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const PatientAddForm = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values
      : {
        ...formState.values, [event.target.name]:event.target.value
        // [event.target.name]:
        //   event.target.type === 'checkbox'
        //     ? event.target.checked
        //     : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));

    console.log(formState.values);
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleAddPatient = event => {
    event.preventDefault();
    history.push('/');
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                // onSubmit={handleAddPatient}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Add new patient
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  create new patient with name and I/C
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('name')}
                  fullWidth
                  helperText={
                    hasError('name') ? formState.errors.name[0] : null
                  }
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.name || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('ic')}
                  fullWidth
                  helperText={
                    hasError('ic') ? formState.errors.ic[0] : null
                  }
                  label="I/C number"
                  name="ic"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.ic || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('assignedClinician')}
                  fullWidth
                  helperText={
                    hasError('assignedClinician') ? formState.errors.assignedClinician[0] : null
                  }
                  label="Assigned Clinician"
                  name="assignedClinician"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.assignedClinician || ''}
                  variant="outlined"
                />
                {hasError('policy') && (
                  <FormHelperText error>
                    {formState.errors.policy[0]}
                  </FormHelperText>
                )}
                <Mutation mutation={ADDPATIENT_MUTATION} variables={formState.values} onCompleted={ () => { window.location.replace("http://localhost:3000/patients") }
                }>
                  {addPatient => 
                    <Button
                      className={classes.signUpButton}
                      color="primary"
                      disabled={!formState.isValid}
                      fullWidth
                      size="large"
                      variant="contained"
                      onClick={addPatient}
                    >
                      Add Patient
                    </Button>
                  }
                </Mutation>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

const ADDPATIENT_MUTATION = gql`
  mutation AddPatient($name: String!, $ic: String!, $assignedClinician: String!){
    addPatient(name: $name, ic: $ic, assignedClinician: $assignedClinician){
      name
      ic
    }
  }
`

PatientAddForm.propTypes = {
  history: PropTypes.object
};

export default PatientAddForm;
