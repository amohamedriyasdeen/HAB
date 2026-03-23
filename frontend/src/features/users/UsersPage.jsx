import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Box, Typography, IconButton, Switch, Chip, Tooltip, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormModal from '../../components/common/FormModal';
import { fetchAllUsers, createUser, updateUser, updateUserStatus, deleteUserById } from '../../services/userApi';
import { validators, validateSchema, hasErrors } from '../../utils/formValidation';

const EDIT_FIELD_CONFIG = {
  userName: { disabled: false, readOnly: false },
  email:    { disabled: false, readOnly: true },
  mobile:   { disabled: false, readOnly: false },
};

const CREATE_INITIAL = { userName: '', email: '', mobile: '', password: '', confirmPassword: '' };
const EDIT_INITIAL   = { userName: '', email: '', mobile: '', password: '', confirmPassword: '' };

function AddUserModal({ open, onClose, onCreated }) {
  const [formData, setFormData] = useState(CREATE_INITIAL);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (data) => {
    const schema = {
      userName:        [validators.required('Name'), validators.minLength('Name', 2), validators.maxLength('Name', 50)],
      email:           [validators.required('Email'), validators.email('Email')],
      password:        [validators.required('Password'), validators.minLength('Password', 6)],
      confirmPassword: [validators.required('Confirm Password'), validators.passwordMatch(data.password)],
    };
    const errs = validateSchema(schema, data);
    if (hasErrors(errs)) return setErrors(errs);

    try {
      const res = await createUser(data);
      onCreated(res.data?.data?.user);
      toast.success('User created successfully!');
      setFormData(CREATE_INITIAL);
      setErrors({});
      onClose();
    } catch (err) {
      if (err.response?.data?.code === 409) {
        setErrors(prev => ({ ...prev, email: err.response.data.message }));
      } else {
        toast.error('Failed to create user.');
      }
    }
  };

  return (
    <FormModal open={open} title="Add User" mode="add" formData={formData} onClose={onClose} onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField label="Name" name="userName" value={formData.userName} onChange={handleChange} error={!!errors.userName} helperText={errors.userName} fullWidth />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} fullWidth />
        <TextField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} error={!!errors.mobile} helperText={errors.mobile} fullWidth />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} fullWidth />
        <TextField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} fullWidth />
      </Box>
    </FormModal>
  );
}

function EditUserModal({ open, record, onClose, onUpdated }) {
  const [formData, setFormData] = useState(EDIT_INITIAL);
  const [changePassword, setChangePassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (record) {
      setFormData({ ...EDIT_INITIAL, userName: record.userName ?? '', email: record.email ?? '', mobile: record.mobile ?? '' });
      setChangePassword(false);
      setErrors({});
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (data) => {
    const schema = {
      userName: [validators.required('Name'), validators.minLength('Name', 2), validators.maxLength('Name', 50)],
      ...(changePassword && {
        password:        [validators.required('Password'), validators.minLength('Password', 6)],
        confirmPassword: [validators.passwordMatch(data.password)],
      }),
    };
    const errs = validateSchema(schema, data);
    if (hasErrors(errs)) return setErrors(errs);

    try {
      const payload = changePassword ? data : (({ password, confirmPassword, ...rest }) => rest)(data);
      const res = await updateUser(record._id, payload);
      onUpdated(res.data?.data?.user);
      toast.success('Successfully Updated!');
      onClose();
    } catch {
      toast.error('Failed to update user.');
    }
  };

  return (
    <FormModal open={open} title="Edit User" mode="edit" formData={formData} onClose={onClose} onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField label="Name" name="userName" value={formData.userName} onChange={handleChange} error={!!errors.userName} helperText={errors.userName} fullWidth />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} disabled={EDIT_FIELD_CONFIG.email.disabled} InputProps={{ readOnly: EDIT_FIELD_CONFIG.email.readOnly }} error={!!errors.email} helperText={errors.email} fullWidth />
        <TextField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} error={!!errors.mobile} helperText={errors.mobile} fullWidth />
        <FormControlLabel
          control={<Checkbox checked={changePassword} onChange={e => setChangePassword(e.target.checked)} size="small" />}
          label="Change Password"
        />
        {changePassword && (
          <>
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} fullWidth />
            <TextField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} fullWidth />
          </>
        )}
      </Box>
    </FormModal>
  );
}

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [confirmType, setConfirmType] = useState(null); // 'delete' | 'status'
  const [addOpen, setAddOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  useEffect(() => {
    fetchAllUsers()
      .then(res => setUsers(res.data.data.users))
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  const closeConfirm = () => { setUserId(null); setConfirmType(null); };

  const handleConfirm = async () => {
    try {
      if (confirmType === 'delete') {
        await deleteUserById(userId);
        setUsers(prev => prev.filter(u => u._id !== userId));
        toast.success('User deleted successfully!');
      } else {
        await updateUserStatus(userId);
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !u.isActive } : u));
        toast.success('Status updated successfully!');
      }
    } catch { toast.error('Operation failed!'); }
    closeConfirm();
  };

  const columns = [
    { title: 'ID', dataIndex: '_id', key: '_id' },
    { title: 'Name', dataIndex: 'userName', key: 'userName' },
    { title: 'Email', dataIndex: 'email', key: 'email', type: 'email' },
    {
      title: 'Role', dataIndex: 'roles', key: 'roles',
      render: (roles) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(roles?.length ? roles : [{ name: 'user' }]).map((role, i) => (
            <Chip key={i} label={role.name} size="small" className="chip-role" variant="outlined" />
          ))}
        </Box>
      ),
    },
    {
      title: 'Status', dataIndex: 'isActive', key: 'status',
      render: (isActive, record) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={isActive ? 'Deactivate' : 'Activate'} placement="top">
            <Switch checked={isActive} onChange={() => { setUserId(record._id); setConfirmType('status'); }} size="small" />
          </Tooltip>
          <Chip label={isActive ? 'Active' : 'Inactive'} size="small" className={isActive ? 'chip-active' : 'chip-inactive'} variant="outlined" />
        </Box>
      ),
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Edit" placement="top">
            <IconButton onClick={() => setEditRecord(record)} color="primary" size="small"><Edit fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top">
            <IconButton onClick={() => { setUserId(record._id); setConfirmType('delete'); }} color="error" size="small"><Delete fontSize="small" /></IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>Users Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>Add User</Button>
      </Box>

      <DataTable columns={columns} dataSource={users} showToolbar={false} checkboxSelection={true} />

      <ConfirmDialog
        open={confirmType === 'delete'}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
        confirmText="Delete"
      />

      <ConfirmDialog
        open={confirmType === 'status'}
        title="Change Status"
        message="Are you sure you want to change the user status?"
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />

      <AddUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(user) => { if (user) setUsers(prev => [...prev, user]); }}
      />

      <EditUserModal
        open={!!editRecord}
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onUpdated={(user) => { if (user) setUsers(prev => prev.map(u => u._id === user._id ? user : u)); }}
      />
    </Box>
  );
}

export default UsersPage;
