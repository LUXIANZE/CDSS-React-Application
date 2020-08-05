import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import gql from 'graphql-tag';
import { Mutation } from '@apollo/react-components';
import clsx from 'clsx';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

import { getInitials } from 'helpers';
import MuiButton from 'theme/overrides/MuiButton';
import PatientUpdateModal from '../PatientUpdateModal';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#b71c1c'
    },
  },
});

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const DELETE_PATIENT_MUTATION = gql`
  mutation DeletePatient( $id: ID!){
    deletePatient(id: $id)
  }
`;

const PatientsTable = props => {
  const { className, users, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    const { users } = props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = users.map(user => user.id);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelectedUsers);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const SortBy_ID = () => {
    users.sort(function(a,b){
      if(a.id === b.id) return 0;
      if(a.id < b.id) return -1;
      if(a.id > b.id) return 1;
    });
  }
  const SortBy_Name = () => {
    users.sort(function(a,b){
      let aa = a.name.toLowerCase();
      let bb = b.name.toLowerCase();

      if(aa === bb) return 0;
      if(aa < bb) return -1;
      if(aa > bb) return 1;
    });
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === users.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < users.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell> */}
                  <TableCell><Link onClick={SortBy_Name} to="/patients">Name ▾</Link></TableCell>
                  <TableCell><Link onClick={SortBy_ID} to="/patients">ID ▾</Link></TableCell>
                  {/* <TableCell>Location</TableCell> */}
                  <TableCell>I/C</TableCell>
                  <TableCell>Registration date</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(0, rowsPerPage).map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.id}
                    selected={selectedUsers.indexOf(user.id) !== -1}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.indexOf(user.id) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, user.id)}
                        value="true"
                      />
                    </TableCell> */}
                    <TableCell>
                      <div className={classes.nameContainer}>
                        {/* <Avatar
                          className={classes.avatar}
                          src={user.avatarUrl}
                        >
                          {getInitials(user.name)}
                        </Avatar> */}
                        <Typography variant="body1">{user.name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.id}</TableCell>
                    {/* <TableCell>
                      {user.address.city}, {user.address.state},{' '}
                      {user.address.country}
                    </TableCell> */}
                    <TableCell>{user.ic}</TableCell>
                    <TableCell>
                      {moment(user.createdAt).format("DD/MM/YYYY (hh:mm)")}
                    </TableCell>
                    <TableCell>
                      <PatientUpdateModal patient={user}/>
                    </TableCell>
                    <TableCell>
                      <Mutation mutation={DELETE_PATIENT_MUTATION} onCompleted={() => window.location.reload("http://localhost:3000/patients")}>
                        {(deletePatient, { loading, error }) => (
                          <ThemeProvider theme={theme}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => deletePatient({variables:{id:user.id}})}
                              >
                              Delete
                            </Button>
                            {loading && <p>Loading...</p>}
                            {error && <p>Error :( Please try again</p>}
                          </ThemeProvider>
                        )}
                      </Mutation>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

PatientsTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default PatientsTable;
