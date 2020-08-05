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
  TablePagination,
  Divider,
  Grid
} from '@material-ui/core';

import { getInitials } from 'helpers';
import MuiButton from 'theme/overrides/MuiButton';

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

const DecisionReports = props => {
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
                  <TableCell>Pathology Report</TableCell>
                  <TableCell>Histology Report</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {users.pathologyReport? users.pathologyReport.map(report=><Typography variant="h1" style={{margin:"10px"}}>{report.title}</Typography>): <span>loading</span>}
                  </TableCell>
                  <TableCell>
                    {users.histologyReport? users.histologyReport.map(report=><Typography variant="h1" style={{margin:"10px"}}>{report.title}</Typography>): <span>loading</span>}
                  </TableCell>
                </TableRow>
                <TableCell style={{width:"50%"}}>
                    {users.histologyReport? users.pathologyReport.map(report=><Typography style={{margin:"10px"}}>{report.content}</Typography>): <span>loading</span>}
                  </TableCell>
                <TableCell style={{width:"50%"}}>
                    {users.histologyReport? users.histologyReport.map(report=><Typography style={{margin:"10px"}}>{report.content}</Typography>): <span>loading</span>}
                </TableCell>
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

DecisionReports.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default DecisionReports;
