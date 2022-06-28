import './App.css';
import React from 'react';
import { Link } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import apiUrlMapping from './Resources/apiMapping.json'
import { DataGrid } from '@mui/x-data-grid';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';
import { GridToolbar } from '@mui/x-data-grid-pro';
import { DialogTitle } from '@mui/material';
import { TextField } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';


const geRowsWithId = (rows) => {
  let id = 0
  let completeRowListArray = []
  for (let row of rows) {
    const rowsWithId = {
      id: id,
      ...row
    }
    id++
    completeRowListArray.push(rowsWithId)
  }
  return completeRowListArray
}


export default function App() {

  const dragonTable = 
  [
    {
      field: 'actions',
      headerName: 'Preview',
      type: 'actions',
      width: 100,
      renderCell:(params)=>{
      return <GridActionsCellItem icon={<PreviewIcon onClick={()=>onPreviewClick(params.row.index)}/>} label="Preview" />
    },
    },
    {
      field: 'index',
      headerName: 'Index',
      renderCell:(params)=>(
        nameLink(params.value)
      ),
      width : 190
    },
    {
      field: 'name',
      headerName: 'Name',
      width : 190
    }
  ]

  const nameLink = (name) => {
    return <Link onClick={()=>onNameClick(name)}>{name}</Link>
  }

  const onNameClick=(name)=>{
    getNameRecords(name).then(response =>
      {
        setDataRows(response.data)
        setResName(response.data.name)
        handleClickOpen()
        }).catch((err)=>{
          handleErrClickOpen()
          setErrorStatus(err.message)
        });
  }
  const onPreviewClick=(name)=>{
    getNameRecords(name).then(response =>
      {
        setDataRows(response.data)
        setResName(response.data.name)
        setPreviewOpen(true)
        }).catch((err)=>{
          handleErrClickOpen()
          setErrorStatus(err.message)
        });
  }

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const [rows, setRows] = useState([])
  const [dataRows,setDataRows]= useState([])
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openOnError,setOpenOnError]=useState(false)
  const [resName, setResName] = useState("");
  const [errStatus,setErrorStatus]=useState("")
  const handleClose = () => {setOpen(false);};
  const handlePreviewClose = () => {setPreviewOpen(false);};
  const handleClickOpen = () => {setOpen(true);};
  const handleErrClickOpen = () => {setOpenOnError(true);};
  const handleErrClose = () => {setOpenOnError(false);};
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Retrieve All Records from Database
  const getAllRecords=()=>
  {
      axios.get(apiUrlMapping.dragonData.getAll).then(response =>
      {
        setRows(geRowsWithId(response.data.results))
        }).catch((err)=>{
          console.log(err)
          handleErrClickOpen()
          setErrorStatus(err.message)
      });
  }

  // Retrieve All Child Records from Database
  const getNameRecords=(name)=>
  {
    return axios.get(apiUrlMapping.dragonData.getAll+"/"+name)
  }

  useEffect(() => {getAllRecords()}, []);

 
  return (
    <div className="App">
      <div className="text-alligned">
        <h1>The 5th Edition Dungeons and Dragons API</h1>
      </div>
      <div style={{ height: "90vh", width: "100%" }}>
      <DataGrid
          rows = {rows}
          columns = {dragonTable}
          components={{Toolbar: GridToolbar,}}
          componentsProps={{toolbar: { showQuickFilter: true }}}
          pageSize={20}
          rowsPerPageOptions={[50]}
        />
  </div>

  <Dialog open={open} onClose={handleClose} sx={{"& .MuiDialog-container": { "& .MuiPaper-root": {width: "100%", maxWidth: "1000px",},},}}>
        <DialogTitle>Resource for {resName}</DialogTitle>
        <DialogContent>
        <TextField  margin="dense" id="index"  value = {dataRows.index} label="Index"type="text" fullWidth/>
        <TextField  margin="dense" id="name" value = {dataRows.name} label="Name" type="text" fullWidth />
        <TextField  margin="dense" id="outlined-multiline-static" label="Description" multiline value = {dataRows.desc} fullWidth/>
        <TextField  margin="dense" id="outlined-multiline-static" label="Higher Level" multiline value = {dataRows.higher_level} fullWidth/>
        <TextField  margin="dense" id="range" value = {dataRows.range} label="Range" type="text" fullWidth />
        <TextField  margin="dense" id="components" value = {dataRows.components} label="Components" type="text" fullWidth />
        <TextField  margin="dense" id="material" value = {dataRows.material} label="Material" type="text" fullWidth />
        <TextField  margin="dense" id="ritual" value = {dataRows.ritual} label="Ritual" type="text" fullWidth />
        <TextField  margin="dense" id="duration" value = {dataRows.duration} label="Duration" type="text" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
  </Dialog>
  <Dialog open={openOnError} onClose={handleErrClose}>
      <DialogContent> 
        <Alert severity="error">
          <AlertTitle >Error</AlertTitle>
          <strong>{errStatus} </strong>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleErrClose}>Cancel</Button>
      </DialogActions>
  </Dialog>
  <Dialog open={previewOpen} sx={{"& .MuiDialog-container": { "& .MuiPaper-root": {width: "100%", maxWidth: "750px",},},}}>
  <Card >
      <CardHeader
      action=
        {
          <IconButton  onClick={handlePreviewClose}> <CancelOutlinedIcon/></IconButton>
        }
        title={dataRows.name}
        subheader={dataRows.index}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {dataRows.desc}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{overflowY: "auto", maxHeight: "200px"}}>
        <TextField  margin="dense" id="outlined-multiline-static" label="Higher Level" multiline value = {dataRows.higher_level} fullWidth/>
        <TextField  margin="dense" id="range" value = {dataRows.range} label="Range" type="text" fullWidth />
        <TextField  margin="dense" id="components" value = {dataRows.components} label="Components" type="text" fullWidth />
        <TextField  margin="dense" id="material" value = {dataRows.material} label="Material" type="text" fullWidth />
        <TextField  margin="dense" id="ritual" value = {dataRows.ritual} label="Ritual" type="text" fullWidth />
        <TextField  margin="dense" id="duration" value = {dataRows.duration} label="Duration" type="text" fullWidth />
        </CardContent>
      </Collapse>
    </Card>
  </Dialog>
    </div>
  );
}