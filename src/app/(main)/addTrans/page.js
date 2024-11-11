'use client'

import {
	Box,
	Button,
	Container,
	Typography,
	IconButton,

} from "@mui/material";
import Image from 'next/image';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { styled } from '@mui/material/styles';
import { collection, addDoc, query, } from 'firebase/firestore';
import { db, auth, storage } from '/src/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useStore from "@/app/store";
import fetchInfo from "@/app/api/gemini/fetchInfo";
import { TopNavbar } from "../components/topNav";

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


function Page() {
	const router = useRouter();
	const { setImage, uploadedImage, setItems, items } = useStore();
	const [itemDetails, setItemDetails] = useState();
	const [subTotal, setSubTotal] = useState(0);
	const [tax, setTax] = useState(0);
	const [total, setTotal] = useState(0);
	const [transDate, setTransDate] = useState('');

	const handleImageChange = (event) => {
		if (event.target.files[0]) {
			// setImage(event.target.files[0]);

			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
			};
			reader.readAsDataURL(event.target.files[0])
		}
	};

	const handleUploadReceipt = async () => {
		try {
			const user = auth.currentUser;
			if (user) {
				if (user) {
					const res = await fetchInfo(uploadedImage);
					console.log('Result is: ', res);
					if (res) {
						setItems(res.items);
						setSubTotal(res.subtotal);
						setTax(res.tax);
						setTotal(res.total);
						setTransDate(res.transactionDate);
					}

					setItemDetails(res);
				}
				else {
					console.error('User not authenticated.');
				}
				router.push(`/addTrans/assignItems`);
			} else {
				console.error('User not authenticated.');
			}
		} catch (error) {
			console.error('Error creating group:', error);
		}
	}

	const handleManualSplit = () => {
		router.push('/addTrans/manualSplit')
	}

	const handleScanReceipt = () => {
		router.push('/addTrans/cameraProp')
	}

	return (
		<>
			<TopNavbar icon={ <></> } />
			<Container>
				<Box>
					<Button onClick={handleManualSplit}>
						Enter Split Manually
					</Button>
				</Box>
				<Box>
					<h6>Automatically Create Split</h6>
					<Typography variant="caption">Upload Receipt image</Typography>
					<Box sx={{ display: 'flex', width: '100%' }} component="form" noValidate autoComplete="off">
						{
							uploadedImage ?
								<Image
									src={uploadedImage}
									alt="Receipt Preview"
									width={250}
									height={400}
									objectFit="cover"
								/> : <IconButton aria-label="Receipt" component="label"
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
						<Button onClick={handleUploadReceipt}>
							Upload Receipt
						</Button>
					</Box>

					<Button onClick={handleScanReceipt}>
						Scan Receipt
					</Button>

				</Box>
			</Container>
		</>
	);
}

export default Page;