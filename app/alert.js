import React from 'react'
import {Snackbar, Alert as MuiAlert} from '@mui/material'

const Alert = ({open, onClose, message}) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <MuiAlert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </MuiAlert>
    </Snackbar>
  )
}

export default Alert;