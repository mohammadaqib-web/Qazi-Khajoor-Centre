import { useState, useEffect } from "react";
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
  Backdrop,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Category = () => {
  const { token } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open Add
  const handleAdd = () => {
    setEditingCategory(null);
    setName("");
    setOpen(true);
  };

  // Open Edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setOpen(true);
  };

  // ✅ Save (Create or Update)
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      if (editingCategory) {
        await axios.put(
          `http://localhost:5000/api/categories/${editingCategory._id}`,
          { name },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Category updated!");
      } else {
        await axios.post(
          "http://localhost:5000/api/categories",
          { name },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Category created!");
      }

      setOpen(false);
      setName("");
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Category
  const handleDelete = async (id) => {
    try {
      setLoading(true);

      await axios.delete(
        `http://localhost:5000/api/categories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Category deleted!");
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <h2>Categories</h2>
          <Button variant="contained" onClick={handleAdd}>
            Add Category
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEdit(category)}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(category._id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog */}
        <Dialog
          open={open}
          onClose={() => !loading && setOpen(false)}
        >
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Add Category"}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mt: 2 }}
              disabled={loading}
            />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      {/* FULL SCREEN LOADER */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Category;
