import { Box, Stack, Typography, TextField, InputLabel, Button } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { allCountryName } from "../../../allCountryName";
import Selector from '../../../components/Selector';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { setKycStep } from '../../../globalState/kycState/kycStateSlice';
import { personalInfoVerificationSchema } from './personalInfoVerificationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useGetUserDataQuery, useUpdateProfileMutation } from "../../../globalState/userState/userStateApis"
import dayjs from 'dayjs';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';
import CountrySelect from '../../../components/CountryCodeSelector';


function PersonalInfoVerification() {

  const dispatch = useDispatch()

  // const [method, setMethod] = useState(personalInfoVerificationCountryData.length > 0 ? personalInfoVerificationCountryData[0].name : "")

  const { token } = useSelector((state) => state.auth);
  const { data, isLoading: userDataLoading, refetch } = useGetUserDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  })

  const userCountry = userDataLoading ? "" : data?.data?.userData?.country

  // const handleChange = (event) => {
  //   setMethod(event.target.value);
  // };

  const defaultValues = {
    name: "",
    // mobile: "",
    dob: null,
    gender: "",
    address: ""
  };

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(personalInfoVerificationSchema),
    defaultValues,
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const onSubmit = async (formData) => {

    try {
      const response = await updateProfile(formData).unwrap();
      if (response?.status) {
        refetch()
        dispatch(setKycStep("documentsVerification"))
        dispatch(setNotification({ open: true, message: `${response?.message} | also your level one verification done`, severity: "success" }));
        reset(defaultValues);
      }
    } catch (error) {
      if (!error?.data?.status) {
        dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
      }
    }

  };


  return (
    <Stack
      sx={{ gap: ".7rem" }}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography
        sx={{
          fontWeight: 600,
          lineHeight: "32px",
          fontSize: "28px"
        }}
      >Add profile information</Typography>
      <Stack sx={{ gap: "1.5rem" }}>
        {/* <Box>
          <InputLabel sx={{ mb: ".5rem", fontSize: "12px" }}>First Name</InputLabel>
          <TextField size='small' fullWidth variant="outlined" />
          <InputLabel sx={{ mt: "2px", fontSize: "12px" }}>Your first name as shown on your ID</InputLabel>
        </Box>
        <Box>
          <InputLabel sx={{ mb: ".5rem", fontSize: "12px" }}>Last Name</InputLabel>
          <TextField size='small' fullWidth variant="outlined" />
          <InputLabel sx={{ mt: "2px", fontSize: "12px" }}>Your last name as shown on your ID</InputLabel>
        </Box> */}
        <Box>
          <InputLabel sx={{ mb: ".5rem", fontSize: "12px" }}>Full Name</InputLabel>
          <TextField {...register("name", { required: true })} size='small' fullWidth variant="outlined" placeholder='Enter your full name' />
          {errors.name && <Typography color="error" fontSize={"14px"}>{errors.name.message}</Typography>}
          {/* <InputLabel sx={{ mt: "2px", fontSize: "12px" }}>Enter your full name</InputLabel> */}
        </Box>
        <Box>
          <InputLabel sx={{ fontSize: "12px" }}>Date of birth</InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                // value={watch("dob")}
                value={watch("dob")}
                // onChange={(dateValue) => setValue("dob", dayjs(dateValue).format("DD-MM-YYYY"), { shouldValidate: true })}
                onChange={(dateValue) => setValue("dob", dayjs(dateValue), { shouldValidate: true })}
                label="Select date of birth"
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </DemoContainer>
          </LocalizationProvider>
          {errors.dob && <Typography color="error" fontSize={"14px"}>{errors.dob.message}</Typography>}
        </Box>
        <Box>
          <InputLabel sx={{ mb: ".5rem", fontSize: "12px" }}>Country</InputLabel>
          <Selector
            items={allCountryName}
            value={userCountry}
            shouldBeFullWidth={true}
            shouldBeDisabled={true}
            // onChange={handleChange}
            showDefaultOption={false}
          />
        </Box>
        <Box>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label" sx={{ fontSize: "12px" }}>Your Gender</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={watch("gender")}
              onChange={(e) => setValue("gender", e.target.value, { shouldValidate: true })}
            >
              <FormControlLabel value="F" control={<Radio />} label="Female" />
              <FormControlLabel value="M" control={<Radio />} label="Male" />
              <FormControlLabel value="T" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
          {errors.gender && <Typography color="error" fontSize={"14px"}>{errors.gender.message}</Typography>}
        </Box>
        {/* <Box>
          <InputLabel sx={{ mb: ".5rem", fontSize: "12px" }}>Your region</InputLabel>
          <Selector
            items={personalInfoVerificationCountryData}
            selected={method}
            shouldBeFullWidth={true}
            onChange={handleChange}
            showDefaultOption={false}
          />
        </Box> */}
        <Box>
          <InputLabel sx={{ mb: ".5rem", fontSize: "12px" }}>Your residential address</InputLabel>
          <TextField {...register("address", { required: true })} size='small' placeholder='City, Street, house (apartment)' fullWidth variant="outlined" />
          <InputLabel sx={{ mt: "2px", fontSize: "12px" }}>You will be asked to verify your address later</InputLabel>
          {errors.address && <Typography color="error" fontSize={"14px"}>{errors.address.message}</Typography>}
        </Box>
      </Stack>
      <Button
        variant='contained'
        type='submit'
        disabled={isLoading}
        sx={{
          textTransform: "capitalize",
          boxShadow: "none",
          color: "white",
          mt: '1.5rem',
          alignSelf: "self-end",
          "&:hover": {
            boxShadow: "none"
          }
        }}
      >Continue</Button>
    </Stack>
  )
}

export default PersonalInfoVerification;