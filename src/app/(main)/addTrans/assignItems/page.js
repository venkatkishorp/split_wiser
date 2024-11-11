'use client'
import { useEffect, useState } from "react";
import useStore from '@/app/store';
import { useRouter } from "next/navigation";
import { db, auth, storage } from '/src/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import fetchInfo from "@/app/api/gemini/fetchInfo";
import {
	Box,
	Button,
  Grid,
	Container,
	Typography,
  Paper,
	IconButton,
  TextField
} from "@mui/material";
import { TopNavbar } from "../../components/topNav";


function Page() {
  const router = useRouter();
  const { uploadedImage } = useStore();
  const { items } = useStore();
  let itemList = [];
  // const [itemList, setItemList] = useState([]);
  // let itemList = [];
  const members = [
    {
      'uid': 1,
      'name': 'Akash'
    },
    {
      'uid': 2,
      'name': 'Hrishi'
    },
    {
      'uid': 3,
      'name': 'Manasa'
    },
    {
      'uid': 4,
      'name': 'Panda'
    },
    {
      'uid': 5,
      'name': 'Rushalle'
    },
    {
      'uid': 6,
      'name': 'Venkat'
    },
    {
      'uid': 7,
      'name': 'Vinay'
    }
  ];
  const [loading, setLoading] = useState(false);
  const [displayAddRow, setDisplayAddRow] = useState(true);
  const [newItem, setNewItem] = useState();
  const [newCost, setNewCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [transDate, setTransDate] = useState('');

  const scrollContainerStyle = {
    height: '80vh', // Adjust height as necessary
    overflowY: 'auto',
    padding: '1rem',
  };

  useEffect(() => {
    // console.log('The items from the store are: ', items);

    console.log('ItemList before: ', itemList);

    let iList = [];
    items.forEach(element => {
      iList.push({
        'name': element.name,
        'quantity': element.quantity,
        'price': 0
      });
    });

    const storageItems = localStorage.getItem('itemsList');

    localStorage.setItem('itemsList', storageItems || iList);
    itemList = localStorage.getItem('itemsList');
    // itemList = iList;

    console.log('ItemList after: ', itemList);
  }, []);

  const handleSaveTransaction = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        let imageUrl = null; // Will store the image URL from Firebase Storage

        const res = await fetchInfo(uploadedImage);
        setItemDetails(res);

        if (uploadedImage) { // If an image was selected
          const storageRef = ref(storage, `receiptImages/`); // Unique path in Firebase Storage
          await uploadBytes(storageRef, uploadedImage);
          imageUrl = await getDownloadURL(storageRef);
        }

        const transactionsCollection = collection(db, 'Transactions');
        await addDoc(transactionsCollection, {
          receiptUrl: imageUrl
          // TODO: add other fields here
        });

        router.push('');
      } else {
        console.error('User not authenticated.');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  }

  const addItemHandler = () => {
    console.log('Add item handler');
    setDisplayAddRow(false);
  }

  const saveItemHandler = () => {
    itemList.push({
      'key': 'newItem',
      'name': newItem,
      'price': newCost
    });
    setDisplayAddRow(true);
    setNewCost(null);
    setNewItem('');

    localStorage.setItem('localItems', itemList);
  }

  return (
    <>
      <TopNavbar icon={ <></> } />
      <Container>
        <Grid container spacing={2} sx={{ height: '100vh', padding: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box component={Paper} sx={scrollContainerStyle}>
              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              {itemList.map((item) => (
                <Paper sx={{ padding: 2, marginBottom: 2, cursor: 'pointer' }}>
                  <Typography variant="body1">{item.name} {item.quantity == null && (item.quantity)}</Typography>
                </Paper>
              ))}
              { displayAddRow && <Paper sx={{ padding: 2, marginBottom: 2, cursor: 'pointer', background: 'orange' }} onClick={addItemHandler}>
                <Typography variant="body1">Add item</Typography>
              </Paper> }
              { !displayAddRow && <Paper sx={{ padding: 2, marginBottom: 2, cursor: 'pointer' }}>
                <Grid xs={3}>
                  <TextField onChange={(e) => setNewItem(e)} label="Item" variant="outlined" />
                </Grid>
                <Grid xs={3}>
                  <TextField onChange={(e) => setNewCost(e)} label="Cost" variant="outlined" />
                </Grid>
                <Grid xs={3}>
                  <Button onClick={saveItemHandler}>Save</Button>
                </Grid>
              </Paper> }
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
            <Box component={Paper} sx={scrollContainerStyle}>
              <Typography variant="h6" gutterBottom>
                Members
              </Typography>
              {members.map((member) => (
                <Paper sx={{ padding: 2, marginBottom: 2 }}>
                  <Typography variant="body1">{ member.name }</Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Button>Add item</Button>
        {/* <Box>
          <h3>Assign Items</h3>
          <h4>The items:</h4>
          <ul>
            {items.map((item) => (
              <li>{item.name}, {item.price}, {item.quantity}</li>
            ))}
          </ul>
        </Box> */}
      </Container>
    </>
  );
}

export default Page;