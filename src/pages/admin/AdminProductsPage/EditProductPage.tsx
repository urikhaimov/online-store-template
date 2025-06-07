// src/pages/admin/EditProductPage.tsx
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Grid,
  LinearProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { fetchCategories } from '../../../api/categories';
import { getProductById, updateProduct } from '../../../api/products';
import type { Category, Product } from '../../../types/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app  } from '../../../api/firebase';
//import { arrayMoveImmutable } from 'array-move';
import { useDropzone } from 'react-dropzone';

type FormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrls: string[];
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const storage = getStorage(app);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      imageUrls: [],
    },
  });

  useEffect(() => {
    fetchCategories().then(setCategories);

    if (productId) {
      getProductById(productId)
        .then((prod) => {
          if (prod) {
            setProduct(prod);
            const defaults = {
              name: prod.name,
              description: prod.description,
              price: String(prod.price),
              stock: String(prod.stock),
              categoryId: prod.categoryId,
              imageUrls: prod.imageUrls || [],
            };
            Object.entries(defaults).forEach(([key, val]) =>
              setValue(key as keyof FormState, val)
            );
          } else {
            setProduct(null);
          }
        })
        .catch((err) => {
          console.error('❌ Error loading product:', err);
          setProduct(null);
        });
    }
  }, [productId, setValue]);

  const onDrop = async (acceptedFiles: File[]) => {
    const current = getValues('imageUrls');
    if (current.length + acceptedFiles.length > MAX_IMAGES) {
      alert('Max 5 images allowed');
      return;
    }

    for (const file of acceptedFiles) {
      if (!file.type.startsWith('image/') || file.size > MAX_FILE_SIZE) {
        alert('Only images under 2MB allowed');
        continue;
      }

      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);

      uploadTask.on(
        'state_changed',
        (snap) => {
          const percent = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setUploadProgress(percent);
        },
        (error) => {
          console.error(error);
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const updated = [...getValues('imageUrls'), url];
          setValue('imageUrls', updated);
          setUploading(false);
        }
      );
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onDeleteImage = (url: string) => {
    const updated = getValues('imageUrls').filter((img) => img !== url);
    setValue('imageUrls', updated);
  };

  const onSubmit = async (data: FormState) => {
    if (!productId) return;
    try {
      await updateProduct(productId, {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: data.categoryId,
        imageUrls: data.imageUrls,
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (err) {
      console.error('❌ Update failed:', err);
    }
  };

  if (product === undefined) return <CircularProgress sx={{ mt: 4 }} />;
  if (product === null)
    return <Typography sx={{ mt: 4 }}>❌ Product not found or failed to load.</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 700 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Product Name"
            {...register('name', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name && 'Name is required'}
          />
          <TextField
            label="Description"
            {...register('description', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.description}
            helperText={errors.description && 'Description is required'}
          />
          <TextField
            label="Price"
            type="number"
            {...register('price', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.price}
            helperText={errors.price && 'Price is required'}
          />
          <TextField
            label="Stock"
            type="number"
            {...register('stock', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.stock}
            helperText={errors.stock && 'Stock is required'}
          />
          <TextField
            label="Category"
            select
            {...register('categoryId', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.categoryId}
            helperText={errors.categoryId && 'Category is required'}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={2}>
            <Typography variant="subtitle1">Product Images</Typography>
            <Box
              {...getRootProps()}
              sx={{
                border: '1px dashed grey',
                p: 2,
                mt: 1,
                cursor: 'pointer',
                bgcolor: '#fafafa',
              }}
            >
              <input {...getInputProps()} />
              <Typography>Drag & drop or click to upload (max 5)</Typography>
            </Box>
            {uploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 1 }} />}
          </Box>

          <Controller
            name="imageUrls"
            control={control}
            render={({ field }) => (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {field.value.map((url) => (
                  <Grid item key={url}>
                    <Box position="relative">
                      <img src={url} alt="product" width={100} height={100} style={{ borderRadius: 8 }} />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const updated = field.value.filter((u) => u !== url);
                          field.onChange(updated);
                        }}
                        sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'white' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          />

          <Box mt={3}>
            <Button variant="contained" type="submit" disabled={uploading}>
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Product updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
