import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



export default function CustomizedTables({ inventory, removeItem, setEditItemName, setEditQuantity, setEditOpen }) {
  return (
    <TableContainer component={Paper} sx={{maxHeight:400}}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Item</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map((item) => (
            <StyledTableRow key={item.name}>
              <StyledTableCell component="th" scope="row">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </StyledTableCell>
              <StyledTableCell align="center">{item.quantity}</StyledTableCell>
              <StyledTableCell align="center" >
                <Box display="flex" justifyContent="center" gap = {2}>
                <Button variant="contained" color="secondary" onClick={() => removeItem(item.name)} >
                  Remove
                </Button>
                
                <Button variant="contained" color="primary" onClick={() => {
                  setEditItemName(item.name);
                  setEditQuantity(item.quantity);
                  setEditOpen(true);
                }}>
                  Edit
                </Button>

                </Box>
                
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}