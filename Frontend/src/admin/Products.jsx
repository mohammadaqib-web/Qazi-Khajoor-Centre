import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Backdrop, CircularProgress } from "@mui/material";

const Products = () => {
  const { token } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: null,
    sizes: [{ size: "", price: "", stock: "" }],
  });

  // ---------------- FETCH DATA ----------------

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${import.meta.env.VITE_APP_API}/products`);

      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${import.meta.env.VITE_APP_API}/categories`);

      setCategories(res.data.categories);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ---------------- FORM HANDLING ----------------

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "", price: "", stock: "" }],
    });
  };

  const removeSize = (index) => {
    const updatedSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: updatedSizes });
  };

  // ---------------- OPEN DIALOG ----------------

  const handleOpen = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category._id,
        image: null,
        sizes: product.sizes,
      });
      setPreview(product.images?.url || null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        image: null,
        sizes: [{ size: "", price: "", stock: "" }],
      });
      setPreview(null);
    }
    setOpen(true);
  };

  // ---------------- SAVE PRODUCT ----------------

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) return toast.error("Product name is required");

      if (!formData.description.trim())
        return toast.error("Description is required");

      if (!formData.category) return toast.error("Category is required");

      if (!editingProduct && !formData.image)
        return toast.error("Image is required");

      for (let size of formData.sizes) {
        if (!size.size.trim()) return toast.error("Size is required");

        if (!size.price) return toast.error("Price is required");

        if (!size.stock) return toast.error("Stock is required");
      }
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("sizes", JSON.stringify(formData.sizes));

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingProduct) {
        await axios.put(
          `${import.meta.env.VITE_APP_API}/products/${editingProduct._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_APP_API}/products`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product created successfully");
      }

      fetchProducts();
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_APP_API}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={"center"}
        mb={2}
      >
        <h2>Products</h2>
        <Button
          variant="contained"
          onClick={() => handleOpen()}
          sx={{ height: "40px" }}
        >
          Add Product
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Starting Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => {
            const minPrice = Math.min(...product.sizes.map((s) => s.price));

            return (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={product.images?.url}
                    alt={product.name}
                    width="50"
                    style={{ borderRadius: "6px" }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>₹ {minPrice}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleOpen(product)}
                    disabled={loading}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product._id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={() => !loading && setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            required
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            fullWidth
            required
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <Box mb={2}>
            <Button component="label" variant="outlined">
              Upload Image
              <input
                hidden
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </Button>

            {preview && (
              <Box mt={2}>
                <img
                  src={preview}
                  alt="Preview"
                  width="120"
                  style={{ borderRadius: "8px" }}
                />
              </Box>
            )}
          </Box>

          {formData.sizes.map((sizeObj, index) => (
            <Box key={index} display="flex" gap={2} mb={2}>
              <TextField
                label="Size"
                required
                value={sizeObj.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
              />
              <TextField
                label="Price"
                type="number"
                required
                value={sizeObj.price}
                onChange={(e) =>
                  handleSizeChange(index, "price", e.target.value)
                }
              />
              <TextField
                label="Stock"
                type="number"
                required
                value={sizeObj.stock}
                onChange={(e) =>
                  handleSizeChange(index, "stock", e.target.value)
                }
              />
              <IconButton onClick={() => removeSize(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button startIcon={<AddIcon />} onClick={addSize} variant="outlined">
            Add Size
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};

export default Products;
