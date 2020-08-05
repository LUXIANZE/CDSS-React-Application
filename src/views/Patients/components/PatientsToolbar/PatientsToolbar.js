import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { SearchInput } from 'components';
import { Link } from 'react-router-dom';



const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const PatientsToolbar = props => {
  
  const { className, ...rest } = props;
  
  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <span className={classes.spacer} />
        {/* <Button className={
          classes.importButton}
          color="primary"
          variant="contained"
        >
          FILTER
        </Button>
        <Button
          className={classes.exportButton}
          color="primary"
          variant="contained"
        >
          SORT BY
        </Button> */}
        {/* <Button className={classes.importButton}>Filter</Button>
        <Button className={classes.exportButton}>Sort by</Button> */}
        <Link to="/addPatientForm">
          <Button
            color="primary"
            variant="contained"
          >
            Add Patient
          </Button>
        </Link>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search Patient"
        />
      </div>
      {/* <UserAddPatientPopup/> */}
    </div>
  );
};

PatientsToolbar.propTypes = {
  className: PropTypes.string
};

export default PatientsToolbar;
