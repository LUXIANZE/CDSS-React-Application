import React, { useState, useEffect } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import validate from 'validate.js';
import { FormHelperText } from '@material-ui/core';

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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#b71c1c'
    },
    secondary: {
      main: '#43a047'
    }
  },
});

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
  },
  updateButton: {
    color: theme.palette.success
  }
}));


export default function PatientUpdateModal({patient}) {
  let oriVal = patient;
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: patient,
    errors: {}
  });
  
  const [open, setOpen] = React.useState(false);

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
      }
    }));

    console.log(formState.values);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFormState(formstate => ({
      ...formState,
      values:oriVal
    }))
    setOpen(false);
  };

  const hasError = field => formState.errors[field] ? true : false;

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Update
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update {patient.name}'s info</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update desired fields regarding patient's info
          </DialogContentText>
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
          
        </DialogContent>
        <DialogActions>
          <ThemeProvider theme={theme}>
            <Button 
              variant='outlined' 
              onClick={handleClose} 
              color='primary'
              >
              Cancel
            </Button>
          </ThemeProvider>
          <Mutation mutation={UPDATEPATIENT_MUTATION} variables={formState.values} onCompleted={ () => {window.location.replace('http://localhost:3000/patients')}}>
            {updatePatient => 
              <ThemeProvider theme={theme}>
                <Button
                  variant="outlined"
                  disabled={!formState.isValid}
                  color="secondary"
                  onClick={updatePatient}
                >
                  Update
                </Button>
              </ThemeProvider>
            }
          </Mutation>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const UPDATEPATIENT_MUTATION = gql`
  mutation UpdatePatient($id:ID!, $name: String!, $ic: String!, $assignedClinician: String!){
    updatePatient(id:$id, name: $name, ic: $ic, assignedClinician: $assignedClinician){
      name
      ic
    }
  }
`
