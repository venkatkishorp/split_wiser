'use client';

import Image from 'next/image';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { collection, addDoc, } from 'firebase/firestore';
import { db, auth, storage } from '/src/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TopNavbar } from '../../components/topNav';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export default function Page() {
  const [newGroup, setNewGroup] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const router = useRouter();
  const icon = <h5>Done</h5>;

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(event.target.files[0])
    }
  };


  const handleCreateGroup = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        let imageUrl = null; // Will store the image URL from Firebase Storage

        if (image) { // If an image was selected
          const storageRef = ref(storage, `groupIcons/${image.name}`); // Unique path in Firebase Storage
          await uploadBytes(storageRef, image);
          imageUrl = await getDownloadURL(storageRef);
        }

        const userGroupsCollection = collection(db, 'UserGroups');
        const docRef = await addDoc(userGroupsCollection, {
          name: newGroup,
          owner: user.uid,
          users: [user.uid],
          imageUrl: imageUrl
        });

        router.push(`/groupTrans?groupId=${docRef.id}`);
        // console.log('Group created');
      } else {
        console.error('User not authenticated.');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  }


  return (
    <>
      <TopNavbar icon={ icon } function={ handleCreateGroup } />
      <Container sx={{ marginY: 2 }}>
        <Box sx={{ display: 'flex', width: '100%' }} component="form" noValidate autoComplete="off">
          {
            previewUrl ?
              <Image
                src={previewUrl}
                alt="Group Icon Preview"
                width={75}
                height={75}
                objectFit="cover"
              /> : <IconButton aria-label="Group Icon" component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                color="primary"
                sx={{ padding: 1.75 }}
              >
                <FontAwesomeIcon icon={faImage} size="2x" />
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
              </IconButton>
          }

          <TextField fullWidth sx={{ marginX: 2 }} id="standard-basic" label="Group name" variant="standard" onChange={(e) => setNewGroup(e.target.value)} />
        </Box>
      </Container>
    </>
  );

}