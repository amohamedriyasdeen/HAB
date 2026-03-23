import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

function FormModal({ open, title, onClose, onSubmit, children, formData, mode = 'add', submitText, maxWidth = 'sm' }) {
  const isViewMode = mode === 'view';
  const defaultSubmitText = mode === 'add' ? 'Add' : mode === 'edit' ? 'Update' : 'OK';

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        {!isViewMode && (
          <Button onClick={() => onSubmit(formData)} variant="contained" color="primary">
            {submitText || defaultSubmitText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

FormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  formData: PropTypes.object,
  children: PropTypes.node.isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'view']),
  submitText: PropTypes.string,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

export default FormModal;
