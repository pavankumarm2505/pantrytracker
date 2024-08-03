'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, query, doc, deleteDoc, getDocs, getDoc, setDoc, docRef } from 'firebase/firestore';
import { firestore } from "./firebase";
import CustomizedTables from "./table";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Camera from "./camera";
import Alert from "./alert";
import  HomePage  from "./home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import RecipeSuggestions from "./RecipeSuggestions";
import { getRecipeSuggestions } from './openai';
import dynamic from 'next/dynamic';
const BrowserRouter = dynamic(() => import('react-router-dom').then(mod => mod.BrowserRouter), { ssr: false });


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [editOpen, setEditOpen] = useState(false);
  const [editItemName, setEditItemName] = useState('');
  const [editQuantity, setEditQuantity] = useState(0);
  const [value, setValue] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState('');
  

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await deleteDoc(docRef)
    }
    await updateInventory()
  }

  const editItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    await setDoc(docRef, { quantity });
    updateInventory();
    setEditOpen(false);

  }

  useEffect(() => {
    updateInventory()
  }, [])
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecipeOpen = async () => {
    setRecipeOpen(true);
    setLoading(true);
    const recipeText = await getRecipeSuggestions(inventory.map(item => item.name));
    setRecipe(recipeText);
    setLoading(false);
  };

  const handleRecipeClose = () => {
    setRecipeOpen(false);
    setRecipe('');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/inventory" element={
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box position="absolute" top="50%" left="50%" bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{
          transform: "translate(-50%, -50%)"
        }}>
          <Typography variant="h6" component="h2"> Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variants="outlined"
              fullWidth
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              type="string"
            />
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>Done</Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h2" > Inventory Tracker</Typography>
      <TextField
              variant="outlined"
              placeholder="Search items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              fullWidth
              margin="normal"
            />
      <Button variant="contained" onClick={() => {
        handleOpen()
      }}>Add New item</Button>
      <Tabs value={value} onChange={handleChange} centered>
      <Tab label="Add Items Manually" />
      <Tab label="Add Items Using Camera" />
      </Tabs>
      {value ===0 && (<CustomizedTables inventory={filteredInventory} removeItem={removeItem} setEditItemName={setEditItemName}
        setEditQuantity={setEditQuantity}
        setEditOpen={setEditOpen} />)}
      {value === 1 && (
        <Box>
          {/* Add Using Camera Content */}
          
          <Camera updateInventory={updateInventory} setValue={setValue} setAlertMessage={setAlertMessage} setAlertOpen={setAlertOpen}/>
        </Box>
      )}
      

      <Modal open={editOpen} onClose={() => setEditOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box position="absolute" top="50%" left="50%" bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%, -50%)" }}>
          <Typography variant="h6" component="h2">Edit Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <Typography variant="body1" component="p">{editItemName}</Typography>
            <TextField variant="outlined" fullWidth value={editQuantity} onChange={e => setEditQuantity(Number(e.target.value))} type="number" />
            <Button variant="outlined" onClick={() => {
              editItem(editItemName, editQuantity);
            }}>Save</Button>
          </Stack>
        </Box>
      </Modal>
      <Alert open={alertOpen} onClose={handleAlertClose} message={alertMessage} />
      <Button variant="contained" color="secondary" onClick={handleRecipeOpen}>Use AI to Get a Recipe</Button>
      <Modal open={recipeOpen} onClose={handleRecipeClose} aria-labelledby="recipe-modal-title" aria-describedby="recipe-modal-description">
              <Box position="absolute" top="50%" left="50%" bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%, -50%)", width: '50%', maxHeight: '50%', overflowY: 'auto', overflowX: 'hidden' }}>
                <Typography variant="h6" component="h2" id="recipe-modal-title">AI-Generated Recipe</Typography>
                {loading ? (
                  <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <CircularProgress />
                  </Box>
                ) : (
                  <Typography variant="body1" component="pre" id="recipe-modal-description" sx={{ overflowY: 'auto', overflowX: 'hidden', whiteSpace: 'pre-wrap' }} >
                    {recipe}
                  </Typography>
                )}
              </Box>
            </Modal>
    </Box>
} />
</Routes>
</BrowserRouter>
);
}
