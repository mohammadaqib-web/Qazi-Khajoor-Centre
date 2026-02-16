import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Chip,
  Backdrop,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Users = () => {
  const { token, user: loggedInUser } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH USERS ----------------

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------- DELETE USER ----------------

  const handleDelete = async (id) => {
    try {
      if (id === loggedInUser._id) {
        return toast.error("You cannot delete yourself");
      }

      setLoading(true);

      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- TOGGLE ACTIVE ----------------

  const toggleUserStatus = async (user) => {
    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        { isActive: !user.isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("User status updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Users
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>

                <TableCell>{user.number}</TableCell>

                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === "admin" ? "primary" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={user.isActive ? "Active" : "Blocked"}
                    color={user.isActive ? "success" : "error"}
                    size="small"
                  />
                </TableCell>

                <TableCell>{user.address || "—"}</TableCell>

                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleUserStatus(user)}
                      disabled={loading}
                    >
                      {user.isActive ? "Block" : "Unblock"}
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user._id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* FULL SCREEN LOADER */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999,
        }}
        open={loading}
      >
        <CircularProgress size={60} thickness={5} />
      </Backdrop>
    </>
  );
};

export default Users;
