import { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Avatar,
  IconButton, Autocomplete, CircularProgress, Divider, Skeleton,
} from '@mui/material';
import { PhotoCamera, Person, LocationOn, Phone } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profileApi';
import { validators, validateSchema, hasErrors } from '../../utils/formValidation';

const COUNTRIES_API = 'https://countriesnow.space/api/v0.1';

const INITIAL = { firstName: '', lastName: '', userName: '', mobile: '', address: '', country: '', state: '', city: '', pincode: '' };

const SectionTitle = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    {icon}
    <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
  </Box>
);

function ProfilePage() {
  const { user, setUser } = useAuth();
  const fileRef = useRef();

  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [file, setFile]     = useState(null);
  const [loading, setLoading] = useState(false);

  const [countries, setCountries]         = useState([]);
  const [states, setStates]               = useState([]);
  const [cities, setCities]               = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [geoLoading, setGeoLoading]       = useState(true);

  // Populate form from user context
  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName || '',
      lastName:  user.lastName  || '',
      userName:  user.userName  || '',
      mobile:    user.mobile    || '',
      address:   user.address   || '',
      country:   user.country   || '',
      state:     user.state     || '',
      city:      user.city      || '',
      pincode:   user.pincode   || '',
    });
    setPreview(user.profileUrl || null);
  }, [user]);

  // Load countries once
  useEffect(() => {
    fetch(`${COUNTRIES_API}/countries/positions`)
      .then(r => r.json())
      .then(d => setCountries((d.data || []).map(c => c.name).sort()))
      .catch(() => {})
      .finally(() => setGeoLoading(false));
  }, []);

  // Load states on country change
  useEffect(() => {
    if (!form.country) { setStates([]); setCities([]); return; }
    setStatesLoading(true);
    fetch(`${COUNTRIES_API}/countries/states`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: form.country }),
    })
      .then(r => r.json())
      .then(d => setStates((d.data?.states || []).map(s => s.name)))
      .catch(() => setStates([]))
      .finally(() => setStatesLoading(false));
  }, [form.country]);

  // Load cities on state change
  useEffect(() => {
    if (!form.country || !form.state) { setCities([]); return; }
    setCitiesLoading(true);
    fetch(`${COUNTRIES_API}/countries/state/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: form.country, state: form.state }),
    })
      .then(r => r.json())
      .then(d => setCities(d.data || []))
      .catch(() => setCities([]))
      .finally(() => setCitiesLoading(false));
  }, [form.country, form.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateSchema({
      firstName: [validators.required('First Name'), validators.minLength('First Name', 1), validators.maxLength('First Name', 50)],
    }, form);
    if (hasErrors(errs)) return setErrors(errs);

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (file) fd.append('file', file);

      const res = await updateProfile(fd);
      const updated = res.data?.data?.user;
      if (updated) {
        setUser(prev => ({ ...prev, ...updated }));
        if (updated.profileUrl) setPreview(updated.profileUrl);
      }
      toast.success('Profile updated successfully!');
      setFile(null);
    } catch (err) {
      const status = err.response?.data?.code;
      const message = err.response?.data?.message;
      if (status === 409) {
        setErrors(p => ({ ...p, userName: message }));
      } else {
        toast.error('Failed to update profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: '100%' }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>My Profile</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Avatar Card */}
        <Paper elevation={2} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar src={preview} sx={{ width: 96, height: 96, fontSize: 36 }}>
              {!preview && ((user?.firstName?.[0] || user?.userName?.[0] || 'U').toUpperCase())}
            </Avatar>
            <IconButton
              size="small"
              onClick={() => fileRef.current.click()}
              sx={{
                position: 'absolute', bottom: 0, right: 0,
                bgcolor: 'primary.main', color: '#fff',
                width: 28, height: 28,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <PhotoCamera sx={{ fontSize: 15 }} />
            </IconButton>
            <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.userName || '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            <Typography variant="caption" color="text.secondary">
              Click the camera icon to change your profile photo
            </Typography>
          </Box>
        </Paper>

        {/* Basic Info */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <SectionTitle icon={<Person color="primary" />} title="Basic Information" />
          <Divider sx={{ mb: 2.5 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="First Name" name="firstName" value={form.firstName}
              onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} fullWidth
            />
            <TextField
              label="Last Name" name="lastName" value={form.lastName}
              onChange={handleChange} fullWidth
            />
            <TextField
              label="Username" name="userName" value={form.userName}
              onChange={handleChange} error={!!errors.userName} helperText={errors.userName || 'Unique. Used for login. Only letters, numbers, underscores.'} fullWidth
            />
            <TextField
              label="Email" value={user?.email || ''} disabled fullWidth
              helperText="Email cannot be changed"
            />
          </Box>
        </Paper>

        {/* Contact */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <SectionTitle icon={<Phone color="primary" />} title="Contact" />
          <Divider sx={{ mb: 2.5 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Mobile" name="mobile" value={form.mobile}
              onChange={handleChange} error={!!errors.mobile} helperText={errors.mobile} fullWidth
            />
            <TextField
              label="Address" name="address" value={form.address}
              onChange={handleChange} fullWidth
            />
          </Box>
        </Paper>

        {/* Location */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <SectionTitle icon={<LocationOn color="primary" />} title="Location" />
          <Divider sx={{ mb: 2.5 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {geoLoading ? (
              [1, 2, 3, 4].map(i => <Skeleton key={i} variant="rounded" height={56} />)
            ) : (
              <>
                <Autocomplete
                  options={countries}
                  value={form.country || null}
                  onChange={(_, val) => setForm(p => ({ ...p, country: val || '', state: '', city: '' }))}
                  renderInput={(params) => <TextField {...params} label="Country" />}
                />
                <Autocomplete
                  options={states}
                  value={form.state || null}
                  onChange={(_, val) => setForm(p => ({ ...p, state: val || '', city: '' }))}
                  disabled={!form.country}
                  loading={statesLoading}
                  renderInput={(params) => (
                    <TextField {...params} label="State" InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{statesLoading && <CircularProgress size={16} />}{params.InputProps.endAdornment}</>,
                    }} />
                  )}
                />
                <Autocomplete
                  options={cities}
                  value={form.city || null}
                  onChange={(_, val) => setForm(p => ({ ...p, city: val || '' }))}
                  disabled={!form.state}
                  loading={citiesLoading}
                  renderInput={(params) => (
                    <TextField {...params} label="City" InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{citiesLoading && <CircularProgress size={16} />}{params.InputProps.endAdornment}</>,
                    }} />
                  )}
                />
                <TextField
                  label="Pincode" name="pincode" value={form.pincode}
                  onChange={handleChange} fullWidth
                />
              </>
            )}
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 160 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfilePage;
